
'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { ChevronDown, ChevronRight, Search, Headphones, ChevronRight as ChevronRightArrow } from 'lucide-react'
import { TreeItem, treeData } from './sidebar-items'

const TreeNode = ({ 
  item, 
  level = 0,
  activePath,
  onNodeClick 
}: { 
  item: TreeItem; 
  level?: number;
  activePath?: string;
  onNodeClick?: (item: TreeItem) => void;
}) => {
  const [isOpen, setIsOpen] = useState(level === 0) // 첫 번째 레벨은 기본적으로 열려있게
  const hasChildren = item.children && item.children.length > 0
  const Icon = item.icon || Headphones
  const isActive = activePath === item.path

  const handleClick = () => {
    if (hasChildren) {
      setIsOpen(!isOpen)
    }
    if (item.path) {
      onNodeClick?.(item)
    }
  }

  return (
    <div className="select-none">
      <div
        className={`flex items-center py-1.5 px-2 hover:bg-gray-100 cursor-pointer
          ${level === 0 ? 'font-medium' : ''} 
          ${isActive ? 'bg-teal-50 text-teal-600' : ''}
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={handleClick}
      >
        {hasChildren ? (
          <span className={`mr-1.5 ${isActive ? 'text-teal-500' : 'text-gray-500'}`}>
            {isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />}
          </span>
        ) : (
          <span className="w-4"></span>
        )}
        <Icon size={14} className={`mr-2 ${isActive ? 'text-teal-600' : 'text-gray-600'}`} />
        <span className={`truncate text-sm ${isActive ? 'text-teal-600 font-medium' : 'text-gray-700'}`}>
          {item.name}
        </span>
      </div>

      {isOpen && hasChildren && (
        <div>
          {item.children!.map(child => (
            <TreeNode 
              key={child.id} 
              item={child} 
              level={level + 1} 
              activePath={activePath}
              onNodeClick={onNodeClick}
            />
          ))}
        </div>
      )}
    </div>
  )
}

export function Sidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const [activePath, setActivePath] = useState<string | undefined>(undefined)
  const [searchTerm, setSearchTerm] = useState('')
  
  // 사이드바 리사이징 관련 상태 및 ref
  const [width, setWidth] = useState(260) // 기본 너비
  const [isResizing, setIsResizing] = useState(false)
  const sidebarRef = useRef<HTMLDivElement>(null)
  
  const minWidth = 24 // 접혔을 때 최소 너비
  const minExpandedWidth = 180 // 펼쳤을 때 최소 너비
  const maxWidth = 400 // 최대 너비

  // 사이드바 접기/펼치기 처리
  const toggleSidebar = () => {
    if (isCollapsed) {
      // 펼칠 때는 이전 너비로 복원 (최소 너비 확인)
      setWidth(Math.max(minExpandedWidth, width))
    } else {
      // 접을 때
      setWidth(minWidth)
    }
    setIsCollapsed(!isCollapsed)
  }

  // 리사이징 시작 핸들러
  const startResizing = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    setIsResizing(true)
    
    // 접힌 상태에서 리사이징 시작하면 자동으로 펼침
    if (isCollapsed) {
      setIsCollapsed(false)
      setWidth(minExpandedWidth)
    }
  }, [isCollapsed, minExpandedWidth])

  // 리사이징 효과
  useEffect(() => {
    const handleResize = (e: MouseEvent) => {
      if (!isResizing) return
      
      // 현재 마우스 위치에 따라 너비 계산
      const newWidth = e.clientX
      
      // 최소/최대 너비 제한
      if (newWidth >= minExpandedWidth && newWidth <= maxWidth) {
        setWidth(newWidth)
      }
    }

    const stopResizing = () => {
      setIsResizing(false)
    }

    if (isResizing) {
      document.addEventListener('mousemove', handleResize)
      document.addEventListener('mouseup', stopResizing)
    }

    return () => {
      document.removeEventListener('mousemove', handleResize)
      document.removeEventListener('mouseup', stopResizing)
    }
  }, [isResizing, minExpandedWidth, maxWidth])

  // 트리 노드 클릭 처리
  const handleNodeClick = useCallback((item: TreeItem) => {
    if (item.path) {
      setActivePath(item.path)
      // 여기에 탭 열기 로직 추가 가능
      console.log('Node clicked:', item.name, item.path)
    }
  }, [])

  // 검색어에 따른 필터링
  const filterTree = (items: TreeItem[], term: string): TreeItem[] => {
    if (!term) return items;
    
    return items
      .map(item => {
        // 현재 항목이 검색어를 포함하는지 확인
        const matchesCurrentItem = item.name.toLowerCase().includes(term.toLowerCase());
        
        // 자식 항목들에 대해 재귀적으로 필터링
        const filteredChildren = item.children 
          ? filterTree(item.children, term) 
          : undefined;
        
        // 현재 항목이 검색어를 포함하거나 자식 중에 포함하는 항목이 있으면 표시
        if (matchesCurrentItem || (filteredChildren && filteredChildren.length > 0)) {
          return {
            ...item,
            children: filteredChildren
          };
        }
        
        // 검색어를 포함하지 않으면 null 반환 (나중에 필터링됨)
        return null;
      })
      .filter(Boolean) as TreeItem[]; // null 항목 제거
  };

  const filteredTreeData = searchTerm 
    ? filterTree(treeData, searchTerm) 
    : treeData;

  return (
    <div className="relative h-full">
      {/* 메인 사이드바 컨테이너 */}
      <div
        ref={sidebarRef}
        className="h-full bg-white border-r flex flex-col relative"
        style={{ 
          width: isCollapsed ? minWidth : width,
          transition: isResizing ? 'none' : 'width 0.3s ease-in-out'
        }}
      >
        {isCollapsed ? (
          // 접힌 상태 - 최소한의 UI
          <div className="flex flex-col h-full items-center justify-center overflow-hidden">
            <div className="rotate-90 text-xs text-gray-500 whitespace-nowrap">사이드바</div>
          </div>
        ) : (
          // 펼쳐진 상태 - 모든 컨텐츠 표시
          <div className="flex flex-col h-full w-full overflow-hidden">
            {/* 상담원 헤더 */}
            <div className="border-b flex items-center h-12 px-4 overflow-hidden bg-gray-50">
              <div className="flex items-center space-x-2">
                <Headphones size={16} className="text-gray-600 flex-shrink-0" />
                <span className="text-sm font-medium text-gray-700 truncate">콜센터 관리</span>
              </div>
            </div>
            
            {/* 검색 부분 */}
            <div className="border-b p-2">
              <div className="relative">
                <Search size={14} className="absolute left-2 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="테넌트/캠페인 검색..."
                  className="w-full rounded-sm border pl-8 pr-2 py-1.5 text-sm outline-none focus:border-teal-300 focus:ring-1 focus:ring-teal-300"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                {searchTerm && (
                  <button 
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={() => setSearchTerm('')}
                  >
                    ×
                  </button>
                )}
              </div>
            </div>
            
            {/* 트리 내용 */}
            <div className="flex-1 overflow-y-auto p-1">
              {filteredTreeData.length > 0 ? (
                filteredTreeData.map(item => (
                  <TreeNode 
                    key={item.id} 
                    item={item} 
                    activePath={activePath}
                    onNodeClick={handleNodeClick}
                  />
                ))
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500 text-sm py-8">
                  <span>검색 결과가 없습니다</span>
                </div>
              )}
            </div>
          </div>
        )}
        
        {/* 리사이징 핸들 */}
        <div 
          className="absolute top-0 right-0 w-4 h-full cursor-ew-resize z-10"
          onMouseDown={startResizing}
          style={{ 
            opacity: isCollapsed ? 0 : 1,
            pointerEvents: isCollapsed ? 'none' : 'auto',
          }}
        >
          {/* 시각적 효과(선택 사항) */}
          <div className={`w-1 h-full bg-transparent hover:bg-gray-300 transition-colors duration-200 absolute right-0 ${isResizing ? 'bg-blue-400' : ''}`}></div>
        </div>
      </div>

      {/* 토글 버튼 */}
      <button
        className="absolute bg-white border rounded-full h-6 w-6 flex items-center justify-center shadow z-20 hover:bg-gray-100"
        style={{ 
          top: '106px',
          right: -12,
          transform: isCollapsed ? 'rotate(0deg)' : 'rotate(180deg)',
          transition: 'transform 0.3s ease-in-out'
        }}
        onClick={toggleSidebar}
      >
        <ChevronRightArrow size={14} />
      </button>
      
      {/* 드래그 중일 때 마우스 이벤트 캡처를 위한 오버레이 */}
      {isResizing && (
        <div 
          className="fixed inset-0 z-50" 
          style={{ cursor: 'ew-resize' }}
        />
      )}
    </div>
  )
}