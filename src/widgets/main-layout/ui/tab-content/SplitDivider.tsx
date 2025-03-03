// src/widgets/main-layout/ui/tab-content/SplitDivider.tsx
import React from 'react'

interface SplitDividerProps {
  isDragging: boolean
  onDragStart: (e: React.MouseEvent) => void
}

export function SplitDivider({ isDragging, onDragStart }: SplitDividerProps) {
  return (
    <div 
      className={`
        w-1 bg-gray-300 hover:bg-blue-400 active:bg-blue-500 
        cursor-col-resize relative z-10 flex-shrink-0
        transition-colors duration-150
        ${isDragging ? 'bg-blue-500 w-1.5' : ''}
      `}
      onMouseDown={onDragStart}
    >
      {/* 드래그 핸들 그립 표시 */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 flex flex-col gap-1.5">
        <div className="w-1 h-8 flex flex-col justify-center items-center gap-1">
          <div className="w-1 h-1 rounded-full bg-gray-500"></div>
          <div className="w-1 h-1 rounded-full bg-gray-500"></div>
          <div className="w-1 h-1 rounded-full bg-gray-500"></div>
        </div>
      </div>
      
      {/* 드래그 중일 때 나타나는 전체 화면 오버레이 (마우스 이벤트 캡처용) */}
      {isDragging && (
        <div className="fixed inset-0 z-50 bg-transparent cursor-col-resize" />
      )}
    </div>
  )
}