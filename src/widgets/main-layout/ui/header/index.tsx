// src/widgets/main-layout/ui/header/index.tsx
'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'
import { useTabsStore } from '../../store/use-tabs'
import { MainMenuItems, MenuItem } from '../../configure/main-menu-items'
import { useCallback } from 'react'

export function Header() {
  const { openTab } = useTabsStore();

  const handleMenuClick = useCallback((menuItem: MenuItem) => {
    openTab(menuItem.id);
  }, [openTab]);

  return (
    <>
      {/* 상단 헤더 */}
      <header className="bg-gradient-to-r from-teal-600 to-teal-500 text-white shadow-sm">
        <div className="flex h-6 items-center justify-between px-3">
          <div className="flex items-center gap-1">
            <h1 className="text-xs font-bold tracking-wide">NEXDPS</h1>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center text-white">
              <span className="text-xs">홍길동(관리자)</span>
            </div>
            <Link href="#" className="flex h-5 w-5 items-center justify-center rounded-sm border border-white/30 text-white hover:bg-white/10">
              <Settings size={12} />
            </Link>
          </div>
        </div>
      </header>

      {/* 메인 메뉴 */}
      <div className="bg-white border-b">
        <div className="flex items-center overflow-x-auto px-3 py-1.5">
          <div className="flex flex-1 justify-start space-x-3">
            {MainMenuItems.map((item) => {
              const Icon = item.icon;
              
              return (
                <button 
                  key={item.id} 
                  className="group flex flex-col items-center justify-between h-14 px-2 py-1.5 border border-dashed border-transparent hover:border-gray-300 rounded-sm transition-colors relative"
                  onClick={() => handleMenuClick(item)}
                >
                  <div className="flex h-7 w-7 items-center justify-center rounded-sm bg-gray-50 group-hover:bg-gray-100">
                    <Icon 
                      size={16} 
                      className="text-gray-600 group-hover:text-teal-500"
                    />
                  </div>
                  <span className="text-xs mt-1 text-gray-600 group-hover:text-teal-500">
                    {item.name}
                  </span>
                </button>
              );
            })}
          </div>

          <div className="ml-auto flex">
            <button className="ml-2 flex h-7 w-7 items-center justify-center bg-gray-900 text-white text-xs rounded-sm hover:bg-gray-800 transition-colors">
              <span className="sr-only">검색</span>
              □
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

export default Header