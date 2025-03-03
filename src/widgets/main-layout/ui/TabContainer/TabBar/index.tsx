// src/widgets/main-layout/ui/TabContainer/TabBar/index.tsx
import React, { useCallback } from 'react'
import { useTabsStore } from '@/widgets/main-layout/store/use-tabs'
import { X } from 'lucide-react'

interface Props {
  className?: string;
}

const TabBar = ({ className = '' }: Props) => {
  // 필요한 상태와 액션만 구독
  const tabs = useTabsStore(state => state.tabs);
  const activeTabId = useTabsStore(state => state.activeTabId);
  const activateTab = useTabsStore(state => state.activateTab);
  const closeTab = useTabsStore(state => state.closeTab);

  // 이벤트 핸들러를 메모이제이션
  const handleTabClick = useCallback((tabId: string) => {
    activateTab(tabId);
  }, [activateTab]);

  const handleCloseClick = useCallback((e: React.MouseEvent, tabId: string) => {
    e.stopPropagation();
    closeTab(tabId);
  }, [closeTab]);

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className={`flex border-b border-gray-200 bg-white ${className}`}>
      {tabs.map(tab => (
        <div 
          key={tab.id}
          className={`
            flex items-center px-4 py-2 cursor-pointer border-r border-gray-200
            ${activeTabId === tab.id 
              ? 'bg-blue-50 border-b-2 border-b-blue-500' 
              : 'hover:bg-gray-100'}
          `}
          onClick={() => handleTabClick(tab.id)}
        >
          <span className="mr-2">{tab.title}</span>
          <button
            className="p-1 rounded-full hover:bg-gray-200"
            onClick={(e) => handleCloseClick(e, tab.id)}
          >
            <X size={16} />
          </button>
        </div>
      ))}
    </div>
  )
}

export default React.memo(TabBar)