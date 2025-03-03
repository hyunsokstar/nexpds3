// src/widgets/main-layout/ui/tab-content/TabContent.tsx
import React from 'react'
import { useTabs } from '../../store/use-tabs'

export function TabContent() {
  const { tabs, activeTabId } = useTabs()
  
  // 활성화된 탭이 없는 경우
  if (!activeTabId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        활성화된 탭이 없습니다.
      </div>
    )
  }
  
  // 활성 탭 찾기
  const activeTab = tabs.find(tab => tab.id === activeTabId)
  if (!activeTab) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        선택된 탭을 찾을 수 없습니다.
      </div>
    )
  }
  
  // 활성 탭에 따른 콘텐츠 렌더링
  return (
    <div className="h-full p-4">
      <h2 className="text-lg font-medium mb-2">{activeTab.title}</h2>
      <div className="text-sm text-gray-600">
        경로: {activeTab.path}
      </div>
      
      {/* 여기서 탭 경로나 ID에 따라 다양한 컴포넌트를 렌더링할 수 있음 */}
      {/* 예: {renderTabContent(activeTab.path)} */}
    </div>
  )
}