// src/widgets/main-layout/ui/tab-bar/TabSplitButtons.tsx
import React from 'react'
import { FlipHorizontal, LayoutGrid } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'
import { Button } from '@/shared/ui/button'
import { useTabs } from '../../store/use-tabs'

interface TabSplitButtonsProps {
  onSplitHorizontal?: () => void
  onAddThirdArea?: () => void
}

export function TabSplitButtons({ onSplitHorizontal, onAddThirdArea }: TabSplitButtonsProps) {
  const { splitMode } = useTabs()
  
  return (
    <TooltipProvider>
      {/* 2분할 버튼 (분할이 없을 때만 표시) */}
      {splitMode === 'none' && onSplitHorizontal && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="h-7 w-7 rounded-sm bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-0"
              onClick={onSplitHorizontal}
            >
              <FlipHorizontal className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">화면 분할</p>
          </TooltipContent>
        </Tooltip>
      )}
      
      {/* 3분할 추가 버튼 (2분할 상태일 때만 표시) */}
      {splitMode === 'double' && onAddThirdArea && (
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              className="h-7 w-7 rounded-sm bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-0"
              onClick={onAddThirdArea}
            >
              <LayoutGrid className="h-4 w-4 text-gray-600 dark:text-gray-400" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">3분할로 확장</p>
          </TooltipContent>
        </Tooltip>
      )}
    </TooltipProvider>
  )
}