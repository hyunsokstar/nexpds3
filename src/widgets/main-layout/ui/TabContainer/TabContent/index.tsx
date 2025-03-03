// src/widgets/main-layout/ui/TabContainer/TabContent/index.tsx
import React from 'react'
import { useTabsStore } from '@/widgets/main-layout/store/use-tabs'
import { MainMenuItems } from '@/widgets/main-layout/configure/main-menu-items'

interface Props {
  className?: string;
}

const TabContent = ({ className = '' }: Props) => {
  const tabs = useTabsStore(state => state.tabs);
  const activeTabId = useTabsStore(state => state.activeTabId);
  
  // 활성 탭 가져오기
  const activeTab = activeTabId ? tabs.find(tab => tab.id === activeTabId) : null;
  
  // 활성 탭이 없으면 아무것도 표시하지 않음
  if (!activeTab) {
    return null;
  }
  
  // 탭의 menuItemId에 해당하는 메뉴 아이템 찾기
  const menuItem = MainMenuItems.find(item => item.id === activeTab.menuItemId);
  
  // 메뉴 아이템이 없으면 아무것도 표시하지 않음
  if (!menuItem) {
    return null;
  }

  // 메뉴 아이템의 컴포넌트 가져오기
  const TabComponent = menuItem.component;
  
  return (
    <div className={`flex-1 overflow-auto ${className}`}>
      {TabComponent && <TabComponent {...(activeTab.params || {})} />}
    </div>
  )
}

export default TabContent