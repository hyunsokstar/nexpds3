// src\widgets\main-layout\store\use-tabs.ts
'use client'

import { create } from 'zustand'
import { MainMenuItems, MenuItem } from '../configure/main-menu-items'
import { v4 as uuidv4 } from 'uuid';


// 기본 Tab 인터페이스 정의
export interface Tab {
    id: string;          // 탭의 고유 식별자
    menuItemId: string;  // 탭과 연결된 메뉴 아이템의 ID
    title: string;       // 탭에 표시될 제목
    params?: any;        // 탭 컴포넌트에 전달될 추가 파라미터
}

interface TabsState {
    tabs: Tab[];                                       // 현재 열려있는 모든 탭 목록
    activeTabId: string | null;                        // 현재 활성화된 탭의 ID
    openTab: (menuItemId: string, params?: any, allowMultiple?: boolean) => void;  // 탭 열기 함수
    closeTab: (tabId: string) => void;                 // 탭 닫기 함수
    activateTab: (tabId: string) => void;              // 탭 활성화 함수
    getActiveTab: () => Tab | null;                    // 활성 탭 정보 가져오기
    getActiveMenuItem: () => MenuItem | null;          // 활성 탭의 메뉴 아이템 가져오기
}

// 스토어 생성
export const useTabsStore = create<TabsState>((set, get) => ({
    tabs: [],
    activeTabId: null,

    /**
     * 새 탭을 열거나 기존 탭을 활성화합니다.
     * @param menuItemId - 열고자 하는 메뉴 아이템의 ID
     * @param params - 탭 컴포넌트에 전달할 파라미터 (예: 상세 페이지의 ID)
     * @param allowMultiple - 동일한 메뉴 아이템의 여러 탭 허용 여부 (기본값: false)
     */
    openTab: (menuItemId, params, allowMultiple = false) => {
        const menuItem = MainMenuItems.find(item => item.id === menuItemId);
        if (!menuItem) return;
    
        const { tabs } = get();
        
        // 단일 탭만 허용하는 경우
        if (!allowMultiple) {
            // 이미 해당 menuItemId로 열린 탭이 있는지만 확인
            const existingTab = tabs.find(tab => tab.menuItemId === menuItemId);
            if (existingTab) {
                set({ activeTabId: existingTab.id });
                return;
            }
        }
    
        // 새 탭 추가 - UUID 사용
        const tabId = uuidv4();
        const newTab: Tab = {
            id: tabId,
            menuItemId,
            title: menuItem.name,
            params
        };
    
        set({
            tabs: [...tabs, newTab],
            activeTabId: tabId
        });
    },

    /**
     * 특정 ID의 탭을 닫습니다.
     * @param tabId - 닫을 탭의 ID
     */
    closeTab: (tabId) => {
        const { tabs, activeTabId } = get();
        const newTabs = tabs.filter(tab => tab.id !== tabId);

        // 닫는 탭이 현재 활성 탭이면 마지막 탭을 활성화
        let newActiveTabId = activeTabId;
        if (activeTabId === tabId) {
            newActiveTabId = newTabs.length > 0 ? newTabs[newTabs.length - 1].id : null;
        }

        set({
            tabs: newTabs,
            activeTabId: newActiveTabId
        });
    },

    /**
     * 특정 ID의 탭을 활성화합니다.
     * @param tabId - 활성화할 탭의 ID
     */
    activateTab: (tabId) => {
        set({ activeTabId: tabId });
    },

    /**
     * 현재 활성화된 탭의 정보를 가져옵니다.
     * @returns 활성 탭 또는 없는 경우 null
     */
    getActiveTab: () => {
        const { tabs, activeTabId } = get();
        if (!activeTabId) return null;

        return tabs.find(tab => tab.id === activeTabId) || null;
    },
    
    /**
     * 현재 활성화된 탭의 메뉴 아이템 정보를 가져옵니다.
     * @returns 활성 탭의 메뉴 아이템 또는 없는 경우 null
     */
    getActiveMenuItem: () => {
        const { tabs, activeTabId } = get();
        if (!activeTabId) return null;
        
        const activeTab = tabs.find(tab => tab.id === activeTabId);
        if (!activeTab) return null;
        
        return MainMenuItems.find(item => item.id === activeTab.menuItemId) || null;
    }
}));

/**
 * 탭 시스템 설계에 대한 추가 설명
 * 
 * 1. params 파라미터의 용도:
 *    params는 탭 내부에서 표시될 컴포넌트에 추가 정보를 전달하기 위한 것입니다.
 *    예를 들어, "캠페인 상세" 탭을 열 때 어떤 캠페인의 상세 정보를 표시해야 하는지 알려주기 위해 사용합니다:
 *    
 *    openTab('CampaignDetail', { id: 123 });
 *    
 *    그러면 TabContent 컴포넌트에서 해당 params가 props로 전달되어
 *    특정 ID의 캠페인 정보를 표시할 수 있습니다.
 * 
 * 2. allowMultiple 파라미터의 용도:
 *    동일한 메뉴 아이템에 대해 여러 탭을 허용할지 결정합니다.
 *    false인 경우(기본값): 같은 메뉴는 항상 하나의 탭으로만 열립니다.
 *    true인 경우: 다른 파라미터를 가진 동일 메뉴의 여러 탭을 열 수 있습니다.
 *    
 *    예를 들어, 여러 캠페인의 상세 페이지를 동시에 열고 싶을 때:
 *    openTab('CampaignDetail', { id: 123 }, true);
 *    openTab('CampaignDetail', { id: 456 }, true);
 * 
 * 3. UUID 사용 이유:
 *    각 탭에 고유한 ID를 부여하기 위해 UUID를 사용합니다.
 *    이전에는 menuItemId와 params를 조합한 문자열을 사용했지만,
 *    이 방식은 params 객체가 복잡할 경우 가독성이 떨어지는 문제가 있었습니다.
 *    UUID는 항상 고유하고 일관된 형식의 ID를 보장합니다.
 */