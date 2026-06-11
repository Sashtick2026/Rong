import React from 'react';

interface OrnamentProps {
  className?: string;
  size?: number;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

// 1. Traditional Bengali Corner Frame Ornament
export const CornerOrnament: React.FC<OrnamentProps> = ({ position = 'top-left' }) => {
  const getRotationClass = () => {
    switch (position) {
      case 'top-right': return 'top-0 right-0 rotate-90';
      case 'bottom-left': return 'bottom-0 left-0 -rotate-90';
      case 'bottom-right': return 'bottom-0 right-0 rotate-180';
      default: return 'top-0 left-0';
    }
  };

  return (
    <div className={`absolute p-1 pointer-events-none opacity-30 ${getRotationClass()}`} style={{ width: '40px', height: '40px' }}>
      <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M 2,38 L 2,2 C 2,2 18,2 24,2 L 24,6 L 6,6 L 6,24 L 2,24" stroke="#8E857B" strokeWidth="1" strokeLinecap="round" />
        <circle cx="10" cy="10" r="2" fill="#C46E4E" />
        <path d="M 14,14 C 18,10 22,14 18,18 Z" fill="#4B5634" opacity="0.7" />
      </svg>
    </div>
  );
};

// 2. Circular sacred Bengal floor motif (Alpana)
export const AlpanaCircular: React.FC<{ size?: number; className?: string }> = ({ size = 120, className = '' }) => {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="44" stroke="#8E857B" strokeWidth="0.5" strokeDasharray="2 2" />
        <circle cx="50" cy="50" r="38" stroke="#C46E4E" strokeWidth="1.2" />
        <circle cx="50" cy="50" r="30" stroke="#8E857B" strokeWidth="0.75" />
        
        <g stroke="#C46E4E" strokeWidth="0.75">
          <path d="M 50,12 C 46,18 54,18 50,12 Z" />
          <path d="M 50,88 C 46,82 54,82 50,88 Z" />
          <path d="M 12,50 C 18,46 18,54 12,50 Z" />
          <path d="M 88,50 C 82,46 82,54 88,50 Z" />
          
          <path d="M 23,23 C 28,26 26,30 23,23 Z" />
          <path d="M 77,77 C 72,74 74,70 77,77 Z" />
          <path d="M 77,23 C 74,28 70,26 77,23 Z" />
          <path d="M 23,77 C 26,72 30,74 23,77 Z" />
        </g>
        
        <circle cx="50" cy="50" r="14" fill="#4B5634" opacity="0.35" />
        <circle cx="50" cy="50" r="4" fill="#C46E4E" />
      </svg>
    </div>
  );
};

// 3. Delicate organic botanical leaf branch line-art
export const LeafBranch: React.FC<{ size?: number; className?: string }> = ({ size = 28, className = '' }) => {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M2 22C6 18 10 16 14 14C17 12.5 19 11 20 8" stroke="#4B5634" strokeWidth="1.2" strokeLinecap="round" />
        {/* Curated tiny hand-styled organic leaves */}
        <path d="M5 18C7 16 9 17 8 15C7 13 5 15 5 18Z" fill="#4B5634" stroke="#4B5634" strokeWidth="0.5" />
        <path d="M10 14C12 12 14 13 13 11C12 9 10 11 10 14Z" fill="#4B5634" stroke="#4B5634" strokeWidth="0.5" />
        <path d="M15 11C17 9 19 10 18 8C17 6 15 8 15 11Z" fill="#4B5634" stroke="#4B5634" strokeWidth="0.5" />
        <path d="M18 6C19 4 21 5 20 3C19 1 17 3 18 6Z" fill="#C46E4E" stroke="#C46E4E" strokeWidth="0.5" />
      </svg>
    </div>
  );
};

// 4. Clay pot line-art vector (pottery/Kalash shape)
export const PotteryOrnament: React.FC<{ size?: number; className?: string }> = ({ size = 48, className = '' }) => {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        {/* Kalash mouth / brim */}
        <path d="M16 8 H32 L31 12 H17 Z" fill="#8E857B" opacity="0.3" stroke="#8E857B" strokeWidth="1" strokeLinejoin="round" />
        {/* Pot body curves */}
        <path d="M17 12C15 15 13 18 13 22C13 32 17 38 24 38C31 38 35 32 35 22C35 18 33 15 31 12" stroke="#C46E4E" strokeWidth="1.2" strokeLinecap="round" />
        {/* Base of pot */}
        <path d="M19 38H29" stroke="#8E857B" strokeWidth="1.5" strokeLinecap="round" />
        {/* Accent concentric lines indicating soil layers */}
        <path d="M14 22H34" stroke="#8E857B" strokeWidth="0.75" strokeDasharray="3 3" />
        <path d="M15 28C17 32 31 32 33 28" stroke="#C46E4E" strokeWidth="0.75" />
      </svg>
    </div>
  );
};

// 5. Stylized hand-drawn direction arrow
export const HandDrawnArrow: React.FC<{ size?: number; className?: string }> = ({ size = 32, className = '' }) => {
  return (
    <div className={`pointer-events-none select-none ${className}`} style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M4 16C12 14 18 18 26 14" stroke="#C46E4E" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M21 9 L27 14.5 L20 20" stroke="#C46E4E" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </div>
  );
};

// 6. Seamless organic horizontal segment divider (often with tiny flower head)
export const OrganicDivider: React.FC<{ className?: string }> = ({ className = '' }) => {
  return (
    <div className={`w-full flex items-center justify-center gap-3 my-4 pointer-events-none select-none ${className}`}>
      <div className="h-[0.75px] bg-brand-clay/20 flex-1 max-w-[80px]" />
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg" className="shrink-0">
        <circle cx="9" cy="9" r="2.5" fill="#C46E4E" />
        <path d="M9 1C8 4 10 4 9 1Z" fill="#4B5634" />
        <path d="M9 17C8 14 10 14 9 17Z" fill="#4B5634" />
        <path d="M1 9C4 8 4 10 1 9Z" fill="#4B5634" />
        <path d="M17 9C14 8 14 10 17 9Z" fill="#4B5634" />
      </svg>
      <div className="h-[0.75px] bg-brand-clay/20 flex-1 max-w-[80px]" />
    </div>
  );
};

// 7. Artistic luxury circular border mimicking organic brushstrokes
export const LuxuryBrushCircle: React.FC<{ size?: number; className?: string }> = ({ size = 200, className = '' }) => {
  return (
    <div className={`pointer-events-none select-none relative ${className}`} style={{ width: size, height: size }}>
      <svg width="100%" height="100%" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="50" cy="50" r="45" stroke="#C46E4E" strokeWidth="0.5" strokeDasharray="5 15" opacity="0.4" />
        <path d="M 50,5 A 45,45 0 1,1 49.9,5" stroke="#8E857B" strokeWidth="1" strokeDasharray="30 10 15 20" strokeLinecap="round" />
        <circle cx="50" cy="50" r="40" stroke="#4B5634" strokeWidth="0.5" opacity="0.25" />
      </svg>
    </div>
  );
};
