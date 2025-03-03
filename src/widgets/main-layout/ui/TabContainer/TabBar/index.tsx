// src/widgets/main-layout/ui/TabContainer/TabBar/index.tsx
import React, { useCallback } from 'react'
import { useTabsStore, TabArea } from '@/widgets/main-layout/store/use-tabs'
import { X, Grid, Split, Maximize, MoveRight } from 'lucide-react'

interface Props {
  className?: string;
  area?: TabArea;
}

const TabBar = ({ className = '', area }: Props) => {
  // 영역 특화 모드 또는 통합 모드에 따라 다른 데이터 사용
  const tabs = area ? area.tabs : useTabsStore(state => state.tabs);
  const activeTabId = area ? area.activeTabId : useTabsStore(state => state.activeTabId);
  const activateTab = useTabsStore(state => state.activateTab);
  const closeTab = useTabsStore(state => state.closeTab);
  const splitTabArea = useTabsStore(state => state.splitTabArea);
  const moveTabToArea = useTabsStore(state => state.moveTabToArea);
  const closeArea = useTabsStore(state => state.closeArea); // 영역 닫기 함수 가져오기
  const splitMode = useTabsStore(state => state.splitMode);
  const areas = useTabsStore(state => state.areas);
  
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
  
  // 탭 이동 핸들러
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

  // 영역별 탭바인 경우에는 분할 버튼을 표시하지 않음
  const showSplitButtons = !area;
  const hasTabs = tabs.length > 0;
  const isSplit = splitMode === 'split';

  return (
    <div className={`flex justify-between border-b border-gray-200 bg-white ${className}`}>
      <div className="flex overflow-x-auto">
        {hasTabs ? (
          tabs.map(tab => (
            <div 
              key={tab.id}
              className={`
                flex items-center h-10 px-4 py-2 cursor-pointer border-r border-gray-200
                ${activeTabId === tab.id 
                  ? 'bg-blue-50 border-b-2 border-b-blue-500' 
                  : 'hover:bg-gray-100'}
              `}
              onClick={() => handleTabClick(tab.id)}
            >
              <span className="mr-2">{tab.title}</span>
              
              {/* 분할 모드일 때만 이동 버튼 표시 */}
              {isSplit && areas.length > 1 && (
                <button
                  className="p-1 rounded-full hover:bg-gray-200 mr-1"
                  onClick={(e) => handleMoveTab(e, tab.id)}
                  title="다음 영역으로 이동"
                >
                  <MoveRight size={14} />
                </button>
              )}
              
              <button
                className="p-1 rounded-full hover:bg-gray-200"
                onClick={(e) => handleCloseClick(e, tab.id)}
                title="탭 닫기"
              >
                <X size={16} />
              </button>
            </div>
          ))
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
          <>
            {/* 분할 해제 버튼 (분할 상태일 때만) */}
            {isSplit && (
              <button 
                className="flex items-center justify-center w-8 h-10 ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
                onClick={handleUnsplit}
                title="분할 해제"
              >
                <Maximize size={16} />
              </button>
            )}
            
            {/* 분할 버튼들 */}
            <button 
              className="flex items-center justify-center w-8 h-10 ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              onClick={handleSplit2}
              title="2분할"
            >
              <Split size={16} />
            </button>
            
            <button 
              className="flex items-center justify-center w-8 h-10 ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              onClick={handleSplit3}
              title="3분할"
            >
              <Grid size={16} />
            </button>
            
            <button 
              className="flex items-center justify-center w-8 h-10 ml-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded"
              onClick={handleSplit4}
              title="4분할"
            >
              <Grid size={16} />
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default React.memo(TabBar)