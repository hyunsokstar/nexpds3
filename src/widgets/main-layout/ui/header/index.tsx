
'use client'

import Link from 'next/link'
import { Settings } from 'lucide-react'
import { useTabs } from '../../store/use-tabs'
import { MainMenuItems } from '../../configure/main-menu-items'

export function Header() {
  const { addTab, tabs, activeTabId, areas, isSplit } = useTabs()

  const handleMenuClick = (item: typeof MainMenuItems[0]) => {
    // 탭 추가
    addTab({
      id: item.path,
      title: item.name,
      path: item.path,
      icon: item.icon
    })
  }

  return (
    <>
      {/* 상단 헤더 (민트색) - 높이 줄이고 글씨 크기 축소 */}
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

      {/* 메인 메뉴 - 패딩 줄이고 컴팩트하게 */}
      <div className="bg-white border-b">
        <div className="flex items-center overflow-x-auto px-3 py-1.5">
          <div className="flex flex-1 justify-start space-x-3">
            {MainMenuItems.map((item) => {
              const Icon = item.icon;
              
              // 해당 메뉴 아이템에 대한 탭이 열려있는지 확인
              const isTabOpen = tabs.some(tab => tab.path === item.path);
              
              // 메인 영역에서 활성화된 탭인지 확인 (단일 모드 또는 분할 모드의 활성 영역)
              const isActiveTab = isTabOpen && tabs.find(tab => tab.id === activeTabId)?.path === item.path;
              
              // 분할 모드에서 다른 영역의 활성 탭인지 확인
              const isActiveInOtherArea = isSplit && areas.some(area => 
                area.activeTabId && 
                area.tabs.some(tab => tab.id === area.activeTabId && tab.path === item.path) &&
                activeTabId !== area.activeTabId
              );
              
              return (
                <button 
                  key={item.name} 
                  className={`
                    group flex flex-col items-center justify-between h-14 px-2 py-1.5 
                    ${isActiveTab 
                      ? 'border border-teal-400 bg-teal-50' 
                      : isTabOpen
                        ? 'border border-dashed border-teal-200 bg-teal-50/50'
                        : 'border border-dashed border-transparent hover:border-gray-300'
                    } 
                    rounded-sm transition-colors relative
                  `}
                  onClick={() => handleMenuClick(item)}
                >
                  <div className={`
                    flex h-7 w-7 items-center justify-center rounded-sm
                    ${isActiveTab 
                      ? 'bg-teal-100' 
                      : isTabOpen
                        ? 'bg-teal-50'
                        : 'bg-gray-50 group-hover:bg-gray-100'
                    }
                  `}>
                    <Icon 
                      size={16} 
                      className={`
                        ${isActiveTab 
                          ? 'text-teal-600' 
                          : isTabOpen
                            ? 'text-teal-500'
                            : 'text-gray-600 group-hover:text-teal-500'
                        }
                      `} 
                    />
                  </div>
                  <span className={`
                    text-xs mt-1
                    ${isActiveTab 
                      ? 'text-teal-600 font-medium' 
                      : isTabOpen
                        ? 'text-teal-500'
                        : 'text-gray-600 group-hover:text-teal-500'
                    }
                  `}>
                    {item.name}
                  </span>
                  
                  {/* 활성 탭 인디케이터만 표시 */}
                  {(isActiveTab || isActiveInOtherArea) && (
                    <div className="absolute right-1 top-1">
                      <div className={`
                        w-2 h-2 rounded-full
                        ${isActiveTab ? 'bg-teal-500' : 'bg-blue-400'}
                      `}></div>
                    </div>
                  )}
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