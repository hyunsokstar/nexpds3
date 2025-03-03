// src/widgets/main-layout/ui/tab-content/TabContainer.tsx
'use client'

import React, { useState, useRef, useEffect } from 'react'
import { MoveRight, MoveLeft, Maximize } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/shared/ui/tooltip'
import { Button } from '@/shared/ui/button'
import { useTabs } from '../../store/use-tabs'
import { TabContent } from './TabContent'
import { TabBar } from '../tab-bar/TabBar'
import { TabSplitButtons } from '../tab-bar/TabSplitButtons'
import { SplitArea } from './SplitArea'
import { SplitDivider } from './SplitDivider'

export function TabContainer() {
  const {
    tabs,
    activeTabId,
    setActiveTab,
    closeTab,
    splitMode,
    areas,
    activeAreaId,
    splitHorizontal,
    addThirdArea,
    closeArea,
    setActiveArea,
    moveTabToArea,
    areaWidths,
    updateAreaWidth
  } = useTabs()

  const [hoveredTabId, setHoveredTabId] = useState<string | null>(null)
  const [activeDivider, setActiveDivider] = useState<number | null>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  // 드래그 시작 핸들러
  const handleDividerDragStart = (index: number) => (e: React.MouseEvent) => {
    setActiveDivider(index)
    e.preventDefault()
  }

  // 드래그 이벤트 처리
  useEffect(() => {
    if (activeDivider === null || !containerRef.current) return
    
    const handleDrag = (e: MouseEvent) => {
      const container = containerRef.current!
      const rect = container.getBoundingClientRect()
      
      // 마우스 위치를 컨테이너 너비에 대한 퍼센트로 변환
      const offsetPercent = ((e.clientX - rect.left) / rect.width) * 100
      
      // 상태 업데이트
      updateAreaWidth(activeDivider, offsetPercent)
    }
    
    const handleDragEnd = () => {
      setActiveDivider(null)
    }
    
    document.addEventListener('mousemove', handleDrag)
    document.addEventListener('mouseup', handleDragEnd)
    
    return () => {
      document.removeEventListener('mousemove', handleDrag)
      document.removeEventListener('mouseup', handleDragEnd)
    }
  }, [activeDivider, updateAreaWidth])

  // 인접 영역 ID 찾기 함수 (좌우로만 이동)
  const getAdjacentAreaId = (currentAreaId: string, direction: 'left' | 'right') => {
    const currentIndex = areas.findIndex(area => area.id === currentAreaId)
    if (currentIndex === -1) return areas[0].id
    
    // 인접 영역 인덱스 계산
    let targetIndex = currentIndex
    
    if (direction === 'left') {
      // 왼쪽 영역으로 이동 (인덱스 감소)
      targetIndex = currentIndex - 1
      // 왼쪽 끝이면 마지막 영역으로
      if (targetIndex < 0) targetIndex = areas.length - 1
    } else {
      // 오른쪽 영역으로 이동 (인덱스 증가)
      targetIndex = currentIndex + 1
      // 오른쪽 끝이면 첫 번째 영역으로
      if (targetIndex >= areas.length) targetIndex = 0
    }
    
    return areas[targetIndex].id
  }

  // 빈 상태 (탭이 없을 때)
  if (splitMode === 'none' && tabs.length === 0) {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <div className="h-9 px-4 flex items-center justify-between text-gray-600 dark:text-gray-300 text-xs bg-gray-100 dark:bg-gray-800 border-b border-gray-300 dark:border-gray-700">
          <span className="font-medium">탭을 추가하려면 메뉴를 클릭하세요</span>
          
          <div className="flex items-center">
            <TabSplitButtons onSplitHorizontal={splitHorizontal} />
          </div>
        </div>
        
        <div className="flex-1 p-6 text-center text-gray-500">
          시작하려면 메뉴를 클릭하여 탭을 추가하세요
        </div>
      </div>
    )
  }

  // 일반 모드 (분할되지 않은 상태)
  if (splitMode === 'none') {
    return (
      <div className="flex flex-col flex-1 overflow-hidden">
        <TabBar
          tabs={areas[0]?.tabs || []}
          activeTabId={areas[0]?.activeTabId || null}
          hoveredTabId={hoveredTabId}
          setHoveredTabId={setHoveredTabId}
          onTabClick={setActiveTab}
          onTabClose={closeTab}
          rightActions={<TabSplitButtons onSplitHorizontal={splitHorizontal} />}
        />
        <div className="flex-1 overflow-auto">
          <TabContent />
        </div>
      </div>
    )
  }

  // 2분할 또는 3분할 모드
  return (
    <div ref={containerRef} className="flex flex-1 overflow-hidden">
      {/* 첫 번째 영역 */}
      <SplitArea
        area={areas[0]}
        isActiveArea={areas[0].id === activeAreaId}
        hoveredTabId={hoveredTabId}
        setHoveredTabId={setHoveredTabId}
        onTabClick={(tabId) => {
          setActiveTab(tabId)
          setActiveArea(areas[0].id)
        }}
        onTabClose={closeTab}
        onAreaClick={() => setActiveArea(areas[0].id)}
        width={`${areaWidths[0]}%`}
        moveButton={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-7 w-7 rounded-sm bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-0"
                onClick={() => {
                  if (areas[0].activeTabId) {
                    const nextAreaId = getAdjacentAreaId(areas[0].id, 'right')
                    moveTabToArea(areas[0].activeTabId, nextAreaId)
                  }
                }}
                disabled={!areas[0].activeTabId}
              >
                <MoveRight size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">다음 영역으로 이동</p>
            </TooltipContent>
          </Tooltip>
        }
        closeButton={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-7 w-7 rounded-sm bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-0"
                onClick={() => closeArea(areas[0].id)}
              >
                <Maximize size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">영역 닫기</p>
            </TooltipContent>
          </Tooltip>
        }
      />

      {/* 첫 번째 분할선 */}
      <SplitDivider
        isDragging={activeDivider === 0}
        onDragStart={handleDividerDragStart(0)}
      />

      {/* 두 번째 영역 */}
      <SplitArea
        area={areas[1]}
        isActiveArea={areas[1].id === activeAreaId}
        hoveredTabId={hoveredTabId}
        setHoveredTabId={setHoveredTabId}
        onTabClick={(tabId) => {
          setActiveTab(tabId)
          setActiveArea(areas[1].id)
        }}
        onTabClose={closeTab}
        onAreaClick={() => setActiveArea(areas[1].id)}
        width={`${areaWidths[1]}%`}
        moveButton={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-7 w-7 rounded-sm bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-0"
                onClick={() => {
                  if (areas[1].activeTabId) {
                    // 2분할 모드에서는 왼쪽으로 이동, 3분할 모드에서는 오른쪽으로 이동
                    const direction = splitMode === 'double' ? 'left' : 'right'
                    const adjacentAreaId = getAdjacentAreaId(areas[1].id, direction)
                    moveTabToArea(areas[1].activeTabId, adjacentAreaId)
                  }
                }}
                disabled={!areas[1].activeTabId}
              >
                {splitMode === 'double' ? <MoveLeft size={14} /> : <MoveRight size={14} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">
                {splitMode === 'double' ? '이전' : '다음'} 영역으로 이동
              </p>
            </TooltipContent>
          </Tooltip>
        }
        closeButton={
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="h-7 w-7 rounded-sm bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-0"
                onClick={() => closeArea(areas[1].id)}
              >
                <Maximize size={14} />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">영역 닫기</p>
            </TooltipContent>
          </Tooltip>
        }
        additionalButtons={
          splitMode === 'double' ? (
            <TabSplitButtons onAddThirdArea={addThirdArea} />
          ) : null
        }
      />

      {/* 3분할 모드일 때만 세 번째 영역과 두 번째 분할선 렌더링 */}
      {splitMode === 'triple' && (
        <>
          <SplitDivider
            isDragging={activeDivider === 1}
            onDragStart={handleDividerDragStart(1)}
          />
          
          <SplitArea
            area={areas[2]}
            isActiveArea={areas[2].id === activeAreaId}
            hoveredTabId={hoveredTabId}
            setHoveredTabId={setHoveredTabId}
            onTabClick={(tabId) => {
              setActiveTab(tabId)
              setActiveArea(areas[2].id)
            }}
            onTabClose={closeTab}
            onAreaClick={() => setActiveArea(areas[2].id)}
            width={`${areaWidths[2]}%`}
            moveButton={
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-7 w-7 rounded-sm bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-0"
                    onClick={() => {
                      if (areas[2].activeTabId) {
                        const adjacentAreaId = getAdjacentAreaId(areas[2].id, 'left')
                        moveTabToArea(areas[2].activeTabId, adjacentAreaId)
                      }
                    }}
                    disabled={!areas[2].activeTabId}
                  >
                    <MoveLeft size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">이전 영역으로 이동</p>
                </TooltipContent>
              </Tooltip>
            }
            closeButton={
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    className="h-7 w-7 rounded-sm bg-transparent hover:bg-gray-100 dark:hover:bg-gray-800 p-0"
                    onClick={() => closeArea(areas[2].id)}
                  >
                    <Maximize size={14} />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p className="text-xs">영역 닫기</p>
                </TooltipContent>
              </Tooltip>
            }
          />
        </>
      )}

      {/* Hide scrollbar but keep functionality */}
      <style jsx global>{`
        .hide-scrollbar::-webkit-scrollbar {
          height: 0px;
          background: transparent;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        
        /* 스크롤 화살표 숨기기 */
        ::-webkit-scrollbar-button {
          display: none !important;
        }
      `}</style>
    </div>
  )
}