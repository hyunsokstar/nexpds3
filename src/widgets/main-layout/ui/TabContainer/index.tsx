// src/widgets/main-layout/ui/TabContainer/index.tsx
import React, { useCallback, useRef, useState, useEffect } from 'react'
import { Resizable } from 're-resizable'
import TabBar from './TabBar'
import TabContent from './TabContent'
import { useTabsStore, Tab } from '@/widgets/main-layout/store/use-tabs'
import { 
  DndContext, 
  DragOverlay, 
  DragEndEvent, 
  DragStartEvent,
  PointerSensor, 
  useSensors, 
  useSensor,
  closestCenter
} from '@dnd-kit/core'
import { X } from 'lucide-react'

interface Props {
  className?: string;
}

const TabContainer: React.FC<Props> = ({ className = '' }) => {
  const splitMode = useTabsStore(state => state.splitMode);
  const areas = useTabsStore(state => state.areas);
  const areaWidths = useTabsStore(state => state.areaWidths);
  const hasTabs = useTabsStore(state => state.tabs.length > 0);
  const moveTabToArea = useTabsStore(state => state.moveTabToArea);
  const reorderTabs = useTabsStore(state => state.reorderTabs);

  // 컨테이너 ref
  const containerRef = useRef<HTMLDivElement>(null);
  // 현재 컨테이너 너비
  const [containerWidth, setContainerWidth] = useState<number>(0);
  // 현재 리사이징 중인 영역 인덱스 (-1은 리사이징 중인 영역 없음)
  const [resizingIndex, setResizingIndex] = useState<number>(-1);
  // 드래그 중인 탭 상태
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  
  // 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  // 컨테이너 너비를 측정하고 업데이트
  useEffect(() => {
    if (containerRef.current) {
      setContainerWidth(containerRef.current.clientWidth);

      // 리사이즈 시 컨테이너 너비 업데이트
      const handleResize = () => {
        if (containerRef.current) {
          setContainerWidth(containerRef.current.clientWidth);
        }
      };

      window.addEventListener('resize', handleResize);
      return () => window.removeEventListener('resize', handleResize);
    }
  }, []);

  // 리사이징 시작 이벤트 핸들러
  const handleResizeStart = useCallback((index: number) => {
    setResizingIndex(index);
  }, []);

  // 리사이징 종료 이벤트 핸들러
  const handleResizeStop = useCallback((index: number, delta: { width: number }) => {
    if (containerWidth === 0 || index >= areaWidths.length - 1) return;

    // 너비 변화량을 백분율로 변환
    const deltaPercent = (delta.width / containerWidth) * 100;

    // 새 너비 계산
    const newWidths = [...areaWidths];

    // 최소/최대 너비 제한
    const MIN_WIDTH = 10;
    const newLeftWidth = Math.max(MIN_WIDTH, newWidths[index] + deltaPercent);
    const newRightWidth = Math.max(MIN_WIDTH, newWidths[index + 1] - deltaPercent);

    // 합이 원래 두 영역의 합과 같아지도록 조정
    const originalSum = newWidths[index] + newWidths[index + 1];
    const newSum = newLeftWidth + newRightWidth;

    if (newSum !== originalSum) {
      // 비율을 유지하면서 조정
      const adjustFactor = originalSum / newSum;
      newWidths[index] = newLeftWidth * adjustFactor;
      newWidths[index + 1] = newRightWidth * adjustFactor;
    } else {
      newWidths[index] = newLeftWidth;
      newWidths[index + 1] = newRightWidth;
    }

    // 스토어 업데이트
    useTabsStore.setState({ areaWidths: newWidths });

    // 리사이징 상태 해제
    setResizingIndex(-1);
  }, [areaWidths, containerWidth]);
  
  // 드래그 시작 핸들러
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;
    
    if (activeData && activeData.tab) {
      setActiveTab(activeData.tab);
    }
  }, []);
  
  // 드래그 종료 핸들러
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTab(null);
    
    if (!over) return;
    
    const activeData = active.data.current;
    const overData = over.data.current;
    
    // 서로 다른 영역 간 이동
    if (activeData && overData && 
        activeData.areaId !== overData.areaId && 
        activeData.tab) {
      moveTabToArea(activeData.tab.id, overData.areaId);
    } 
    // 같은 영역 내 탭 순서 변경
    else if (active.id !== over.id && 
             activeData && overData && 
             activeData.areaId === overData.areaId) {
      const currentArea = areas.find(a => a.id === activeData.areaId);
      if (currentArea) {
        const activeIndex = currentArea.tabs.findIndex(tab => tab.id === active.id);
        const overIndex = currentArea.tabs.findIndex(tab => tab.id === over.id);
        
        if (activeIndex !== -1 && overIndex !== -1) {
          reorderTabs(activeData.areaId, activeIndex, overIndex);
        }
      }
    }
  }, [areas, moveTabToArea, reorderTabs]);

  // 탭이 하나도 없으면 탭바만 표시
  if (!hasTabs && splitMode === 'none') {
    return (
      <div className={`flex flex-col h-full ${className}`} ref={containerRef}>
        <TabBar />
      </div>
    );
  }

  // 분할 모드가 아닌 경우 (기존 방식)
  if (splitMode === 'none') {
    return (
      <div className={`flex flex-col h-full ${className}`} ref={containerRef}>
        <TabBar />
        <TabContent />
      </div>
    );
  }

  // 분할 모드인 경우
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className={`flex h-full ${className}`} ref={containerRef}>
        {areas.map((area, index) => (
          <React.Fragment key={area.id}>
            {index < areas.length - 1 ? (
              // 마지막 영역이 아닌 경우 Resizable 사용
              <Resizable
                className={`flex flex-col border-r overflow-hidden ${
                  resizingIndex === index ? 'z-10' : ''
                }`}
                size={{ 
                  width: `${areaWidths[index]}%`,
                  height: '100%'
                }}
                onResizeStart={() => handleResizeStart(index)}
                onResizeStop={(e, direction, ref, d) => handleResizeStop(index, d)}
                enable={{
                  top: false,
                  right: true,
                  bottom: false,
                  left: false,
                  topRight: false,
                  bottomRight: false,
                  bottomLeft: false,
                  topLeft: false
                }}
                handleStyles={{
                  right: {
                    width: '8px', // 더 넓은 핸들 영역
                    right: '-4px',
                    cursor: 'col-resize',
                    background: 'transparent',
                    zIndex: 20 // 더 높은 z-index
                  }
                }}
                handleClasses={{
                  right: `hover:bg-blue-400 active:bg-blue-500 ${
                    resizingIndex === index ? 'bg-blue-500' : ''
                  }`
                }}
                handleComponent={{
                  right: (
                    <div className="h-full w-2 hover:bg-blue-400 active:bg-blue-500 absolute right-0 top-0" />
                  )
                }}
              >
                <TabBar area={area} areaIndex={index} disableDndContext={true} />
                <TabContent area={area} />
              </Resizable>
            ) : (
              // 마지막 영역은 일반 div 사용 (남은 공간 차지)
              <div 
                className="flex flex-col h-full flex-1"
                style={{ 
                  minWidth: '10%',
                  minHeight: 0
                }}
              >
                <TabBar area={area} areaIndex={index} disableDndContext={true} />
                <TabContent area={area} />
              </div>
            )}
          </React.Fragment>
        ))}
      </div>
      
      {/* 드래그 중인 탭 오버레이 */}
      <DragOverlay>
        {activeTab && (
          <div className="flex items-center h-10 px-4 py-2 cursor-grabbing border border-gray-300 bg-white shadow-lg rounded">
            <span className="mr-2">{activeTab.title}</span>
            <X size={16} className="opacity-50" />
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

export default TabContainer