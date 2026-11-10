import { useEffect, useState } from 'react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: -100, y: -100 });
  const [ringPosition, setRingPosition] = useState({ x: -100, y: -100 });
  const [isActive, setIsActive] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
  const [enabled, setEnabled] = useState(false);

  // Only enable the custom cursor on devices that actually have a fine
  // pointer (mouse/trackpad). Touch devices should never render this.
  useEffect(() => {
    const mq = window.matchMedia('(pointer: fine)');
    setEnabled(mq.matches);
    const handleChange = (e) => setEnabled(e.matches);
    mq.addEventListener('change', handleChange);
    return () => mq.removeEventListener('change', handleChange);
  }, []);

  // Hide the native OS cursor while our custom one is active, and restore
  // it on unmount so we never leave the page in a broken state.
  useEffect(() => {
    if (!enabled) return;
    document.body.classList.add('custom-cursor-active');
    return () => document.body.classList.remove('custom-cursor-active');
  }, [enabled]);

  useEffect(() => {
    if (!enabled) return;
    const handleMouseMove = (e) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsHidden(false);
    };

    const handleMouseLeave = () => {
      setIsHidden(true);
    };

    const handleMouseEnter = () => {
      setIsHidden(false);
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
    };
  }, [enabled]);

  // Smooth interpolation for the outer ring
  useEffect(() => {
    if (!enabled) return;
    let animationFrameId;
    
    const updateRing = () => {
      setRingPosition((prev) => {
        const dx = position.x - prev.x;
        const dy = position.y - prev.y;
        return {
          x: prev.x + dx * 0.15,
          y: prev.y + dy * 0.15,
        };
      });
      animationFrameId = requestAnimationFrame(updateRing);
    };

    animationFrameId = requestAnimationFrame(updateRing);
    return () => cancelAnimationFrame(animationFrameId);
  }, [position, enabled]);

  // Hook hover states for interactive components
  useEffect(() => {
    if (!enabled) return;
    const handleMouseOver = (e) => {
      const target = e.target;
      const isHoverable = 
        target.tagName === 'A' || 
        target.tagName === 'BUTTON' || 
        target.closest('.btn-premium') || 
        target.closest('.card-premium') ||
        target.closest('button') ||
        target.closest('a') ||
        target.closest('.hover-trigger');
        
      setIsActive(!!isHoverable);
    };

    window.addEventListener('mouseover', handleMouseOver);
    return () => {
      window.removeEventListener('mouseover', handleMouseOver);
    };
  }, [enabled]);

  if (!enabled || isHidden) return null;

  return (
    <>
      <div 
        className="custom-cursor" 
        style={{ left: `${position.x}px`, top: `${position.y}px` }} 
      />
      <div 
        className={`custom-cursor-ring ${isActive ? 'active' : ''}`} 
        style={{ left: `${ringPosition.x}px`, top: `${ringPosition.y}px` }} 
      />
    </>
  );
}
