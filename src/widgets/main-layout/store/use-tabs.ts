// src\widgets\main-layout\store\use-tabs.ts
'use client'

import { create } from 'zustand'
import { MainMenuItems, MenuItem } from '../configure/main-menu-items'
import { v4 as uuidv4 } from 'uuid';

// 기본 Tab 인터페이스 정의
export interface Tab {
    id: string;
    menuItemId: string;
    title: string;
    params?: any;
}

// 분할 영역 타입 정의
export interface TabArea {
    id: string;
    tabs: Tab[];
    activeTabId: string | null;
}

export type SplitMode = 'none' | 'split';

interface TabsState {
    // 전역 상태
    tabs: Tab[];
    activeTabId: string | null;
    
    // 분할 관련 상태
    splitMode: SplitMode;
    areas: TabArea[];
    activeAreaId: string | null;
    areaWidths: number[];
    
    // 탭 관리 함수
    openTab: (menuItemId: string, params?: any, allowMultiple?: boolean) => void;
    closeTab: (tabId: string) => void;
    activateTab: (tabId: string) => void;
    getActiveTab: () => Tab | null;
    getActiveMenuItem: () => MenuItem | null;
    
    // 분할 관련 함수
    splitTabArea: (count: number) => void;
    moveTabToArea: (tabId: string, targetAreaId: string) => void;
    closeArea: (areaId: string) => void;
    resizeAreas: (index: number, deltaPercent: number) => void;
    
    // 탭 순서 변경 함수
    reorderTabs: (areaId: string, sourceIndex: number, destinationIndex: number) => void;
}

// 빈 영역 생성 함수
const createArea = (): TabArea => ({
    id: uuidv4(),
    tabs: [],
    activeTabId: null
});

