// src/widgets/main-layout/ui/TabContainer/ResizableDivider/index.tsx
import React from 'react';

interface Props {
  onResize: (deltaX: number) => void;
}

const ResizableDivider: React.FC<Props> = ({ onResize }) => {
  // 마우스 다운 이벤트 핸들러
  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    
    // 초기 마우스 위치 저장
    const startX = e.clientX;
    
    // 이동 중인 구분선 스타일 적용
    const divider = e.currentTarget as HTMLElement;
    divider.classList.add('bg-blue-500');
    
    // 마우스 이동 핸들러
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX;
      onResize(deltaX);
    };
    
    // 마우스 업 핸들러
    const handleMouseUp = () => {
      // 이벤트 리스너 제거
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      
      // 드래그 완료 시 스타일 원복
      divider.classList.remove('bg-blue-500');
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };
    
    // 마우스 이동 및 업 이벤트 리스너 등록
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // 드래깅 중 커서 및 텍스트 선택 방지
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none';
  };
  
  return (
    <div
      className="w-1 bg-gray-300 hover:bg-blue-400 cursor-col-resize"
      onMouseDown={handleMouseDown}
    />
  );
};

export default ResizableDivider;