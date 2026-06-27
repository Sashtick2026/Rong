import React, { useState, useEffect, useRef } from 'react';
import { motion, useScroll, useTransform, useSpring } from 'motion/react';
import { ArrowRight, Compass, MapPin, Sparkles, ArrowLeftRight, Heart, ShoppingBag } from 'lucide-react';
import { LeafBranch, CornerOrnament, AlpanaCircular } from './Ornaments';
import { Product } from '../types';
import { firestore } from '../lib/mockFirebase';

interface HeroInteractiveProps {
  products: Product[];
  onOpenProductDetails: (product: Product) => void;
  onExploreShop: () => void;
  onExploreStory: () => void;
}

export const HeroInteractive: React.FC<HeroInteractiveProps> = ({
  products,
  onOpenProductDetails,
  onExploreShop,
  onExploreStory,
}) => {
  const settings = firestore.getSettings();
  const containerRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [rotation, setRotation] = useState<number>(0);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const dragStartRef = useRef({ x: 0, rot: 0, time: 0 });
  const lastDeltaX = useRef(0);
  const hasMoved = useRef(false);

  const targetRotationRef = useRef<number>(0);
  const currentRotationRef = useRef<number>(0);
  const velocityRef = useRef<number>(-0.0025);
  const lastPointerXRef = useRef<number>(0);
  const lastPointerTimeRef = useRef<number>(0);

  // Filter key showcase products based on dynamic site settings configurations
  const sliderIds = settings?.sliderProductIds || ['saree-nilufer', 'jewelry-poromatshya', 'pot-kolsi-luxury', 'bangles-mukta', 'saree-boshonto'];
  const slidingProducts = (products || []).filter(p => p && p.id && sliderIds.includes(p.id));

  const displayProducts = (slidingProducts.length >= 3 ? slidingProducts : (products || []).slice(0, 5)).filter(p => p && p.id && p.image);

  // Continuous background circular rotation with high-performance momentum decay and lerp
  useEffect(() => {
    let animFrame: number;
    let lastTime = performance.now();

    const tick = () => {
      const now = performance.now();
      const delta = Math.min((now - lastTime) / 16.666, 4); // limit maximum delta
      lastTime = now;

      if (!isDragging) {
        // Slowly decay high velocity back to the elegant base cruise speed
        const cruiseSpeed = -0.0022;
        velocityRef.current += (cruiseSpeed - velocityRef.current) * 0.04 * delta;
        targetRotationRef.current += velocityRef.current * delta;
      }

      // Smoothly interpolate current position with a customized lerp factor
      const lerpFactor = isDragging ? 0.22 : 0.07;
      const diff = targetRotationRef.current - currentRotationRef.current;
      currentRotationRef.current += diff * lerpFactor * delta;

      setRotation(currentRotationRef.current);

      animFrame = requestAnimationFrame(tick);
    };

    animFrame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(animFrame);
  }, [isDragging]);

  // Pointer Event Handlers for Dragging
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    dragStartRef.current = { x: e.clientX, y: e.clientY, rot: targetRotationRef.current, time: Date.now() };
    lastPointerXRef.current = e.clientX;
    lastPointerTimeRef.current = Date.now();
    lastDeltaX.current = 0;
    hasMoved.current = false;
    velocityRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;

    const deltaX = e.clientX - dragStartRef.current.x;
    const deltaY = e.clientY - (dragStartRef.current.y || e.clientY);
    lastDeltaX.current = deltaX;
    
    // Check if the user is attempting a vertical scroll rather than a horizontal slide
    if (!hasMoved.current && Math.abs(deltaY) > Math.abs(deltaX) && Math.abs(deltaY) > 6) {
      setIsDragging(false);
      return;
    }
    
    if (Math.abs(deltaX) > 4) {
      hasMoved.current = true;
      if (trackRef.current && !trackRef.current.hasPointerCapture?.(e.pointerId)) {
        try {
          trackRef.current.setPointerCapture(e.pointerId);
        } catch (err) {}
      }
    }

    // Map screen movement to circular path rotation
    const factor = window.innerWidth < 640 ? 180 : 340;
    const angleDelta = (deltaX / factor) * (Math.PI / 1.5);
    targetRotationRef.current = dragStartRef.current.rot + angleDelta;

    // Track real-time drag velocity for kinetic throwing on release
    const now = Date.now();
    const timeElapsed = now - lastPointerTimeRef.current;
    if (timeElapsed > 10) {
      const distance = e.clientX - lastPointerXRef.current;
      const instantAngleDelta = (distance / factor) * (Math.PI / 1.5);
      velocityRef.current = instantAngleDelta / (timeElapsed / 16.666);
      
      // Limit velocity cap to prevent infinite sonic loops
      const maxVel = 0.12;
      velocityRef.current = Math.max(-maxVel, Math.min(maxVel, velocityRef.current));
      
      lastPointerXRef.current = e.clientX;
      lastPointerTimeRef.current = now;
    }
  };

  const handlePointerUp = (e: React.PointerEvent, product: Product) => {
    if (!isDragging) return;
    setIsDragging(false);

    if (trackRef.current) {
      try {
        trackRef.current.releasePointerCapture(e.pointerId);
      } catch (err) {}
    }

    const duration = Date.now() - dragStartRef.current.time;

    // If drag was extremely small/fast, treat it as a crisp click to direct to product details
    if (!hasMoved.current || (Math.abs(lastDeltaX.current) < 5 && duration < 240)) {
      onOpenProductDetails(product);
    }
  };

  // Screen height/scroll bounds for parallax layering
  const { scrollY } = useScroll();
  const textOpacity = useTransform(scrollY, [0, 400], [1, 0]);
  const textScale = useTransform(scrollY, [0, 450], [1, 0.97]);

  // Compute positions of products along 3D slanted orbital circle
  const getCardPositionStyles = (index: number, total: number) => {
    const cardAngle = rotation + (index / total) * 2 * Math.PI;
    
    // Responsive Dimensions
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const radiusX = isMobile ? 130 : 250;     // horizontal circular radius
    const radiusZ = isMobile ? 80 : 160;     // depth/Z radius
    
    // Coordinates
    const x = Math.sin(cardAngle) * radiusX;
    const z = Math.cos(cardAngle) * radiusZ;
    
    // Calculate 3D scale and transparency based on depth position (Z)
    // Z ranges from -radiusZ (back) to +radiusZ (front)
    const normalizedZ = (z + radiusZ) / (2 * radiusZ); // 0 (back) to 1 (front)
    
    const scale = normalizedZ * 0.42 + 0.58;       // front: 1.0, back: 0.58
    const opacity = normalizedZ * 0.72 + 0.28;     // front: 1.0, back: 0.28
    const zIndex = Math.round((z + radiusZ) * 20); // Front gets higher index
    
    return {
      transform: `translate3d(${x}px, 0px, ${z}px) scale(${scale})`,
      opacity,
      zIndex,
      pointerEvents: 'auto' as const,
    };
  };

  return (
    <section 
      ref={containerRef}
      className="relative min-h-[92vh] flex flex-col justify-center overflow-hidden bg-black px-4 sm:px-6 lg:px-8 pt-8 pb-16 select-none"
    >
      {/* Immersive Cinematic Background Video Layer */}
      <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0 bg-neutral-950">
        <img 
          src="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1600" 
          alt="Weaving loom fallback"
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        <video 
          poster="https://images.unsplash.com/photo-1544816155-12df9643f363?q=80&w=1600"
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-85"
        >
          <source 
            src="https://cdn.discordapp.com/attachments/1433397128155103307/1518495363756064799/Basic_Model-1782106795000.mp4?ex=6a40b802&is=6a3f6682&hm=a9981500ec004fa900e84a531dcabe79b98ce5f8b0311a83ffecbd9bc581d21c&"
            type="video/mp4"
          />
          <source 
            src="https://assets.mixkit.co/videos/preview/mixkit-weaving-loom-in-a-traditional-fabric-factory-40810-large.mp4"
            type="video/mp4"
          />
        </video>
        {/* Dual gradients optimized for high contrast text readability */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/55 to-black/75 mix-blend-multiply" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/20 via-transparent to-black/45" />
      </div>

      {/* Visual Architectural Background Dividers */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent z-10" />
      <div className="absolute inset-y-0 left-12 w-px bg-white/5 hidden lg:block z-10" />
      <div className="absolute inset-y-0 right-12 w-px bg-white/5 hidden lg:block z-10" />
      
      {/* Vintage Blueprint watermark background */}
      <div className="absolute -top-12 -left-20 opacity-[0.04] pointer-events-none hidden xl:block z-10">
        <AlpanaCircular size={380} className="text-white" />
      </div>

      <div className="max-w-7xl mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center relative z-10">
        
        {/* Left Column: Handloom Storytelling Manifesto */}
        <motion.div 
          style={{ opacity: textOpacity, scale: textScale }}
          className="lg:col-span-5 space-y-6 sm:space-y-8 text-left z-10"
        >
          <div className="space-y-3">
            <h1 className="font-serif text-5xl sm:text-7xl font-semibold text-white tracking-tight leading-[1.08] overflow-hidden">
              <span className="block text-white">
                {settings.heroTitleLine1 || 'Archived Loom.'}
              </span>
              <span className="block font-serif tracking-tight font-normal text-brand-terracotta italic ml-1">
                {settings.heroTitleLine2 || 'Slow Crafted.'}
              </span>
            </h1>
          </div>

          <p className="text-xs sm:text-base text-white/80 leading-relaxed max-w-md text-justify font-sans">
            {settings.heroDescription || 'Operating as a visual culture register, রঙ archives the handloom rhythms of Bangladesh. Combining slow, kiln-fired riverbed soil and botanically dyed yarns, each curated piece stands as an authentic monument to ancient aesthetic geometries.'}
          </p>

          {/* Premium UI Interaction Helpers */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
            <button
              id="hero-explore-shop-btn"
              onClick={onExploreShop}
              className="group bg-white hover:bg-brand-terracotta text-brand-charcoal hover:text-white px-8 py-4 rounded-md text-xs font-bold tracking-widest uppercase transition-all duration-300 flex items-center justify-center gap-2.5 shadow-md shadow-black/30 border border-transparent hover:border-brand-terracotta"
            >
              <span>Explore Curation</span>
              <ArrowRight className="w-4 h-4 text-brand-charcoal group-hover:text-white group-hover:translate-x-1 transition-all" />
            </button>
            
            <button
              id="hero-explore-story-btn"
              onClick={onExploreStory}
              className="group border border-white/35 hover:border-white text-white hover:bg-white/10 px-8 py-4 rounded-md text-xs font-bold tracking-widest uppercase transition-colors duration-300 flex items-center justify-center gap-2"
            >
              <span>Read Register</span>
              <span className="w-5 h-5 rounded-full bg-white/10 group-hover:bg-white group-hover:text-brand-charcoal text-white/80 transition-all duration-300 flex items-center justify-center font-mono text-[8px] font-bold">
                ঋ
              </span>
            </button>
          </div>

          {/* Removed Geographic Coordinates Seal info to make the design cleaner */}
          <div className="pt-4 border-t border-white/10" />
        </motion.div>

        {/* Right Column: High-End 3D Orbital Carousel Slider */}
        <div className="lg:col-span-7 relative h-[500px] sm:h-[580px] w-full flex items-center justify-center">
          
          {/* Subtle blueprint depth guidelines */}
          <div className="absolute inset-8 rounded-3xl border border-dashed border-brand-clay/10 pointer-events-none flex items-center justify-center">
            <div className="w-full h-px bg-brand-clay/5 absolute top-1/2 left-0" />
            <div className="h-full w-px bg-brand-clay/5 absolute top-0 left-1/2" />
            
            {/* Perspective orbital grid lines */}
            <div className="w-[110%] h-[55%] border border-[#C46E4E]/10 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-12 pointer-events-none" />
            <div className="w-[85%] h-[35%] border border-[#C46E4E]/5 rounded-full absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform -rotate-12 pointer-events-none" />
          </div>

          {/* Draggable Circle Track Container */}
          <div 
            ref={trackRef}
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={(e) => handlePointerUp(e, displayProducts[0])} // default callback fallback
            className="absolute inset-0 w-full h-full flex items-center justify-center cursor-grab active:cursor-grabbing text-center select-none touch-pan-y"
            style={{ perspective: '800px', transformStyle: 'preserve-3d' }}
          >
            {/* The 3D Cards or Elegant Empty State */}
            {displayProducts.length === 0 ? (
              <div
                className="absolute w-[280px] sm:w-[325px] bg-brand-bg border-2 border-double border-brand-clay/35 p-6 sm:p-7 rounded-2xl shadow-xl text-center flex flex-col justify-between items-center transition-all duration-500"
                style={{ transform: 'translate3d(0px, 0px, 120px)' }}
              >
                <div className="w-full border-b border-brand-clay/10 pb-3 mb-4 flex justify-between items-center">
                  <span className="text-[10px] font-mono tracking-widest text-[#6A7450] uppercase font-bold">
                    Atelier Standard // Ready
                  </span>
                  <span className="text-[9px] font-mono text-brand-terracotta bg-brand-terracotta/5 px-2.5 py-0.5 rounded-full font-bold uppercase select-none">[Pristine Clean]</span>
                </div>
                
                <div className="my-4 space-y-4">
                  <div className="w-14 h-14 rounded-full bg-brand-beige/55 border border-brand-clay/20 flex items-center justify-center mx-auto text-brand-terracotta shadow-xs">
                    <Sparkles className="w-6 h-6 text-brand-terracotta animate-pulse" />
                  </div>
                  <h3 className="font-serif text-base font-bold text-brand-charcoal">Atelier Awaiting Showcase</h3>
                  <p className="text-[11px] text-brand-charcoal/70 leading-relaxed max-w-xs mx-auto font-sans">
                    Our handloom showcase is currently preparing its next curated release. Sign in to the Curator Portal to update our physical stock or add custom heritage items.
                  </p>
                </div>

                <div className="w-full border-t border-brand-clay/10 pt-3 mt-4 text-[9px] font-mono text-brand-clay uppercase tracking-wider font-semibold">
                  RANG BOUTIQUE • READY FOR DELIVERY
                </div>

                {/* Decorative border ornaments */}
                <CornerOrnament position="top-left" className="m-0.5 text-brand-clay/20" />
                <CornerOrnament position="bottom-right" className="m-0.5 text-brand-clay/20" />
              </div>
            ) : (
              displayProducts.map((product, idx) => {
                const cardPos = getCardPositionStyles(idx, displayProducts.length);
                
                return (
                  <div
                    key={product.id}
                    style={cardPos}
                    onPointerUp={(e) => {
                      e.stopPropagation();
                      handlePointerUp(e, product);
                    }}
                    className="absolute w-[220px] sm:w-[260px] bg-brand-bg border border-brand-clay/20 p-3 sm:p-4 rounded-xl shadow-xl transition-shadow duration-300 hover:shadow-2xl hover:border-brand-terracotta select-none"
                  >
                    {/* Miniature archival tag line */}
                    <div className="flex items-center justify-between border-b border-brand-clay/10 pb-2 mb-3">
                      <span className="text-[8px] font-mono tracking-widest text-[#6A7450] uppercase font-bold">
                        Atelier Register // {idx + 1}
                      </span>
                      <span className="text-[8px] font-mono text-brand-clay">
                        [RANG-0{idx + 1}]
                      </span>
                    </div>

                    {/* Photo Frame Container */}
                    <div className="aspect-[3/4] overflow-hidden rounded-lg bg-brand-beige/25 relative border border-brand-clay/10 group-hover:scale-101 transition-all">
                      <img 
                        src={product.image || null} 
                        alt={product.name} 
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover select-none pointer-events-none grayscale-[15%] group-hover:grayscale-0 transition-transform duration-1000"
                      />
                      
                      {/* Floating mini currency and buy badges */}
                      <div className="absolute bottom-2 left-2 bg-brand-bg/95 border border-brand-clay/20 px-2.5 py-1 rounded-md text-[9px] font-mono tracking-wider font-semibold text-brand-charcoal">
                        ৳{product.price} BDT
                      </div>
                    </div>

                    {/* Product Specification Title */}
                    <div className="mt-3 px-1 text-left space-y-1">
                      <h3 className="font-serif text-xs sm:text-sm font-semibold text-brand-charcoal line-clamp-1">
                        {product.name}
                      </h3>
                      <p className="text-[10px] text-brand-olive font-serif italic line-clamp-1 mt-0.5">
                        {product.banglaName}
                      </p>
                    </div>

                    {/* Aesthetic Corner brackets on active face card */}
                    <CornerOrnament position="top-left" className="m-0.5 text-brand-clay/30" />
                    <CornerOrnament position="bottom-right" className="m-0.5 text-brand-clay/30" />
                  </div>
                );
              })
            )}
          </div>

          {/* Removed helper instructions as per user request */}

          {/* Floating leaf icon highlights for brand rhythm */}
          <div className="absolute bottom-8 right-12 w-10 h-10 border border-white/10 rounded-full flex items-center justify-center bg-white/10 backdrop-blur-md z-30 opacity-70 pointer-events-none">
            <LeafBranch size={22} className="text-white opacity-80 animate-pulse" />
          </div>

        </div>

      </div>

      {/* Static scroll indicator sidebar bottom-left */}
      <div className="absolute bottom-8 left-12 hidden lg:flex flex-col items-center gap-3 text-white/50 opacity-80 pointer-events-none">
        <span className="text-[9px] font-mono tracking-[0.25em] uppercase vertical-text">Scroll to explore</span>
        <div className="w-px h-12 bg-gradient-to-b from-white/30 to-transparent" />
      </div>
    </section>
  );
};
