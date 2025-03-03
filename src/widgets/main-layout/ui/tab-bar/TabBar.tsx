// src/widgets/main-layout/ui/tab-bar/TabBar.tsx
import React from 'react'
import { Tab } from '../../store/use-tabs'
import { TabItem } from './TabItem'

interface TabBarProps {
    tabs: Tab[]
    activeTabId: string | null
    hoveredTabId: string | null
    setHoveredTabId: (id: string | null) => void
    onTabClick: (id: string) => void
    onTabClose: (id: string) => void
    isActive?: boolean
    rightActions?: React.ReactNode
}

export function TabBar({
    tabs,
    activeTabId,
    hoveredTabId,
    setHoveredTabId,
    onTabClick,
    onTabClose,
    isActive = true,
    rightActions
  }: TabBarProps) {
    return (
      <div 
        className={`
          bg-gray-100 dark:bg-gray-800 h-9 w-full px-1 py-1 flex items-center justify-between
          border-b border-gray-300 dark:border-gray-700 ${isActive ? 'bg-opacity-100' : 'bg-opacity-60'}
        `}
      >
        {/* 탭 리스트 컨테이너 */}
        <div className="overflow-x-auto hide-scrollbar h-full flex-1 flex gap-1 whitespace-nowrap">
          {tabs.map((tab) => {
            const isActive = tab.id === activeTabId;
            const isHovered = tab.id === hoveredTabId;
            
            return (
              <TabItem
                key={tab.id}
                tab={tab}
                isActive={isActive}
                isHovered={isHovered}
                onTabClick={() => onTabClick(tab.id)}
                onTabClose={onTabClose}
                onMouseEnter={() => setHoveredTabId(tab.id)}
                onMouseLeave={() => setHoveredTabId(null)}
              />
            );
          })}
        </div>
        
        {/* 오른쪽 액션 버튼 */}
        <div className="flex items-center space-x-1 flex-shrink-0 ml-1">
          {rightActions}
        </div>
  
        {/* 스크롤 화살표 숨기기를 위한 전역 스타일 */}
        <style jsx global>{`
          /* 스크롤 화살표 숨기기 */
          ::-webkit-scrollbar-button {
            display: none !important;
          }
          
          /* 기존 스크롤바 숨기기 */
          .hide-scrollbar::-webkit-scrollbar {
            height: 0px;
            width: 0px;
            background: transparent;
          }
          
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}</style>
      </div>
    );
  }
