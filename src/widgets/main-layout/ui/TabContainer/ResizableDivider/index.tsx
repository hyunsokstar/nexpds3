// src/widgets/main-layout/ui/TabContainer/ResizableDivider/index.tsx
import React, { useState, useCallback } from 'react';

interface Props {
  onResize: (deltaX: number) => void;
}

const ResizableDivider: React.FC<Props> = ({ onResize }) => {
  const [isDragging, setIsDragging] = useState(false);
  
  // Mouse down event handler
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
    
    // Add event listeners for mouse move and mouse up
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    
    // Set cursor for entire document during dragging
    document.body.style.cursor = 'col-resize';
    document.body.style.userSelect = 'none'; // Prevent text selection during resize
  }, []);
  
  // Mouse move event handler
  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (isDragging) {
      onResize(e.movementX);
    }
  }, [isDragging, onResize]);
  
  // Mouse up event handler
  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    
    // Remove event listeners
    document.removeEventListener('mousemove', handleMouseMove);
    document.removeEventListener('mouseup', handleMouseUp);
    
    // Reset cursor
    document.body.style.cursor = '';
    document.body.style.userSelect = '';
  }, [handleMouseMove]);
  
  return (
    <div
      className={`w-1 cursor-col-resize bg-gray-300 hover:bg-blue-400 active:bg-blue-500 ${isDragging ? 'bg-blue-500' : ''}`}
      onMouseDown={handleMouseDown}
    />
  );
};

export default ResizableDivider;