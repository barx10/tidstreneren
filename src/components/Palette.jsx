import React, { useState, useEffect, useRef } from 'react';

function Palette({ id, title, children, position, onPositionChange, zIndex, onFocus }) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
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
          borderRadius: '12px 12px 0 0',
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
        <span style={{ color: '#fff', fontSize: '13px', fontWeight: '600', letterSpacing: '0.5px' }}>
          {title}
        </span>
      </div>
      <div className="palette-content" style={{ padding: '16px' }}>
        {children}
      </div>
    </div>
  );
}

export default Palette;