// src/widgets/main-layout/ui/tab-content/SplitAreaContent.tsx
import React from 'react'
import { useTabs } from '../../store/use-tabs'

interface SplitAreaContentProps {
  areaId: string
}

export function SplitAreaContent({ areaId }: SplitAreaContentProps) {
  const { areas } = useTabs()
  
  // ID를 기반으로 해당 영역 찾기
  const area = areas.find(a => a.id === areaId)
  if (!area || !area.activeTabId) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        탭이 없거나 활성화된 탭이 없습니다.
      </div>
    )
  }
  
  // 현재 활성화된 탭 찾기
  const activeTab = area.tabs.find(tab => tab.id === area.activeTabId)
  if (!activeTab) {
    return (
      <div className="flex items-center justify-center h-full text-gray-500">
        선택된 탭을 찾을 수 없습니다.
      </div>
    )
  }
  
  // 탭 경로를 기반으로 적절한 컨텐츠 렌더링
  // 여기서는 activeTab.path에 따라 다른 컴포넌트를 렌더링할 수 있음
  return (
    <div className="h-full p-4">
      <h2 className="text-lg font-medium mb-2">{activeTab.title}</h2>
      <div className="text-sm text-gray-600">
        경로: {activeTab.path}
      </div>
      
      {/* 여기서 탭 경로에 따라 다양한 컴포넌트를 조건부 렌더링할 수 있음 */}
    </div>
  )
}