// 스토어 생성
export const useTabsStore = create<TabsState>((set, get) => ({
    // 초기 상태
    tabs: [],
    activeTabId: null,
    
    splitMode: 'none',
    areas: [createArea()],
    activeAreaId: null,
    areaWidths: [100],
    
    // 탭 열기 함수
    openTab: (menuItemId, params, allowMultiple = false) => {
        const menuItem = MainMenuItems.find(item => item.id === menuItemId);
        if (!menuItem) return;
    
        const { tabs, areas, splitMode } = get();
        
        // 단일 탭만 허용하는 경우
        if (!allowMultiple) {
            const existingTab = tabs.find(tab => tab.menuItemId === menuItemId);
            if (existingTab) {
                set({ activeTabId: existingTab.id });
                return;
            }
        }
    
        // 새 탭 생성
        const tabId = uuidv4();
        const newTab: Tab = {
            id: tabId,
            menuItemId,
            title: menuItem.name,
            params
        };
        
        // 새 탭을 전역 목록과 첫 번째 영역에 추가
        const updatedAreas = [...areas];
        if (updatedAreas.length > 0) {
            updatedAreas[0] = {
                ...updatedAreas[0],
                tabs: [...updatedAreas[0].tabs, newTab],
                activeTabId: tabId
            };
        }
    
        set({
            tabs: [...tabs, newTab],
            activeTabId: tabId,
            areas: updatedAreas,
            activeAreaId: updatedAreas[0]?.id || null
        });
    },

    // 탭 닫기 함수
    closeTab: (tabId) => {
        const { tabs, activeTabId, areas } = get();
        const newTabs = tabs.filter(tab => tab.id !== tabId);

        // 닫는 탭이 활성 탭이면 마지막 탭을 활성화
        let newActiveTabId = activeTabId;
        if (activeTabId === tabId) {
            newActiveTabId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
        }
        
        // 탭을 모든 영역에서도 제거
        const updatedAreas = areas.map(area => {
            // 이 영역에 해당 탭이 있는지 확인
            if (area.tabs.some(tab => tab.id === tabId)) {
                const newAreaTabs = area.tabs.filter(tab => tab.id !== tabId);
                let newAreaActiveTabId = area.activeTabId;
                
                // 이 영역의 활성 탭이 닫히는 탭이면 새 활성 탭 설정
                if (area.activeTabId === tabId) {
                    newAreaActiveTabId = newAreaTabs.length > 0 ? newAreaTabs[newAreaTabs.length - 1].id : null;
                }
                
                return {
                    ...area,
                    tabs: newAreaTabs,
                    activeTabId: newAreaActiveTabId
                };
            }
            return area;
        });

        set({
            tabs: newTabs,
            activeTabId: newActiveTabId,
            areas: updatedAreas
        });
    },

    // 탭 활성화 함수
    activateTab: (tabId) => {
        const { areas } = get();
        
        // 탭이 있는 영역 찾기
        let targetAreaId = null;
        for (const area of areas) {
            if (area.tabs.some(tab => tab.id === tabId)) {
                targetAreaId = area.id;
                break;
            }
        }
        
        // 해당 영역의 활성 탭으로 설정
        if (targetAreaId) {
            const updatedAreas = areas.map(area => {
                if (area.id === targetAreaId) {
                    return { ...area, activeTabId: tabId };
                }
                return area;
            });
            
            set({
                activeTabId: tabId,
                activeAreaId: targetAreaId,
                areas: updatedAreas
            });
        }
        else {
            set({ activeTabId: tabId });
        }
    },

    // 활성 탭 정보 가져오기
    getActiveTab: () => {
        const { tabs, activeTabId } = get();
        if (!activeTabId) return null;

        return tabs.find(tab => tab.id === activeTabId) || null;
    },
    
    // 활성 탭의 메뉴 아이템 가져오기
    getActiveMenuItem: () => {
        const { tabs, activeTabId } = get();
        if (!activeTabId) return null;
        
        const activeTab = tabs.find(tab => tab.id === activeTabId);
        if (!activeTab) return null;
        
        return MainMenuItems.find(item => item.id === activeTab.menuItemId) || null;
    },
    
    // 탭 영역 분할 함수
    splitTabArea: (count) => {
        if (count < 1) {
            console.error("분할 수는 1 이상이어야 합니다.");
            return;
        }
        
        const { tabs } = get();
        
        // 새 영역들 생성
        const newAreas: TabArea[] = [];
        
        // 첫 번째 영역은 현재 탭들 가짐
        newAreas.push({
            id: uuidv4(),
            tabs: [...tabs],
            activeTabId: tabs.length > 0 ? tabs[0].id : null
        });
        
        // 나머지 빈 영역들 생성
        for (let i = 1; i < count; i++) {
            newAreas.push(createArea());
        }
        
        // 균등 너비 계산
        const equalWidth = 100 / count;
        const newWidths = Array(count).fill(equalWidth);
        
        set({
            splitMode: count > 1 ? 'split' : 'none',
            areas: newAreas,
            areaWidths: newWidths,
            activeAreaId: newAreas[0].id
        });
    },
    
    // 탭 이동 함수
    moveTabToArea: (tabId, targetAreaId) => {
        const { tabs, areas, activeTabId } = get();
        
        // 이동할 탭 찾기
        const tabToMove = tabs.find(tab => tab.id === tabId);
        if (!tabToMove) return;
        
        // 탭이 현재 속한 영역과 대상 영역 찾기
        let sourceAreaId = null;
        for (const area of areas) {
            if (area.tabs.some(tab => tab.id === tabId)) {
                sourceAreaId = area.id;
                break;
            }
        }
        
        // 같은 영역으로 이동하는 경우 무시
        if (sourceAreaId === targetAreaId) return;
        
        // 영역 업데이트
        const updatedAreas = areas.map(area => {
            // 원본 영역에서 탭 제거
            if (area.id === sourceAreaId) {
                const newTabs = area.tabs.filter(tab => tab.id !== tabId);
                return {
                    ...area,
                    tabs: newTabs,
                    activeTabId: area.activeTabId === tabId ? 
                        (newTabs.length > 0 ? newTabs[0].id : null) : 
                        area.activeTabId
                };
            }
            
            // 대상 영역에 탭 추가
            if (area.id === targetAreaId) {
                return {
                    ...area,
                    tabs: [...area.tabs, tabToMove],
                    activeTabId: tabToMove.id // 이동된 탭을 활성화
                };
            }
            
            return area;
        });
        
        set({
            areas: updatedAreas,
            activeTabId: tabId,
            activeAreaId: targetAreaId
        });
    },
    
    // 영역 닫기 함수
    closeArea: (areaId) => {
        const { areas, areaWidths, splitMode, tabs, activeAreaId, activeTabId } = get();
        
        // 영역이 1개 이하면 닫지 않음
        if (areas.length <= 1) return;
        
        // 닫으려는 영역 찾기
        const areaIndex = areas.findIndex(area => area.id === areaId);
        if (areaIndex === -1) return;
        
        // 닫으려는 영역에 있는 탭들
        const areaTabs = areas[areaIndex].tabs;
        
        // 남은 영역들
        const remainingAreas = areas.filter(area => area.id !== areaId);
        
        // 너비 재조정 - 닫은 영역의 너비를 나머지 영역에 분배
        const closedAreaWidth = areaWidths[areaIndex];
        let newWidths = [...areaWidths.filter((_, i) => i !== areaIndex)];
        
        // 영역이 2개 이상 남아있으면 비율에 맞게 분배, 아니면 100%
        if (newWidths.length > 1) {
            const totalRemainingWidth = newWidths.reduce((a, b) => a + b, 0);
            newWidths = newWidths.map(width => 
                width + (closedAreaWidth * (width / totalRemainingWidth))
            );
        } else {
            newWidths = [100]; // 한 영역만 남으면 100%
        }
        
        // 새로운 분할 모드 설정
        const newSplitMode = remainingAreas.length > 1 ? 'split' : 'none';
        
        // 새로운 활성 영역 설정
        let newActiveAreaId = activeAreaId;
        if (activeAreaId === areaId) {
            // 활성 영역이 닫힌 경우 첫 번째 남은 영역을 활성화
            newActiveAreaId = remainingAreas[0].id;
        }
        
        // 새로운 활성 탭 설정
        let newActiveTabId = activeTabId;
        if (areas[areaIndex].tabs.some(tab => tab.id === activeTabId)) {
            // 활성 탭이 닫힌 영역에 있었다면 새 활성 영역의 활성 탭으로 설정
            const newActiveArea = remainingAreas.find(area => area.id === newActiveAreaId);
            newActiveTabId = newActiveArea && newActiveArea.tabs.length > 0 
                ? newActiveArea.activeTabId || newActiveArea.tabs[0].id 
                : null;
        }
        
        // 전역 탭 목록 업데이트 - 닫힌 영역의 탭은 제거
        const newTabs = tabs.filter(tab => !areaTabs.some(areaTab => areaTab.id === tab.id));
        
        set({
            splitMode: newSplitMode,
            areas: remainingAreas,
            areaWidths: newWidths,
            activeAreaId: newActiveAreaId,
            activeTabId: newActiveTabId,
            tabs: newTabs
        });
    },
    
    // 영역 크기 조절 함수
    resizeAreas: (index, deltaPercent) => {
        const { areaWidths } = get();
        
        // 분할 영역이 하나뿐이면 크기 조절 불필요
        if (areaWidths.length <= 1) return;
        
        // index가 마지막 영역이면 조절 불가
        if (index >= areaWidths.length - 1) return;
        
        // 인접한 두 영역 간의 크기 조절
        const newWidths = [...areaWidths];
        
        // 최소 영역 크기 (%)
        const MIN_WIDTH = 10;
        
        // 변경된 너비 계산
        const newLeftWidth = newWidths[index] + deltaPercent;
        const newRightWidth = newWidths[index + 1] - deltaPercent;
        
        // 최소 너비 제한 확인
        if (newLeftWidth < MIN_WIDTH || newRightWidth < MIN_WIDTH) return;
        
        // 너비 업데이트
        newWidths[index] = newLeftWidth;
        newWidths[index + 1] = newRightWidth;
        
        set({ areaWidths: newWidths });
    },
    
    // 탭 순서 변경 함수
    reorderTabs: (areaId, sourceIndex, destinationIndex) => {
        const { areas } = get();
        
        // 영역 찾기
        const areaIndex = areas.findIndex(area => area.id === areaId);
        if (areaIndex === -1) return;
        
        const area = areas[areaIndex];
        
        // 같은 위치로 이동하는 경우 무시
        if (sourceIndex === destinationIndex) return;
        
        // 탭 순서 변경
        const newTabs = [...area.tabs];
        const [movedTab] = newTabs.splice(sourceIndex, 1);
        newTabs.splice(destinationIndex, 0, movedTab);
        
        // 업데이트된 영역 생성
        const updatedAreas = [...areas];
        updatedAreas[areaIndex] = {
            ...area,
            tabs: newTabs
        };
        
        // 전체 탭 목록 재구성
        const allTabs: Tab[] = [];
        for (const area of updatedAreas) {
            allTabs.push(...area.tabs);
        }
        
        // 상태 업데이트
        set({
            areas: updatedAreas,
            tabs: allTabs
        });
    }
}));