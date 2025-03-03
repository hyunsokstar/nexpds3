// src/widgets/main-layout/ui/tab-content/SplitArea.tsx
import React from 'react'
import { SplitArea as SplitAreaType } from '../../store/use-tabs'
import { TabBar } from '../tab-bar/TabBar'
import { SplitAreaContent } from './SplitAreaContent'
import { TooltipProvider } from '@/shared/ui/tooltip'

interface SplitAreaProps {
  area: SplitAreaType
  isActiveArea: boolean
  hoveredTabId: string | null
  setHoveredTabId: (id: string | null) => void
  onTabClick: (id: string) => void
  onTabClose: (id: string) => void
  onAreaClick: () => void
  moveButton: React.ReactNode
  closeButton: React.ReactNode
  width: string
  additionalButtons?: React.ReactNode
}

export function SplitArea({
  area,
  isActiveArea,
  hoveredTabId,
  setHoveredTabId,
  onTabClick,
  onTabClose,
  onAreaClick,
  moveButton,
  closeButton,
  width,
  additionalButtons
}: SplitAreaProps) {
  return (
    <div 
      className="flex flex-col overflow-hidden"
      style={{ width }}
      onClick={onAreaClick}
    >
      <TabBar
        tabs={area.tabs}
        activeTabId={area.activeTabId}
        hoveredTabId={hoveredTabId}
        setHoveredTabId={setHoveredTabId}
        onTabClick={onTabClick}
        onTabClose={onTabClose}
        isActive={isActiveArea}
        rightActions={
          <TooltipProvider>
            <div className="flex items-center space-x-1">
              {area.tabs.length > 0 && area.activeTabId && moveButton}
              {additionalButtons}
              {closeButton}
            </div>
          </TooltipProvider>
        }
      />
      
      <div className="flex-1 overflow-auto">
        <SplitAreaContent areaId={area.id} />
      </div>
    </div>
  )
}