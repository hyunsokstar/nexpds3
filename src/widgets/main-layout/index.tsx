'use client'

import { Header } from './ui/header'
import { Sidebar } from './ui/sidebar'
import { TabContainer } from './ui/tab-content/TabContainer'

export function MainLayout() {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 헤더 */}
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <Sidebar />
        
        {/* 통합된 탭 컨테이너 (탭바 + 콘텐츠) */}
        <TabContainer />
      </div>
    </div>
  )
}