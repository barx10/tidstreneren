import React, { useState, useEffect, useRef } from 'react';

function Palette({ id, title, children, position, onPositionChange, zIndex, onFocus, defaultCollapsed = false }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const paletteRef = useRef(null);

  const handleMouseDown = (e) => {
    if (e.target.closest('.palette-content')) return;
    onFocus(id);
    setIsDragging(true);
    const rect = paletteRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleTouchStart = (e) => {
    if (e.target.closest('.palette-content')) return;
    onFocus(id);
    setIsDragging(true);
    const rect = paletteRef.current.getBoundingClientRect();
    setDragOffset({
      x: e.touches[0].clientX - rect.left,
      y: e.touches[0].clientY - rect.top
    });
  };

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      onPositionChange(id, {
        x: e.clientX - dragOffset.x,
        y: e.clientY - dragOffset.y
      });
    };

    const handleTouchMove = (e) => {
      if (!isDragging) return;
      onPositionChange(id, {
        x: e.touches[0].clientX - dragOffset.x,
        y: e.touches[0].clientY - dragOffset.y
      });
    };

    const handleEnd = () => setIsDragging(false);

    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleEnd);
      window.addEventListener('touchmove', handleTouchMove);
      window.addEventListener('touchend', handleEnd);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleEnd);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleEnd);
    };
  }, [isDragging, dragOffset, id, onPositionChange]);

  return (
    <div
      ref={paletteRef}
      style={{
        position: 'absolute',
        left: position.x,
        top: position.y,
        background: '#fff',
        borderRadius: '12px',
        boxShadow: isDragging 
          ? '0 12px 40px rgba(0,0,0,0.2)' 
          : '0 4px 20px rgba(0,0,0,0.1)',
        zIndex: zIndex,
        transition: isDragging ? 'none' : 'box-shadow 0.2s',
        userSelect: 'none',
      }}
      onMouseDown={() => onFocus(id)}
    >
      <div
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
        style={{
          padding: '10px 16px',
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          borderRadius: isCollapsed ? '12px' : '12px 12px 0 0',
          cursor: isDragging ? 'grabbing' : 'grab',
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
        }}
      >
        <div style={{ display: 'flex', gap: '4px' }}>
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
          <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: 'rgba(255,255,255,0.5)' }} />
        </div>
        <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px', flex: 1 }}>
          {title}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setIsCollapsed(!isCollapsed);
          }}
          onMouseDown={(e) => e.stopPropagation()}
          onTouchStart={(e) => e.stopPropagation()}
          style={{
            background: 'rgba(255,255,255,0.2)',
            border: 'none',
            borderRadius: '4px',
            color: '#fff',
            cursor: 'pointer',
            width: '24px',
            height: '24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: 'background 0.2s',
          }}
          title={isCollapsed ? 'Utvid' : 'Minimer'}
        >
          {isCollapsed ? '+' : '−'}
        </button>
      </div>
      {!isCollapsed && (
        <div className="palette-content" style={{ padding: '16px' }}>
          {children}
        </div>
      )}
    </div>
  );
}

export default Palette;