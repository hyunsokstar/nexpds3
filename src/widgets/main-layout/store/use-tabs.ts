'use client'

import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'

// 탭 객체 타입 정의
export type Tab = {
  id: string
  title: string
  path: string
  icon?: React.ElementType
}

// 분할 영역 타입 정의
export type SplitArea = {
  id: string
  tabs: Tab[]
  activeTabId: string | null
}

// 분할 모드 타입
export type SplitMode = 'none' | 'double' | 'triple';

// 전체 탭 상태 관리를 위한 타입 정의
type TabsState = {
  // 기본 탭 상태
  tabs: Tab[]
  activeTabId: string | null

  // 분할 관련 상태
  splitMode: SplitMode
  areas: SplitArea[]
  activeAreaId: string | null
  areaWidths: number[] // 각 영역의 너비 (%)

  // 기본 탭 관련 함수들
  addTab: (tab: Tab) => void
  closeTab: (tabId: string) => void
  setActiveTab: (tabId: string) => void

  // 분할 관련 함수들
  splitHorizontal: () => void         // 2분할 생성
  addThirdArea: () => void            // 3분할 생성
  closeArea: (areaId: string) => void // 분할 영역 닫기
  setActiveArea: (areaId: string) => void // 활성 영역 변경
  moveTabToArea: (tabId: string, targetAreaId: string) => void // 탭을 다른 영역으로 이동
  updateAreaWidth: (dividerIndex: number, offsetPercent: number) => void // 영역 너비 조정
}

// 초기 영역 생성 함수
const createInitialArea = (): SplitArea => ({
  id: uuidv4(),
  tabs: [],
  activeTabId: null
})

