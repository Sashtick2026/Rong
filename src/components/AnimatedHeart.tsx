import React, { useEffect, useState } from 'react';
import { Heart } from 'lucide-react';

interface AnimatedHeartProps {
  isWishlisted: boolean;
  className?: string;
}

export const AnimatedHeart: React.FC<AnimatedHeartProps> = ({ isWishlisted, className = '' }) => {
  const [playBeat, setPlayBeat] = useState(false);

  useEffect(() => {
    if (isWishlisted) {
      setPlayBeat(true);
      const timer = setTimeout(() => {
        setPlayBeat(false);
      }, 600);
      return () => clearTimeout(timer);
    }
  }, [isWishlisted]);

  return (
    <Heart 
      className={`${className} ${playBeat ? 'animate-heart-beat' : ''} ${isWishlisted ? 'fill-current' : ''}`} 
    />
  );
};
