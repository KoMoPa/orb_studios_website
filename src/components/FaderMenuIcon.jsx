'use client';

import { useState, useEffect } from 'react';

export default function FaderMenuIcon({ isOpen, onToggle }) {
  const [theme, setTheme] = useState('light');
  
  // Fader positions: [closed, open]
  const faderPositions = [
    [8, 22],   // Left fader
    [22, 8],   // Middle fader
    [15, 15],  // Right fader
  ];
  
  const [animatedPositions, setAnimatedPositions] = useState(
    faderPositions.map(p => p[0])
  );
  
  // Detect theme changes
  useEffect(() => {
    const updateTheme = () => {
      const dataTheme = document.documentElement.getAttribute('data-theme') || 'light';
      setTheme(dataTheme);
    };
    
    updateTheme();
    
    // Watch for theme changes
    const observer = new MutationObserver(updateTheme);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    
    return () => observer.disconnect();
  }, []);
  
  // Animate fader positions based on isOpen prop
  useEffect(() => {
    const startPositions = [...animatedPositions];
    const targetPositions = faderPositions.map(p => p[isOpen ? 1 : 0]);
    const duration = 300; // ms
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      
      // Ease-in-out cubic
      const eased = progress < 0.5
        ? 4 * progress * progress * progress
        : 1 - Math.pow(-2 * progress + 2, 3) / 2;
      
      const current = startPositions.map((start, i) => 
        start + (targetPositions[i] - start) * eased
      );
      
      setAnimatedPositions(current);
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    requestAnimationFrame(animate);
  }, [isOpen]);
  
  const toggleMenu = () => {
    onToggle?.();
  };
  
  const color = '#FFFFFF';
  
  return (
    <button
      onClick={toggleMenu}
      className="relative w-12 h-12 flex items-center justify-center transition-all duration-300 hover:scale-110"
      aria-label={isOpen ? 'Close menu' : 'Open menu'}
      aria-expanded={isOpen}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 32 32"
        aria-hidden="true"
      >
        {/* Left fader */}
        <line x1="8" y1="4" x2="8" y2="28" stroke={color} strokeWidth="2" />
        <rect x="4" y={animatedPositions[0]} width="8" height="4" fill={color} rx="1" />
        
        {/* Middle fader */}
        <line x1="16" y1="4" x2="16" y2="28" stroke={color} strokeWidth="2" />
        <rect x="12" y={animatedPositions[1]} width="8" height="4" fill={color} rx="1" />
        
        {/* Right fader */}
        <line x1="24" y1="4" x2="24" y2="28" stroke={color} strokeWidth="2" />
        <rect x="20" y={animatedPositions[2]} width="8" height="4" fill={color} rx="1" />
      </svg>
    </button>
  );
}