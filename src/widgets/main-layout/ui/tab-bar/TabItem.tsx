// src/widgets/main-layout/ui/tab-bar/TabItem.tsx
import React from 'react'
import { X } from 'lucide-react'
import { Tab } from '../../store/use-tabs'

interface TabItemProps {
  tab: Tab
  isActive: boolean
  isHovered: boolean
  onTabClick: () => void
  onTabClose: (id: string) => void
  onMouseEnter: () => void
  onMouseLeave: () => void
}

export function TabItem({
  tab,
  isActive,
  isHovered,
  onTabClick,
  onTabClose,
  onMouseEnter,
  onMouseLeave
}: TabItemProps) {
  return (
    <div
      className={`
        flex items-center min-w-[120px] max-w-[180px] h-full
        relative transition-all duration-150 ease-in-out cursor-pointer
        border border-dashed
        ${isActive
          ? 'bg-blue-500 border-blue-600 text-white dark:bg-blue-600 dark:border-blue-700'
          : 'bg-white border-gray-400 text-gray-700 hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-800'}
      `}
      onClick={onTabClick}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      {/* Tab content with title and icon */}
      <div className="flex items-center w-full h-full px-2 relative">
        {tab.icon && (
          <div className="mr-1.5">
            {React.createElement(tab.icon, { size: 14 })}
          </div>
        )}
        
        <span className={`truncate text-xs pl-1 ${isActive ? 'font-medium' : ''}`}>
          {tab.title}
        </span>
        
        {/* 탭 닫기 버튼 */}
        <button
          className={`
            absolute right-1 p-0.5 rounded-full
            ${isActive ? 'text-white hover:bg-blue-600 dark:hover:bg-blue-700' : 'text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-700'} 
            hover:text-white transition-all
            ${isHovered || isActive ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={(e) => {
            e.stopPropagation()
            onTabClose(tab.id)
          }}
        >
          <X size={12} />
        </button>
      </div>
      
      {/* Active indicator */}
      {isActive && (
        <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"></div>
      )}
    </div>
  )
}