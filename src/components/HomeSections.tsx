import React, { useRef, useState, useEffect } from 'react';
import { motion, useScroll, useTransform, useInView, useSpring, AnimatePresence } from 'motion/react';
import { Sparkles, ArrowRight, Share2, Heart, Star, BookmarkCheck, Calendar, Settings, RotateCcw } from 'lucide-react';
import { AlpanaCircular, LeafBranch, PotteryOrnament, CornerOrnament, LuxuryBrushCircle } from './Ornaments';
import { ProductCard } from './ProductCard';
import { firestore } from '../lib/mockFirebase';

// Import our custom images from data paths
import { Product, Collection, CommunitySnap } from '../types';
import heroSareeImg from '../assets/images/hero_saree_editorial_1781014487343.png';
import handmadeJewelryImg from '../assets/images/handmade_jewelry_1781014504077.png';
import homeDecorClayImg from '../assets/images/home_decor_clay_1781014520276.png';
import paintingProcessImg from '../assets/images/craft_painting_process_1781014539374.png';
import banglesStackImg from '../assets/images/bangles_stack_1781014560409.png';

interface HomeSectionsProps {
  products: Product[];
  onOpenProductDetails: (product: Product) => void;
  onQuickView: (product: Product) => void;
  onAddToCart: (product: Product) => void;
  onToggleWishlist: (product: Product) => void;
  isProductWishlisted: (product: Product) => boolean;
  setCategoryFilter: (category: string) => void;
  setCurrentPage: (page: string) => void;
  communitySnaps?: CommunitySnap[];
  onSubmitSnap?: (title: string, location: string, img: string) => void;
}