export const useTabs = create<TabsState>((set, get) => {
  // 초기 영역 생성
  const initialArea = createInitialArea()

  return {
    // 초기 상태
    tabs: [],
    activeTabId: null,
    splitMode: 'none',
    areas: [initialArea],
    activeAreaId: initialArea.id,
    areaWidths: [100], // 처음에는 한 영역이 100%

    // 탭 추가 함수
    addTab: (tab) => set((state) => {
      // 이미 동일한 ID의 탭이 있는지 확인
      if (state.tabs.some(t => t.id === tab.id)) {
        // 기존 탭만 활성화
        return { activeTabId: tab.id }
      }

      // 새 탭 생성 로직
      const newTabs = [...state.tabs, tab]

      // 활성 영역에 탭 추가
      const areaIndex = state.areas.findIndex(area => area.id === state.activeAreaId)
      if (areaIndex === -1) {
        // 안전장치: 활성 영역이 없으면 첫 번째 영역에 추가
        const updatedAreas = [...state.areas]
        updatedAreas[0] = {
          ...updatedAreas[0],
          tabs: [...updatedAreas[0].tabs, tab],
          activeTabId: tab.id
        }
        
        return {
          tabs: newTabs,
          activeTabId: tab.id,
          activeAreaId: updatedAreas[0].id,
          areas: updatedAreas
        }
      }

      // 활성 영역에 탭 추가
      const updatedAreas = [...state.areas]
      updatedAreas[areaIndex] = {
        ...updatedAreas[areaIndex],
        tabs: [...updatedAreas[areaIndex].tabs, tab],
        activeTabId: tab.id
      }

      return {
        tabs: newTabs,
        activeTabId: tab.id,
        areas: updatedAreas
      }
    }),

    // 탭 닫기 함수
    closeTab: (tabId) => set((state) => {
      // 기본 탭 제거 로직
      const newTabs = state.tabs.filter(tab => tab.id !== tabId)
      const newActiveTabId = state.activeTabId === tabId
        ? (newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null)
        : state.activeTabId

      // 분할 상태일 경우 해당 영역에서 탭 제거
      const updatedAreas = state.areas.map(area => {
        if (area.tabs.some(t => t.id === tabId)) {
          const newAreaTabs = area.tabs.filter(t => t.id !== tabId)
          const newAreaActiveTabId = area.activeTabId === tabId
            ? (newAreaTabs.length > 0 ? newAreaTabs[newAreaTabs.length - 1].id : null)
            : area.activeTabId

          return {
            ...area,
            tabs: newAreaTabs,
            activeTabId: newAreaActiveTabId
          }
        }
        return area
      })

      return {
        tabs: newTabs,
        activeTabId: newActiveTabId,
        areas: updatedAreas
      }
    }),

    // 탭 활성화 함수
    setActiveTab: (tabId) => set((state) => {
      // 탭이 있는 영역 찾기
      let targetAreaId = state.activeAreaId

      const updatedAreas = state.areas.map(area => {
        const hasTab = area.tabs.some(t => t.id === tabId)
        if (hasTab) {
          targetAreaId = area.id
          return { ...area, activeTabId: tabId }
        }
        return area
      })

      return {
        activeTabId: tabId,
        activeAreaId: targetAreaId,
        areas: updatedAreas
      }
    }),

    // 가로 분할 생성 함수 (2분할)
    splitHorizontal: () => set((state) => {
      if (state.splitMode !== 'none') return state

      // 새 영역 생성
      const newArea: SplitArea = {
        id: uuidv4(),
        tabs: [],
        activeTabId: null
      }

      // 첫 번째 영역은 기존 탭 전체를 가짐
      const firstArea: SplitArea = {
        id: state.areas[0].id,
        tabs: [...state.tabs],
        activeTabId: state.activeTabId
      }

      return {
        splitMode: 'double',
        areas: [firstArea, newArea],
        activeAreaId: firstArea.id,
        areaWidths: [50, 50] // 균등하게 분할
      }
    }),

    // 3분할 함수
    addThirdArea: () => set((state) => {
      if (state.splitMode !== 'double') return state

      // 새 영역 생성
      const newArea: SplitArea = {
        id: uuidv4(),
        tabs: [],
        activeTabId: null
      }

      // 기존 2분할 영역 크기 조정
      const firstWidth = state.areaWidths[0] * 0.7 // 첫 번째 영역 크기 줄이기
      const remainingWidth = 100 - firstWidth // 나머지 공간
      const secondWidth = remainingWidth / 2 // 두 번째와 세 번째 영역은 남은 공간 균등 분할

      return {
        splitMode: 'triple',
        areas: [...state.areas, newArea],
        areaWidths: [firstWidth, secondWidth, secondWidth]
      }
    }),

    // 분할 영역 닫기 함수
    closeArea: (areaId) => set((state) => {
      // 닫을 수 없는 조건 (영역이 한 개)
      if (state.areas.length <= 1) return state

      // 닫으려는 영역 인덱스 찾기
      const closingAreaIndex = state.areas.findIndex(area => area.id === areaId)
      if (closingAreaIndex === -1) return state

      // 남아있는 영역들
      const remainingAreas = state.areas.filter(area => area.id !== areaId)
      
      // 새로운 분할 모드 결정
      let newSplitMode: SplitMode = 'none'
      let newAreaWidths: number[] = [100]
      
      if (remainingAreas.length === 2) {
        newSplitMode = 'double'
        
        // 기존 비율 유지하되 합이 100%가 되도록 조정
        if (closingAreaIndex === 0) {
          // 첫 번째 영역 닫기: 두 번째와 세 번째 영역만 남음
          const totalWidth = state.areaWidths[1] + (state.splitMode === 'triple' ? state.areaWidths[2] : 0)
          const ratio = 100 / totalWidth
          newAreaWidths = [
            state.areaWidths[1] * ratio,
            (state.splitMode === 'triple' ? state.areaWidths[2] : state.areaWidths[1]) * ratio
          ]
        } else if (closingAreaIndex === 1) {
          // 두 번째 영역 닫기: 첫 번째와 세 번째(있는 경우) 영역만 남음
          const thirdWidth = state.splitMode === 'triple' ? state.areaWidths[2] : 0
          const totalWidth = state.areaWidths[0] + thirdWidth
          const ratio = 100 / totalWidth
          newAreaWidths = [
            state.areaWidths[0] * ratio,
            thirdWidth * ratio
          ]
        } else if (state.splitMode === 'triple' && closingAreaIndex === 2) {
          // 세 번째 영역 닫기: 첫 번째와 두 번째 영역만 남음
          const totalWidth = state.areaWidths[0] + state.areaWidths[1]
          const ratio = 100 / totalWidth
          newAreaWidths = [
            state.areaWidths[0] * ratio,
            state.areaWidths[1] * ratio
          ]
        }
      } else {
        // 영역이 하나만 남음
        newSplitMode = 'none'
        newAreaWidths = [100]
      }
      
      // 닫은 영역의 활성 탭을 처리
      let newActiveAreaId = state.activeAreaId
      if (state.activeAreaId === areaId) {
        newActiveAreaId = remainingAreas[0].id
      }
      
      // 모든 탭 수집
      const allTabs = remainingAreas.flatMap(area => area.tabs)
      const newActiveTabId = remainingAreas.find(area => area.id === newActiveAreaId)?.activeTabId || null

      return {
        splitMode: newSplitMode,
        areas: remainingAreas,
        activeAreaId: newActiveAreaId,
        areaWidths: newAreaWidths,
        tabs: allTabs,
        activeTabId: newActiveTabId
      }
    }),

    // 활성 영역 변경 함수
    setActiveArea: (areaId) => set((state) => {
      const area = state.areas.find(a => a.id === areaId)
      if (!area) return state

      return {
        activeAreaId: areaId,
        activeTabId: area.activeTabId
      }
    }),

    // 탭을 다른 영역으로 이동하는 함수
    moveTabToArea: (tabId, targetAreaId) => set((state) => {
      // 현재 탭이 있는 영역 찾기
      const sourceAreaIndex = state.areas.findIndex(area =>
        area.tabs.some(tab => tab.id === tabId)
      )

      if (sourceAreaIndex === -1) return state // 탭을 찾을 수 없음

      // 대상 영역 찾기
      const targetAreaIndex = state.areas.findIndex(area => area.id === targetAreaId)
      if (targetAreaIndex === -1 || sourceAreaIndex === targetAreaIndex) return state

      // 이동할 탭 가져오기
      const tab = state.areas[sourceAreaIndex].tabs.find(t => t.id === tabId)
      if (!tab) return state

      // 원본 영역에서 탭 제거
      const updatedSourceArea = { ...state.areas[sourceAreaIndex] }
      updatedSourceArea.tabs = updatedSourceArea.tabs.filter(t => t.id !== tabId)

      // 소스 영역의 활성 탭 조정
      if (updatedSourceArea.activeTabId === tabId) {
        updatedSourceArea.activeTabId = updatedSourceArea.tabs.length > 0
          ? updatedSourceArea.tabs[updatedSourceArea.tabs.length - 1].id
          : null
      }

      // 대상 영역에 탭 추가
      const updatedTargetArea = { ...state.areas[targetAreaIndex] }
      updatedTargetArea.tabs = [...updatedTargetArea.tabs, tab]
      updatedTargetArea.activeTabId = tab.id

      // 업데이트된 영역 배열 생성
      const updatedAreas = [...state.areas]
      updatedAreas[sourceAreaIndex] = updatedSourceArea
      updatedAreas[targetAreaIndex] = updatedTargetArea

      return {
        areas: updatedAreas,
        activeAreaId: updatedTargetArea.id,
        activeTabId: tab.id
      }
    }),

    // 영역 너비 업데이트 함수
    updateAreaWidth: (dividerIndex, offsetPercent) => set((state) => {
      const newWidths = [...state.areaWidths]
      const minWidth = 15 // 최소 영역 너비 (%)
      
      if (dividerIndex === 0) {
        // 첫 번째 분할선 (영역 1과 2 사이)
        if (state.splitMode === 'double') {
          // 2분할일 때는 간단히 처리
          newWidths[0] = Math.max(minWidth, Math.min(offsetPercent, 100 - minWidth))
          newWidths[1] = 100 - newWidths[0]
        } else if (state.splitMode === 'triple') {
          // 3분할일 때는 두 번째와 세 번째 영역의 비율 유지
          const oldSecondWidth = newWidths[1]
          const oldThirdWidth = newWidths[2]
          const oldRemainingTotal = oldSecondWidth + oldThirdWidth
          
          // 최대 너비 계산 (나머지 영역들이 최소 너비를 유지하도록)
          const maxWidth = 100 - (minWidth * 2)
          
          // 첫 번째 영역 너비 조정
          newWidths[0] = Math.max(minWidth, Math.min(offsetPercent, maxWidth))
          
          // 남은 공간 계산
          const newRemainingSpace = 100 - newWidths[0]
          
          // 두 번째와 세 번째 영역 너비 조정 (기존 비율 유지)
          if (oldRemainingTotal > 0) {
            newWidths[1] = newRemainingSpace * (oldSecondWidth / oldRemainingTotal)
            newWidths[2] = newRemainingSpace * (oldThirdWidth / oldRemainingTotal)
          } else {
            // 이전에 데이터가 없었을 경우 균등 분할
            newWidths[1] = newRemainingSpace / 2
            newWidths[2] = newRemainingSpace / 2
          }
        }
      } else if (dividerIndex === 1 && state.splitMode === 'triple') {
        // 두 번째 분할선 (영역 2와 3 사이)
        const firstWidth = newWidths[0]
        const availableWidth = 100 - firstWidth
        
        // 두 번째 영역 너비 계산 (전체 기준)
        const secondWidthTotal = offsetPercent - firstWidth
        
        // 최소/최대 제한 적용
        const secondWidth = Math.max(
          minWidth, 
          Math.min(secondWidthTotal, availableWidth - minWidth)
        )
        
        // 두 번째와 세 번째 영역 너비 설정
        newWidths[1] = secondWidth
        newWidths[2] = availableWidth - secondWidth
      }
      
      // 정밀도 이슈 방지를 위해 합계가 100이 되도록 조정
      const sum = newWidths.reduce((a, b) => a + b, 0)
      if (Math.abs(sum - 100) > 0.1) {
        const factor = 100 / sum
        for (let i = 0; i < newWidths.length; i++) {
          newWidths[i] *= factor
        }
      }
      
      return { areaWidths: newWidths }
    })
  }
})