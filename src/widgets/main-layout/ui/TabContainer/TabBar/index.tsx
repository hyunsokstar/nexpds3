// src/widgets/main-layout/ui/TabContainer/TabBar/index.tsx
import React, { useCallback, useState, useRef } from 'react'
import { useTabsStore, TabArea, Tab } from '@/widgets/main-layout/store/use-tabs'
import { X, MoveRight, Maximize, Columns, LayoutGrid, LayoutPanelLeft } from 'lucide-react'
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCenter,
  DragOverEvent,
  useDroppable
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  horizontalListSortingStrategy
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'

interface Props {
  className?: string;
  area?: TabArea;
  areaIndex?: number;
  disableDndContext?: boolean; // 상위 컴포넌트에서 DndContext 제공 시 사용
}

// 개별 탭 항목 컴포넌트
const TabItem = ({ tab, isActive, onActivate, onClose, isSplit, canMove, onMove, areaId }: {
  tab: Tab;
  isActive: boolean;
  onActivate: () => void;
  onClose: (e: React.MouseEvent) => void;
  isSplit: boolean;
  canMove: boolean;
  onMove?: (e: React.MouseEvent) => void;
  areaId: string;
}) => {
  // DnD-Kit용 Sortable 후크 사용
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({
    id: tab.id,
    data: {
      type: 'tab',
      tab,
      areaId
    }
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 10 : 1
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`
        flex items-center h-10 px-4 py-2 cursor-pointer border-r border-gray-200
        ${isActive ? 'bg-blue-50 border-b-2 border-b-blue-500' : 'hover:bg-gray-100'}
        ${isDragging ? 'z-10 opacity-50 shadow-lg' : ''}
      `}
      onClick={onActivate}
      {...attributes}
      {...listeners}
    >
      <span className="mr-2">{tab.title}</span>
      
      {/* 분할 모드일 때만 이동 버튼 표시 */}
      {isSplit && canMove && (
        <button
          className="p-1 rounded-full hover:bg-gray-200 mr-1"
          onClick={onMove}
          title="다음 영역으로 이동"
        >
          <MoveRight size={14} />
        </button>
      )}
      
      <button
        className="p-1 rounded-full hover:bg-gray-200"
        onClick={onClose}
        title="탭 닫기"
      >
        <X size={16} />
      </button>
    </div>
  );
};

// 드래그 중인 탭 오버레이 컴포넌트
const DraggingTabOverlay = ({ tab }: { tab: Tab | null }) => {
  if (!tab) return null;
  
  return (
    <div
      className="flex items-center h-10 px-4 py-2 cursor-grabbing border border-gray-300 bg-white shadow-lg rounded"
    >
      <span className="mr-2">{tab.title}</span>
      <X size={16} className="opacity-50" />
    </div>
  );
};

// 드롭 가능한 영역 표시 컴포넌트
const DropIndicator = ({ isOver }: { isOver: boolean }) => {
  if (!isOver) return null;
  
  return (
    <div className="absolute inset-0 bg-blue-100 bg-opacity-30 border-2 border-blue-400 border-dashed rounded-md pointer-events-none z-10" />
  );
};

