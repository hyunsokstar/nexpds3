// C:\Users\terec\nexpds-multi\src\widgets\main-layout\index.tsx
'use client'

import Header from "./ui/header"
import { Sidebar } from "./ui/sidebar"
import TabContainer from "./ui/TabContainer"

export function MainLayout() {
  return (
    <div className="flex flex-col h-screen bg-background">
      {/* 헤더 */}
      <Header />
      
      <div className="flex flex-1 overflow-hidden">
        {/* 사이드바 */}
        <Sidebar />
        
        {/* 탭 컨테이너 */}
        <div className="flex-1 overflow-hidden">
          <TabContainer />
        </div>
      </div>
    </div>
  )
}

export default MainLayout