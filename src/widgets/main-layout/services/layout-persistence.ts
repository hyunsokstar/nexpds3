// src/widgets/main-layout/services/layout-persistence.ts
'use client'

import { SplitMode, TabArea } from '../store/use-tabs';

// 저장할 레이아웃 설정 타입 정의
interface LayoutConfig {
  splitMode: SplitMode;
  areaWidths: number[];
  timestamp: number;
}

// 로컬 스토리지 키
const LAYOUT_CONFIG_KEY = 'app_layout_config';

// 레이아웃 설정 저장 함수
export const saveLayoutConfig = (splitMode: SplitMode, areaWidths: number[]): void => {
  if (typeof window === 'undefined') return;
  
  try {
    const config: LayoutConfig = {
      splitMode,
      areaWidths,
      timestamp: Date.now()
    };
    
    localStorage.setItem(LAYOUT_CONFIG_KEY, JSON.stringify(config));
  } catch (error) {
    console.error('레이아웃 설정 저장 중 오류 발생:', error);
  }
};

// 레이아웃 설정 불러오기 함수
export const loadLayoutConfig = (): LayoutConfig | null => {
  if (typeof window === 'undefined') return null;
  
  try {
    const savedConfig = localStorage.getItem(LAYOUT_CONFIG_KEY);
    if (!savedConfig) return null;
    
    const config: LayoutConfig = JSON.parse(savedConfig);
    
    // 오래된 설정 체크 (일주일 이상 된 설정은 무시)
    const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;
    if (Date.now() - config.timestamp > ONE_WEEK) {
      localStorage.removeItem(LAYOUT_CONFIG_KEY);
      return null;
    }
    
    return config;
  } catch (error) {
    console.error('레이아웃 설정 불러오기 중 오류 발생:', error);
    return null;
  }
};

// 레이아웃 설정 삭제 함수
export const clearLayoutConfig = (): void => {
  if (typeof window === 'undefined') return;
  
  try {
    localStorage.removeItem(LAYOUT_CONFIG_KEY);
  } catch (error) {
    console.error('레이아웃 설정 삭제 중 오류 발생:', error);
  }
};