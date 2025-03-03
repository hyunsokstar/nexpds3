// src/widgets/main-layout/ui/TabContainer/index.tsx
import React from 'react'
import TabBar from './TabBar'
import TabContent from './TabContent'
import { useTabsStore } from '@/widgets/main-layout/store/use-tabs'

interface Props {
  className?: string;
}

const TabContainer: React.FC<Props> = ({ className = '' }) => {
  // 탭이 있는지만 확인하기 위한 최소한의 상태 구독
  const hasTabs = useTabsStore(state => state.tabs.length > 0);
  
  if (!hasTabs) {
    return null; // 탭이 없으면 아무것도 렌더링하지 않음
  }

  return (
    <div className={`flex flex-col h-full ${className}`}>
      <TabBar />
      <TabContent />
    </div>
  )
}

export default TabContainer