import React, { useEffect, useState } from 'react';

// Drifting motifs catalog mapping beautiful clay and organic symbols of Bengal
interface DriftItem {
  id: number;
  x: number; // percentage left
  delay: number; // seconds
  duration: number; // seconds
  size: number; // pixels
  rotation: number; // degrees
  type: 'leaf' | 'sparkle' | 'bead' | 'spiral';
}

export const AmbientFloatingAtmosphere: React.FC = () => {
  const [items, setItems] = useState<DriftItem[]>([]);
  const [mousePosition, setMousePosition] = useState({ x: 50, y: 50 });
  const [isMobile, setIsMobile] = useState(false);

  // Generate drift items once on mount
  useEffect(() => {
    const isMobileDevice = window.innerWidth < 768;
    setIsMobile(isMobileDevice);

    const count = isMobileDevice ? 8 : 16;
    const generated: DriftItem[] = Array.from({ length: count }, (_, i) => ({
      id: i,
      x: Math.random() * 95 + 2.5, // avoid extreme edges
      delay: Math.random() * -20, // negative delay means they start mid-flight for instant immersion
      duration: Math.random() * 25 + 25, // slow, gentle drift (25-50s)
      size: Math.random() * 16 + 10, // 10px to 26px
      rotation: Math.random() * 360,
      type: (['leaf', 'sparkle', 'bead', 'spiral'][i % 4]) as DriftItem['type'],
    }));
    setItems(generated);

    // Track mouse coordinates for lantern-glow effect
    const handleMouseMove = (e: MouseEvent) => {
      // Calculate viewport percentages to feed into radial CSS variables
      const px = (e.clientX / window.innerWidth) * 100;
      const py = (e.clientY / window.innerHeight) * 100;
      setMousePosition({ x: px, y: py });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
      {/* 1. Self-contained Keyframe Animations via standard Style Tag */}
      <style>{`
        @keyframes gentleDrift {
          0% {
            transform: translateY(-10%) rotate(0deg) translateX(0px);
            opacity: 0;
          }
          5% {
            opacity: var(--max-opacity, 0.4);
          }
          95% {
            opacity: var(--max-opacity, 0.4);
          }
          100% {
            transform: translateY(115vh) rotate(var(--spin-rot, 360deg)) translateX(var(--drift-w, 40px));
            opacity: 0;
          }
        }
        .organic-glow {
          background: radial-gradient(
            circle 400px at ${mousePosition.x}% ${mousePosition.y}%, 
            rgba(233, 223, 201, 0.28) 0%, 
            rgba(247, 242, 230, 0.08) 50%, 
            transparent 100%
          );
          transition: background 0.3s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>

      {/* 2. Interactive lantern glow moving behind content (hidden on mobile for perfect performance) */}
      {!isMobile && (
        <div 
          className="fixed inset-0 pointer-events-none z-0 organic-glow opacity-90 transition-opacity duration-1000" 
          aria-hidden="true" 
        />
      )}

      {/* 3. Drift Elements container */}
      <div className="absolute inset-0 w-full h-full min-h-screen">
        {items.map((item) => {
          let svgContent = null;
          let color = '#C46E4E'; // defaults to brand clay tone
          let maxOpacity = '0.4';

          switch (item.type) {
            case 'leaf':
              color = '#6A7450'; // Leaf Olive green
              maxOpacity = '0.35';
              svgContent = (
                <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
                  <path d="M2 22C6 18 11 15 16 13C19 11.5 21 10 22 7" stroke={color} strokeWidth="1.2" strokeLinecap="round" />
                  <path d="M5 18C7 16 9 17 8 15C7 13 5 15 5 18Z" fill={color} />
                  <path d="M11 13C13 11 15 12 14 10C13 8 11 10 11 13Z" fill={color} />
                  <path d="M16 10C18 8 20 9 19 7C18 5 16 7 16 10Z" fill={color} />
                </svg>
              );
              break;
            case 'sparkle':
              color = '#C46E4E'; // terracotta
              maxOpacity = '0.5';
              svgContent = (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
                  <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5Z" />
                </svg>
              );
              break;
            case 'bead':
              color = '#B8A189'; // soft clay
              maxOpacity = '0.35';
              svgContent = (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.2" className="w-full h-full">
                  <circle cx="12" cy="12" r="8" />
                  <circle cx="12" cy="12" r="3" fill={color} />
                </svg>
              );
              break;
            case 'spiral':
              color = '#C46E4E';
              maxOpacity = '0.25';
              svgContent = (
                <svg viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1" strokeLinecap="round" className="w-full h-full">
                  {/* Miniature concentric whorl symbolizing endless timeline pattern */}
                  <path d="M12 12c.5-2.5 4.5-2.5 4.5 0 0 3-6 3-6 0 0-3.5 7.5-3.5 7.5 0 0 4-9.5 4-9.5 0" />
                </svg>
              );
              break;
          }

          // Randomize drift translation limits to make physical movement organic
          const driftWidth = `${(item.id % 2 === 0 ? 1 : -1) * (30 + (item.id % 4) * 15)}px`;
          const spinRot = `${(item.id % 2 === 0 ? 360 : -360) + (item.id * 10)}deg`;

          const itemStyle = {
            left: `${item.x}%`,
            width: `${item.size}px`,
            height: `${item.size}px`,
            animationName: 'gentleDrift',
            animationDuration: `${item.duration}s`,
            animationDelay: `${item.delay}s`,
            animationIterationCount: 'infinite',
            animationTimingFunction: 'linear',
            top: '-50px',
            transform: `rotate(${item.rotation}deg)`,
            '--drift-w': driftWidth,
            '--spin-rot': spinRot,
            '--max-opacity': maxOpacity,
          } as React.CSSProperties;

          return (
            <div
              key={item.id}
              className="absolute z-0"
              style={itemStyle}
            >
              {svgContent}
            </div>
          );
        })}
      </div>
    </div>
  );
};