export const HomeSections: React.FC<HomeSectionsProps> = ({
  products,
  onOpenProductDetails,
  onQuickView,
  onAddToCart,
  onToggleWishlist,
  isProductWishlisted,
  setCategoryFilter,
  setCurrentPage,
  communitySnaps,
  onSubmitSnap
}) => {

  // Puzzle customizer local states
  const [piece1Url, setPiece1Url] = useState(heroSareeImg);
  const [piece2Url, setPiece2Url] = useState(homeDecorClayImg);
  const [piece3Url, setPiece3Url] = useState(handmadeJewelryImg);
  const [piece4Url, setPiece4Url] = useState(paintingProcessImg);

  // Submit Snapshot local form states
  const [isSnapFormOpen, setIsSnapFormOpen] = useState(false);
  const [snapTitle, setSnapTitle] = useState('');
  const [snapLocation, setSnapLocation] = useState('');
  const [snapImg, setSnapImg] = useState('');
  const [snapSubmitted, setSnapSubmitted] = useState(false);

  useEffect(() => {
    try {
      const dbPieces = firestore.getPuzzlePieces();
      if (dbPieces) {
        if (dbPieces.piece1Url && dbPieces.piece1Url.startsWith('http')) setPiece1Url(dbPieces.piece1Url);
        if (dbPieces.piece2Url && dbPieces.piece2Url.startsWith('http')) setPiece2Url(dbPieces.piece2Url);
        if (dbPieces.piece3Url && dbPieces.piece3Url.startsWith('http')) setPiece3Url(dbPieces.piece3Url);
        if (dbPieces.piece4Url && dbPieces.piece4Url.startsWith('http')) setPiece4Url(dbPieces.piece4Url);
      }
    } catch (e) {
      console.warn("Puzzle initialization error: ", e);
    }
  }, []);

  // ----------------------------------------------------
  // SECTION 2: Brand Philosophy (Editorial Typography Reveal)
  // ----------------------------------------------------
  const philosophyRef = useRef<HTMLDivElement>(null);
  const isPhilosophyInView = useInView(philosophyRef, { once: true, amount: 0.25 });

  const textLines = [
    "We celebrate the beauty of",
    "handmade traditions and",
    "sustainable living."
  ];

  // ----------------------------------------------------
  // SECTION 3: Brand Logo Puzzle (Scroll-driven Convergence)
  // ----------------------------------------------------
  const puzzleSectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress: puzzleProgress } = useScroll({
    target: puzzleSectionRef,
    offset: ["start end", "end start"]
  });

  // Smooth scroll inertia with an elegant spring
  const smoothProgress = useSpring(puzzleProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001
  });

  // Map progress to assembly state: scattered [0.15] at viewport bottom, fully merged [1.0] as it reaches the center
  const mergeProgress = useTransform(smoothProgress, [0.12, 0.45], [0.15, 1.0]);

  // Derived motion transforms to avoid any React re-render lags
  const piece1X = useTransform(mergeProgress, (val: number) => -(1 - val) * 60);
  const piece1Y = useTransform(mergeProgress, (val: number) => -(1 - val) * 60);
  const piece1Rotate = useTransform(mergeProgress, (val: number) => -(1 - val) * 20);

  const piece2X = useTransform(mergeProgress, (val: number) => (1 - val) * 60);
  const piece2Y = useTransform(mergeProgress, (val: number) => -(1 - val) * 60);
  const piece2Rotate = useTransform(mergeProgress, (val: number) => (1 - val) * 15);

  const piece3X = useTransform(mergeProgress, (val: number) => -(1 - val) * 60);
  const piece3Y = useTransform(mergeProgress, (val: number) => (1 - val) * 60);
  const piece3Rotate = useTransform(mergeProgress, (val: number) => -(1 - val) * 12);

  const piece4X = useTransform(mergeProgress, (val: number) => (1 - val) * 60);
  const piece4Y = useTransform(mergeProgress, (val: number) => (1 - val) * 60);
  const piece4Rotate = useTransform(mergeProgress, (val: number) => (1 - val) * 22);

  // Central calligraphic seal fades and scales as merge nears solid completion
  const centerOpacity = useTransform(mergeProgress, [0.75, 0.96], [0, 1]);
  const centerScale = useTransform(mergeProgress, [0.75, 0.96], [0.65, 1]);

  // Labels inside individual scattered states fade away nicely when almost combined
  const labelOpacity = useTransform(mergeProgress, [0.15, 0.7], [1, 0]);

  // ----------------------------------------------------
  // SECTION 4: Craftsmanship (Storytelling Timeline)
  // ----------------------------------------------------
  const timelineRef = useRef<HTMLDivElement>(null);
  const isTimelineInView = useInView(timelineRef, { once: true, amount: 0.15 });

  const stepsList = [
    {
      num: '01',
      title: 'Inspiration',
      bangla: 'অনুপ্রেরণা',
      description: 'Rooted in nature, heritage & local culture'
    },
    {
      num: '02',
      title: 'Design',
      bangla: 'নকশা',
      description: 'Thoughtful patterns sketched with meaning'
    },
    {
      num: '03',
      title: 'Handcrafting',
      bangla: 'কারুকাজ',
      description: 'Skilled local hands bring each piece layer to life'
    },
    {
      num: '04',
      title: 'Finished Creation',
      bangla: 'পূর্ণতা',
      description: 'Timeless pieces ready for mindful, elegant living'
    }
  ];

  return (
    <div className="space-y-24 sm:space-y-36 pb-16 overflow-hidden">

      {/* ==================================================== */}
      {/* SECTION 2: "02. OUR PHILOSOPHY" (Reveal typography) */}
      {/* ==================================================== */}
      <section 
        ref={philosophyRef}
        className="relative bg-brand-beige/10 border-t border-b border-brand-clay/10 py-20 sm:py-28"
      >

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Detailed Editorial Column Left (Quote with individual line reveals) */}
          <div className="lg:col-span-8 space-y-8">
            <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-brand-terracotta uppercase block">
              02 // Brand Philosophy
            </span>

            <div className="space-y-4">
              {textLines.map((line, idx) => (
                <div key={idx} className="overflow-hidden">
                  <motion.h3
                    animate={isPhilosophyInView ? { y: 0, opacity: 1 } : { y: "100%", opacity: 0 }}
                    initial={{ y: "100%", opacity: 0 }}
                    transition={{ delay: 0.15 * idx, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                    className="font-serif text-3xl sm:text-[52px] font-medium text-brand-charcoal tracking-tight leading-tight"
                  >
                    {idx === 2 ? (
                      <span>
                        and <span className="italic font-normal text-brand-olive font-serif">sustainable living.</span>
                      </span>
                    ) : line}
                  </motion.h3>
                </div>
              ))}
            </div>

            {/* Sub-quote block */}
            <motion.p
              animate={isPhilosophyInView ? { opacity: 0.8 } : { opacity: 0 }}
              transition={{ delay: 0.6, duration: 0.8 }}
              className="text-xs sm:text-sm text-brand-charcoal max-w-xl leading-relaxed text-justify"
            >
              For generations, the weavers and ceramists of Bengal have practiced a silent communion with local soil and fibers. We cultivate these slower paces, ensuring every artifact of "হাতে তৈরি" (handmade) beauty represents a curated archive of Bangladeshi identity.
            </motion.p>

            {/* Removed Learn More About Our Inception button block */}
          </div>

          {/* Right column: Fine line art vessels matching the design chart */}
          <div className="lg:col-span-4 relative flex justify-center">
            <div className="absolute inset-0 bg-brand-olive/5 filter blur-2xl opacity-40 rounded-full" />
            <motion.div
              animate={isPhilosophyInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.95 }}
              transition={{ delay: 0.4, duration: 1 }}
              className="relative border border-brand-clay/15 rounded-3xl bg-brand-bg/95 p-6 shadow-md max-w-xs group"
            >
              {/* Hand painted background detail lines */}
              <div className="absolute top-3 left-3 opacity-15">
                <LeafBranch size={60} />
              </div>
              <PotteryOrnament size={160} className="text-brand-clay animate-pulse" />
              <div className="text-center mt-4">
                <span className="font-serif text-[11px] text-brand-charcoal uppercase tracking-[0.2em] font-bold block mb-1">
                  মাটির তৃষ্ণা
                </span>
                <span className="text-[9px] font-mono text-brand-clay uppercase tracking-widest leading-none">
                  Thirst of Clay Series // Fired 1000°C
                </span>
              </div>
            </motion.div>
          </div>

        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 3: "03. BRAND WORK FLOW" (Logo Puzzle Fusion) */}
      {/* ==================================================== */}
      <section 
        ref={puzzleSectionRef}
        className="px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto border-t border-b border-brand-clay/10 py-16 sm:py-24 relative overflow-hidden"
      >
        {/* Subtle background blueprint grids */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none select-none flex items-center justify-center">
          <div className="w-[800px] h-[800px] border border-dashed border-brand-clay rounded-full" />
        </div>

        <div className="text-center max-w-xl mx-auto mb-12 sm:mb-16">
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-brand-olive uppercase block">
            03 // The Integration of Harvest
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold tracking-tight mt-1 text-brand-charcoal">
            The Flow of Brand's Work
          </h2>
          <p className="text-xs text-brand-clay tracking-[0.2em] uppercase mt-2">Harmonizing Soil, Loom & Pigment</p>
          <span className="h-[1px] w-12 bg-brand-terracotta block mx-auto mt-4" />
        </div>

        {/* Removed long Convergence description block */}

        {/* THE PUZZLE CONTAINER AND INTERACTION STAGE */}
        <div className="flex flex-col items-center justify-center space-y-8 relative z-10">
          
          {/* Main Stage: Depth Stage for 3D convergence */}
          <div 
            className="relative w-[300px] h-[300px] sm:w-[340px] sm:h-[340px] bg-brand-beige/5 rounded-full border border-dashed border-brand-clay/15 flex items-center justify-center group transition-colors duration-500 hover:border-brand-terracotta/25 shadow-inner"
            style={{ perspective: '600px' }}
          >
            {/* Background guide circular orbits */}
            <div className="absolute w-[92%] h-[92%] rounded-full border border-brand-clay/5 flex items-center justify-center pointer-events-none">
              <div className="w-[80%] h-[80%] rounded-full border border-dashed border-brand-clay/5" />
            </div>

            {/* PUZZLE PIECES CONVERGING GROUP */}
            <div className="relative w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] transform-gpu">
              
              {/* PIECE 1: Top-Left Segment (Silk Looming) */}
              <motion.div
                style={{
                  x: piece1X,
                  y: piece1Y,
                  rotate: piece1Rotate,
                }}
                className="absolute top-0 left-0 w-1/2 h-1/2 overflow-hidden border border-brand-bg/80 rounded-tl-full shadow-lg group-hover:shadow-2xl origin-bottom-right cursor-pointer"
              >
                <img 
                  src={piece1Url} 
                  alt="Silk looming"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-charcoal/15 group-hover:bg-transparent transition-colors" />
                
                {/* Embedded dynamic label that fades out as merge progresses */}
                <motion.div 
                  style={{ opacity: labelOpacity }}
                  className="absolute inset-0 flex items-center justify-center p-2 bg-brand-charcoal/40 transform -rotate-12 pointer-events-none"
                >
                  <span className="text-[10px] font-mono tracking-widest text-brand-bg uppercase font-bold">Loom</span>
                </motion.div>
              </motion.div>

              {/* PIECE 2: Top-Right Segment (River Clay Firing) */}
              <motion.div
                style={{
                  x: piece2X,
                  y: piece2Y,
                  rotate: piece2Rotate,
                }}
                className="absolute top-0 right-0 w-1/2 h-1/2 overflow-hidden border border-brand-bg/80 rounded-tr-full shadow-lg group-hover:shadow-2xl origin-bottom-left cursor-pointer"
              >
                <img 
                  src={piece2Url} 
                  alt="Clay firing"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-charcoal/15 group-hover:bg-transparent transition-colors" />

                <motion.div 
                  style={{ opacity: labelOpacity }}
                  className="absolute inset-0 flex items-center justify-center p-2 bg-brand-charcoal/40 transform rotate-12 pointer-events-none"
                >
                  <span className="text-[10px] font-mono tracking-widest text-brand-bg uppercase font-bold">Clay</span>
                </motion.div>
              </motion.div>

              {/* PIECE 3: Bottom-Left Segment (Eco-brass jewelry filigree) */}
              <motion.div
                style={{
                  x: piece3X,
                  y: piece3Y,
                  rotate: piece3Rotate,
                }}
                className="absolute bottom-0 left-0 w-1/2 h-1/2 overflow-hidden border border-brand-bg/80 rounded-bl-full shadow-lg group-hover:shadow-2xl origin-top-right cursor-pointer"
              >
                <img 
                  src={piece3Url} 
                  alt="Jewelry engraving"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-charcoal/15 group-hover:bg-transparent transition-colors" />

                <motion.div 
                  style={{ opacity: labelOpacity }}
                  className="absolute inset-0 flex items-center justify-center p-2 bg-brand-charcoal/40 transform rotate-6 pointer-events-none"
                >
                  <span className="text-[10px] font-mono tracking-widest text-brand-bg uppercase font-bold">Brass</span>
                </motion.div>
              </motion.div>

              {/* PIECE 4: Bottom-Right Segment (Fabric painting workshop) */}
              <motion.div
                style={{
                  x: piece4X,
                  y: piece4Y,
                  rotate: piece4Rotate,
                }}
                className="absolute bottom-0 right-0 w-1/2 h-1/2 overflow-hidden border border-brand-bg/80 rounded-br-full shadow-lg group-hover:shadow-2xl origin-top-left cursor-pointer"
              >
                <img 
                  src={piece4Url} 
                  alt="Handicraft process"
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 transition-all duration-700 hover:scale-105"
                />
                <div className="absolute inset-0 bg-brand-charcoal/15 group-hover:bg-transparent transition-colors" />

                <motion.div 
                  style={{ opacity: labelOpacity }}
                  className="absolute inset-0 flex items-center justify-center p-2 bg-brand-charcoal/40 transform -rotate-12 pointer-events-none"
                >
                  <span className="text-[10px] font-mono tracking-widest text-brand-bg uppercase font-bold">Brush</span>
                </motion.div>
              </motion.div>

              {/* THE SOUL OVERLAY: Calligraphic letter 'র' forming in the center */}
              <motion.div
                style={{
                  opacity: centerOpacity,
                  scale: centerScale,
                }}
                className="absolute inset-0 flex items-center justify-center pointer-events-none z-20"
              >
                {/* Central circular crest backing */}
                <div className="w-[110px] h-[110px] sm:w-[130px] sm:h-[130px] bg-brand-bg rounded-full border-2 border-brand-terracotta overflow-hidden flex items-center justify-center shadow-2xl relative select-none">
                  <img 
                    src="https://i.ibb.co.com/YFW3wDm4/20260610-013250.jpg" 
                    alt="রঙ" 
                    className="w-full h-full object-cover transform scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Subtle brand tag overlay label */}
                  <div className="absolute inset-x-0 bottom-0 bg-brand-charcoal/75 py-1 text-center">
                    <span className="text-[7px] font-mono font-bold tracking-[0.25em] text-white">
                      রঙ // BENGAL
                    </span>
                  </div>
                </div>
              </motion.div>

            </div>
          </div>

          {/* Puzzle pieces customized via Admin settings */}

          {/* Removed interactive scroll instruction helper */}

        </div>
      </section>

      {/* ==================================================== */}
      {/* SECTION 4: "04. OUR CRAFTSMANSHIP" (Storytelling Timeline) */}
      {/* ==================================================== */}
      <section 
        ref={timelineRef}
        className="relative py-12 px-4 sm:px-6 max-w-6xl mx-auto"
      >
        <div className="text-center mb-16 sm:mb-20">
          <span className="text-[10px] sm:text-xs font-mono font-bold tracking-[0.25em] text-brand-terracotta uppercase block">
            04 // Core Artisan Timeline
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-semibold text-brand-charcoal tracking-tight mt-1">
            Our Craftsmanship Process
          </h2>
          <p className="text-xs text-brand-clay tracking-[0.2em] uppercase mt-1">
            An Unhurried Journey of pure Creation
          </p>
          <span className="h-[1px] w-12 bg-brand-olive block mx-auto mt-4" />
        </div>

        {/* Steps Layout Timeline with sketching line representation */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative z-10">
          
          {/* Subtle connected line details */}
          <div className="absolute top-1/3 left-0 right-0 h-0.5 bg-dashed border-t border-brand-clay/20 hidden md:block z-0" />

          {stepsList.map((step, idx) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 30 }}
              animate={isTimelineInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
              transition={{ delay: idx * 0.15, duration: 0.8 }}
              className="bg-brand-bg border border-brand-clay/15 rounded-2xl p-6 text-center space-y-4 shadow-sm hover:shadow-md hover:border-brand-terracotta/40 transition-all duration-300 relative z-10 group"
            >
              {/* Spinning circular orbit around step indicator */}
              <div className="relative mx-auto w-12 h-12 rounded-full bg-brand-beige/35 border border-brand-clay/25 flex items-center justify-center group-hover:border-brand-terracotta transition-colors">
                <span className="font-serif text-base font-bold text-brand-terracotta">
                  {step.num}
                </span>
                <span className="absolute inset-0 border-t border-dashed border-brand-olive rounded-full animate-spin duration-1000 opacity-0 group-hover:opacity-100" />
              </div>

              <div className="space-y-1">
                <h3 className="font-serif text-lg font-bold text-brand-charcoal">
                  {step.title}
                </h3>
                <span className="font-serif text-xs text-brand-olive italic block">
                  {step.bangla}
                </span>
              </div>

              <p className="text-xs text-brand-charcoal/70 leading-relaxed max-w-[200px] mx-auto">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Removed heritage seal stamp block */}
      </section>

      {/* ==================================================== */}
      {/* SECTION 5: "05. CULTURAL INSPIRATION" (Terracotta Panel) */}
      {/* ==================================================== */}
      <section className="bg-brand-beige/5 border-t border-b border-brand-clay/10 py-16 sm:py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          <div className="lg:col-span-5 space-y-6 text-left">
            <span className="text-[10px] font-mono tracking-[0.25em] text-brand-olive font-bold uppercase block">
              05 // Ancestral Geometric Codes
            </span>
            <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-brand-charcoal tracking-tight leading-snug">
              The Code of Clay & Thread
            </h2>
            <p className="text-xs sm:text-sm text-brand-charcoal/75 leading-relaxed text-justify">
              Our motifs carry memory. The terracotta panels and old temple brick ruins of Kantajew provide the blueprint for our circular sketches. When a weaver draws a line on our silk muslin, they are translating traditional poetry into standard material luxury.
            </p>
            
            <div className="flex items-center gap-3 border-l-2 border-brand-terracotta pl-4 italic text-xs text-brand-olive font-medium font-serif">
              <span>"Every circular loop mimics the dynamic waves of Shitalakshya riverbeds."</span>
            </div>
          </div>

          {/* Detailed visual terracotta motif panel */}
          <div className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-3 gap-4">
            {[
              { title: 'Ritual Alpana', count: 'geometry-circular', tag: 'ঋ' },
              { title: 'Terracotta Seal', count: 'earthen-baked', tag: 'ঔ' },
              { title: 'Loom Warp Wood', count: 'structure-pure', tag: 'ক' },
            ].map((cell, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-brand-bg border border-brand-clay/20 rounded-2xl p-6 sm:p-8 flex flex-col items-center justify-center text-center relative overflow-hidden shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="absolute top-2 right-3 text-brand-clay/10 text-6xl font-serif select-none pointer-events-none">
                  {cell.tag}
                </div>
                {idx === 0 && <AlpanaCircular size={80} className="mb-4 text-brand-terracotta" />}
                {idx === 1 && <PotteryOrnament size={70} className="mb-4 text-brand-clay" />}
                {idx === 2 && <LeafBranch size={70} className="mb-4 text-brand-olive" />}

                <h4 className="font-serif text-sm font-bold text-brand-charcoal mt-2">
                  {cell.title}
                </h4>
                <span className="text-[9px] text-brand-clay font-mono uppercase tracking-widest mt-1">
                  {cell.count}
                </span>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
};
