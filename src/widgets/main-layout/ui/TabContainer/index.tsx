// src/widgets/main-layout/ui/TabContainer/index.tsx
import React from 'react'
import TabBar from './TabBar'
import TabContent from './TabContent'
import { useTabsStore } from '@/widgets/main-layout/store/use-tabs'

interface Props {
  className?: string;
}

const TabContainer: React.FC<Props> = ({ className = '' }) => {
  const splitMode = useTabsStore(state => state.splitMode);
  const areas = useTabsStore(state => state.areas);
  const areaWidths = useTabsStore(state => state.areaWidths);
  const hasTabs = useTabsStore(state => state.tabs.length > 0);
  
  // 탭이 하나도 없으면 탭바만 표시
  if (!hasTabs && splitMode === 'none') {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <TabBar />
      </div>
    );
  }
  
  // 분할 모드가 아닌 경우 (기존 방식)
  if (splitMode === 'none') {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        <TabBar />
        <TabContent />
      </div>
    );
  }
  
  // 분할 모드인 경우
  return (
    <div className={`flex h-full ${className}`}>
      {areas.map((area, index) => (
        <div 
          key={area.id}
          className="flex flex-col h-full border-r last:border-r-0"
          style={{ 
            width: `${areaWidths[index]}%`,
            minHeight: 0 // 이 설정이 중요함 - 컨테이너 내부 크기 문제 해결
          }}
        >
          <TabBar area={area} />
          <TabContent area={area} />
        </div>
      ))}
    </div>
  );
}

export default TabContainer