const TabBar = ({ className = '', area, areaIndex = 0, disableDndContext = false }: Props) => {
  // 드래그 중인 탭 상태
  const [activeTab, setActiveTab] = useState<Tab | null>(null);
  
  // 영역 특화 모드 또는 통합 모드에 따라 다른 데이터 사용
  const tabs = area ? area.tabs : useTabsStore(state => state.tabs);
  const activeTabId = area ? area.activeTabId : useTabsStore(state => state.activeTabId);
  const activateTab = useTabsStore(state => state.activateTab);
  const closeTab = useTabsStore(state => state.closeTab);
  const splitTabArea = useTabsStore(state => state.splitTabArea);
  const moveTabToArea = useTabsStore(state => state.moveTabToArea);
  const closeArea = useTabsStore(state => state.closeArea);
  const splitMode = useTabsStore(state => state.splitMode);
  const areas = useTabsStore(state => state.areas);
  const reorderTabs = useTabsStore(state => state.reorderTabs);
  
  // 현재 영역의 ID
  const currentAreaId = area ? area.id : 'main';
  
  // 드롭 영역 설정
  const { setNodeRef: setDroppableRef, isOver } = useDroppable({
    id: currentAreaId,
    data: {
      type: 'area',
      areaId: currentAreaId
    }
  });
  
  // 포인터 센서 설정
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8, // 8px 이상 드래그해야 활성화
      },
    })
  );
  
  // 이벤트 핸들러
  const handleTabClick = useCallback((tabId: string) => {
    activateTab(tabId);
  }, [activateTab]);

  const handleCloseClick = useCallback((e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    closeTab(tabId);
  }, [closeTab]);
  
  // 분할 관련 핸들러
  const handleUnsplit = useCallback(() => {
    splitTabArea(1); // 분할 해제 (1개 영역으로)
  }, [splitTabArea]);
  
  const handleSplit2 = useCallback(() => {
    splitTabArea(2);
  }, [splitTabArea]);
  
  const handleSplit3 = useCallback(() => {
    splitTabArea(3);
  }, [splitTabArea]);
  
  const handleSplit4 = useCallback(() => {
    splitTabArea(4);
  }, [splitTabArea]);
  
  // 영역 닫기 핸들러
  const handleCloseArea = useCallback(() => {
    if (!area || areas.length <= 1) return;
    closeArea(area.id);
  }, [area, areas.length, closeArea]);
  
  // 탭 이동 핸들러 (버튼 클릭 시)
  const handleMoveTab = useCallback((e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    
    // 분할 상태가 아니면 이동할 필요 없음
    if (splitMode !== 'split' || areas.length <= 1) return;
    
    // 현재 탭이 속한 영역 찾기
    let currentAreaId = null;
    for (const a of areas) {
      if (a.tabs.some(t => t.id === tabId)) {
        currentAreaId = a.id;
        break;
      }
    }
    
    if (!currentAreaId) return;
    
    // 다음 영역 ID 찾기 (순환)
    const areaIndex = areas.findIndex(a => a.id === currentAreaId);
    const nextIndex = (areaIndex + 1) % areas.length;
    const targetAreaId = areas[nextIndex].id;
    
    // 탭 이동
    moveTabToArea(tabId, targetAreaId);
  }, [areas, moveTabToArea, splitMode]);

  // DnD 시작 핸들러
  const handleDragStart = useCallback((event: DragStartEvent) => {
    const { active } = event;
    const activeData = active.data.current;
    
    if (activeData && activeData.tab) {
      setActiveTab(activeData.tab);
    }
  }, []);

  // DnD 종료 핸들러
  const handleDragEnd = useCallback((event: DragEndEvent) => {
    const { active, over } = event;
    
    // 드래그 상태 초기화
    setActiveTab(null);
    
    // 드롭 대상이 없으면 무시
    if (!over) return;
    
    const activeData = active.data.current;
    const overData = over.data.current;
    
    // 서로 다른 영역 간 이동
    if (activeData && overData && 
        activeData.areaId !== overData.areaId && 
        activeData.tab) {
      moveTabToArea(activeData.tab.id, overData.areaId);
      return;
    }
    
    // 같은 영역 내 순서 변경
    if (active.id !== over.id && 
        activeData && activeData.areaId === currentAreaId) {
      const activeIndex = tabs.findIndex(tab => tab.id === active.id);
      const overIndex = tabs.findIndex(tab => tab.id === over.id);
      
      if (activeIndex !== -1 && overIndex !== -1) {
        reorderTabs(currentAreaId, activeIndex, overIndex);
      }
    }
  }, [tabs, moveTabToArea, reorderTabs, currentAreaId]);

  // 영역별 탭바인 경우에는 분할 버튼을 표시하지 않음
  const showSplitButtons = !area;
  const hasTabs = tabs.length > 0;
  const isSplit = splitMode === 'split';
  
  // 탭 ID 목록
  const tabIds = tabs.map(tab => tab.id);

  // 탭바 내용 컴포넌트
  const content = (
    <div 
      ref={setDroppableRef}
      className={`flex justify-between border-b border-gray-200 bg-white ${className} relative`}
    >
      <DropIndicator isOver={isOver} />
      
      <div className="flex overflow-x-auto">
        {hasTabs ? (
          <SortableContext items={tabIds} strategy={horizontalListSortingStrategy}>
            {tabs.map(tab => (
              <TabItem
                key={tab.id}
                tab={tab}
                isActive={activeTabId === tab.id}
                onActivate={() => handleTabClick(tab.id)}
                onClose={(e) => handleCloseClick(e, tab.id)}
                isSplit={isSplit}
                canMove={areas.length > 1}
                onMove={(e) => handleMoveTab(e, tab.id)}
                areaId={currentAreaId}
              />
            ))}
          </SortableContext>
        ) : (
          <div className="p-2 text-sm text-gray-500">탭이 없습니다</div>
        )}
      </div>
      
      {/* 탭 컨트롤 버튼 */}
      <div className="flex items-center">
        {/* 영역 닫기 버튼 (영역별 탭바에서만 표시) */}
        {area && isSplit && areas.length > 1 && (
          <button 
            className="flex items-center justify-center w-8 h-10 ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
            onClick={handleCloseArea}
            title="영역 닫기"
          >
            <X size={16} />
          </button>
        )}
        
        {/* 분할 관련 버튼들 - 영역별 탭바에서는 표시하지 않음 */}
        {showSplitButtons && (
          <div className="flex items-center">
            {/* 분할 해제 버튼 (분할 상태일 때만) */}
            {isSplit && (
              <button 
                className="flex items-center justify-center w-8 h-10 ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                onClick={handleUnsplit}
                title="분할 해제 (단일 화면)"
              >
                <Maximize size={16} />
              </button>
            )}
            
            {/* 2분할 버튼 - 수직 분할을 더 명확하게 표시 */}
            <button 
              className="flex items-center justify-center w-8 h-10 ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              onClick={handleSplit2}
              title="2분할 (좌우)"
            >
              <Columns size={16} />
            </button>
            
            {/* 3분할 버튼 - 실제 3분할 레이아웃처럼 보이는 아이콘 */}
            <button 
              className="flex items-center justify-center w-8 h-10 ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              onClick={handleSplit3}
              title="3분할 (좌측 1개, 우측 2개)"
            >
              <LayoutPanelLeft size={16} />
            </button>
            
            {/* 4분할 버튼 - 2x2 그리드를 명확하게 표시 */}
            <button 
              className="flex items-center justify-center w-8 h-10 ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              onClick={handleSplit4}
              title="4분할 (2x2 그리드)"
            >
              <LayoutGrid size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
  
  // 상위 컴포넌트에서 DndContext가 제공되는 경우
  if (disableDndContext) {
    return content;
  }
  
  // 독립적으로 사용되는 경우 자체 DndContext 제공
  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      {content}
      
      {/* 드래그 중인 탭 오버레이 */}
      <DragOverlay>
        {activeTab && <DraggingTabOverlay tab={activeTab} />}
      </DragOverlay>
    </DndContext>
  );
}

export default React.memo(TabBar)