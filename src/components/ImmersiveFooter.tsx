import React, { useState, useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { 
  Instagram, Facebook, Youtube, Send, Phone, Mail, MapPin, 
  ArrowRight, Globe, Sparkles, Sprout
} from 'lucide-react';
import { firestore, FooterSettings } from '../lib/mockFirebase';
import { Collection } from '../types';
import { AlpanaCircular, CornerOrnament } from './Ornaments';

interface ImmersiveFooterProps {
  setCurrentPage: (page: string) => void;
  setCategoryFilter: (category: string) => void;
  triggerToast: (msg: string) => void;
}

export const ImmersiveFooter: React.FC<ImmersiveFooterProps> = ({
  setCurrentPage,
  setCategoryFilter,
  triggerToast
}) => {
  const [settings, setSettings] = useState<FooterSettings | null>(null);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [emailInput, setEmailInput] = useState('');
  const [subscribed, setSubscribed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const footerRef = useRef<HTMLDivElement>(null);
  const isEntering = useInView(footerRef, { once: false, amount: 0.15 });

  useEffect(() => {
    // Read dynamic settings from our simulated firebaseSiteDocument "siteSettings/footer"
    setSettings(firestore.getFooterSettings());
    setCollections(firestore.getCollections());

    // Listen to potential changes published in settings Tab
    const interval = setInterval(() => {
      setSettings(firestore.getFooterSettings());
    }, 1500);
    return () => clearInterval(interval);
  }, []);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!footerRef.current) return;
    const rect = footerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5; // range -0.5 to 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5; // range -0.5 to 0.5
    setMousePos({ x, y });
  };

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim() || !emailInput.includes('@')) {
      triggerToast('Please provide a valid email coordinate.');
      return;
    }
    setSubscribed(true);
    triggerToast(`Subscribed successfully! Despatch certificate sent to ${emailInput.trim()}.`);
    setEmailInput('');
  };

  const handleNav = (href: string) => {
    if (href === 'home' || href === 'shop' || href === 'story' || href === 'about' || href === 'journal' || href === 'contact') {
      setCurrentPage(href === 'story' ? 'about' : href);
    } else {
      setCurrentPage('home');
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const activeSettings = settings;

  if (!activeSettings) {
    return (
      <div className="w-full h-40 bg-brand-charcoal text-white flex items-center justify-center font-serif">
        <span>Loading Ateliers Portal farewell...</span>
      </div>
    );
  }

  // Precomputed leaves positions for Parallax Layering
  const floatingLeaves = [
    { scale: 0.8, top: '25%', left: '15%', speedMultiplier: 45, rotate: 12 },
    { scale: 1.1, top: '45%', left: '80%', speedMultiplier: -35, rotate: 45 },
    { scale: 0.9, top: '75%', left: '22%', speedMultiplier: 50, rotate: -25 },
    { scale: 0.7, top: '65%', left: '88%', speedMultiplier: -40, rotate: 80 }
  ];

  return (
    <footer 
      ref={footerRef}
      onMouseMove={handleMouseMove}
      className="relative min-h-[95vh] bg-[#1a1715] text-[#ECE7E1] py-16 px-6 sm:px-12 lg:px-24 overflow-hidden flex flex-col justify-between z-10 select-none border-t border-brand-clay/10"
      id="heritage-closing-journal"
    >
      {/* 1. LAYER: SUBTLE REAL PAPERY TEXTURED BASE & TERRACOTTA GRAIN */}
      <div 
        className="absolute inset-[#1px] bg-cover opacity-[0.055] bg-center mix-blend-overlay pointer-events-none select-none"
        style={{ backgroundImage: `url('https://images.unsplash.com/photo-1586075010923-2dd45e9b2d4f?q=80&w=1200')` }}
      />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(184,161,137,0.06)_0%,rgba(0,0,0,0)_80%)] pointer-events-none" />

      {/* 2. LAYER: FLANGED CHROME-COATED ROTATING BACK ALPANA (Slowly orbits on scroll) */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg md:max-w-2xl aspect-square pointer-events-none opacity-[0.035] mix-blend-screen overflow-hidden">
        <div 
          className="w-full h-full animate-spin-slow"
          style={{ transition: 'transform 0.8s cubic-bezier(0.16, 1, 0.3, 1)' }}
        >
          <AlpanaCircular size={700} />
        </div>
      </div>

      {/* 3. LAYER: FLOATING PARALLAX GRAPHICS - BACKGROUND LAYER: Cultural motifs */}
      <div 
        className="absolute inset-0 pointer-events-none z-0 overflow-hidden"
        style={{
          transform: `translate3d(${mousePos.x * -18}px, ${mousePos.y * -18}px, 0px)`,
          transition: 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        <div className="absolute top-12 left-12 opacity-[0.015] w-24 h-24">
          <AlpanaCircular size={96} />
        </div>
        <div className="absolute top-1/4 right-32 opacity-[0.02] w-40 h-40">
          <AlpanaCircular size={160} />
        </div>
        <div className="absolute bottom-24 left-1/3 opacity-[0.015] w-32 h-32">
          <AlpanaCircular size={128} />
        </div>
      </div>

      {/* 4. LAYER: CENTERPIECE IMMERSIVE HERO LOGO WITH BRUSHSTROKE PARALLAX MAP */}
      <div className="relative w-full py-10 flex flex-col items-center justify-center text-center z-10 gap-1 min-h-[35vh]">
        {/* Animated Drawing Brushstroke Backdrop */}
        <motion.div 
          style={{
            transform: `translate3d(${mousePos.x * 12}px, ${mousePos.y * 12}px, 0px)`,
            transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
          }}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={isEntering ? { opacity: 0.15, scale: 1 } : { opacity: 0, scale: 0.8 }}
          transition={{ duration: 1.5, ease: 'easeOut' }}
          className="absolute w-72 h-72 md:w-96 md:h-96 rounded-full border border-dashed border-brand-terracotta flex items-center justify-center pointer-events-none"
        >
          <div className="absolute inset-4 rounded-full border border-brand-clay/30 animate-spin-slow" />
          <AlpanaCircular size={280} className="text-brand-terracotta" />
        </motion.div>

        {/* Brand Main Centred Title */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isEntering ? { opacity: 1, y: 0 } : { opacity: 0, y: 30 }}
          transition={{ duration: 0.9, delay: 0.2 }}
          className="relative z-10 flex flex-col items-center gap-1"
        >
           {/* Logo Brand Illustration */}
          {(activeSettings.logoUrl || firestore.getSettings().logoUrl) ? (
            <img 
              src={activeSettings.logoUrl || firestore.getSettings().logoUrl || undefined} 
              alt={activeSettings.brandName} 
              className="w-16 h-16 md:w-20 md:h-20 object-cover rounded-full shadow-lg border border-brand-clay/25 p-0.5 opacity-95 mb-2 bg-[#FAF7F2]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-16 h-16 md:w-20 md:h-20 rounded-full border border-brand-terracotta bg-brand-charcoal/40 flex items-center justify-center mb-2">
              <span className="font-serif font-bold text-3xl md:text-4xl text-brand-terracotta">র</span>
            </div>
          )}

          <h1 className="font-serif text-3xl md:text-4xl tracking-[0.25em] font-semibold text-white uppercase sm:text-5xl leading-none">
            {activeSettings.brandName}
          </h1>
          <span className="text-[10px] sm:text-xs font-mono font-semibold tracking-[0.4em] text-[#B8A189] uppercase mt-1">
            {activeSettings.brandTagline}
          </span>
        </motion.div>

        {/* Editorial Closing Farewell Statement */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={isEntering ? { opacity: 1 } : { opacity: 0 }}
          transition={{ duration: 1.2, delay: 0.5 }}
          className="max-w-2xl mt-6 px-4"
        >
          <p className="font-serif text-[#ECE7E1]/85 text-base sm:text-lg md:text-xl italic font-light leading-relaxed tracking-wide">
            {activeSettings.footerMessage}
          </p>
          <span className="w-12 h-[1px] bg-brand-terracotta/45 block mx-auto mt-6" />
        </motion.div>
      </div>

      {/* 5. LAYER: FLOATING LEAVES - FOREGROUND LAYER: Parallax objects moving faster */}
      <div 
        className="absolute inset-0 pointer-events-none z-10 overflow-hidden"
        style={{
          transform: `translate3d(${mousePos.x * 24}px, ${mousePos.y * 24}px, 0px)`,
          transition: 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)'
        }}
      >
        {floatingLeaves.map((leaf, index) => (
          <div
            key={index}
            className="absolute opacity-20 pointer-events-none select-none text-brand-clay/30"
            style={{
              top: leaf.top,
              left: leaf.left,
              transform: `scale(${leaf.scale}) rotate(${leaf.rotate + (mousePos.x * leaf.speedMultiplier)}deg)`,
              transition: 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)'
            }}
          >
            <Sprout className="w-6 h-6 shrink-0" />
          </div>
        ))}
      </div>

      {/* BOTTOM SECTIONS CONTAINER */}
      <div className="relative z-10 w-full mt-16 space-y-8">
        
        {/* MAIN FOOTER DIRECTORIES AND NEWSLETTER BLOCK */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 md:gap-12 pb-12 border-b border-brand-clay/15 text-xs text-[#ECE7E1]/80">
          
          {/* Section 1: Dynamic Brand Curation Box & Newsletter */}
          <div className="lg:col-span-2 space-y-6">
            <div className="space-y-3">
              <h4 className="font-serif text-[#FFFFFF] text-sm tracking-wider uppercase font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-brand-terracotta" />
                <span>{activeSettings.newsletterTitle}</span>
              </h4>
              <p className="text-xs text-[#C8C2BB] leading-relaxed max-w-sm">
                {activeSettings.newsletterDescription}
              </p>
            </div>

            <form onSubmit={handleSubscribe} className="relative max-w-sm group">
              <input 
                type="email"
                placeholder="Inscribe email coordinate..."
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full bg-[#24211F] border border-brand-clay/25 rounded-xl py-3 px-4 pr-12 text-xs focus:outline-none focus:border-brand-terracotta text-white transition-all shadow-inner placeholder:text-gray-500"
              />
              <button 
                type="submit"
                className="absolute right-1 top-1 bottom-1 px-3 bg-brand-charcoal text-brand-terracotta hover:bg-brand-terracotta hover:text-brand-bg rounded-lg flex items-center justify-center transition-all duration-300"
                title="Dispatch secure coordinate subscription"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>

            {subscribed && (
              <p className="text-[10px] text-brand-olive font-bold uppercase tracking-widest block animate-pulse">
                ✓ Collector Dispatch Logged Successfully.
              </p>
            )}
          </div>

          {/* Section 2: Heritage Navigation */}
          <div className="space-y-4">
            <h4 className="font-serif text-[#FFFFFF] text-xs font-semibold tracking-widest uppercase border-b border-brand-clay/10 pb-1.5">
              Portfolio Navigation
            </h4>
            <ul className="space-y-2.5 font-sans">
              {activeSettings.navigationLinks && activeSettings.navigationLinks.map((link, idx) => (
                <li key={idx} className="group">
                  <button
                    onClick={() => handleNav(link.href)}
                    className="hover:text-brand-terracotta transition-colors uppercase tracking-widest text-[9.5px] font-bold flex items-center gap-1"
                  >
                    <span className="w-0 group-hover:w-1.5 h-[1px] bg-brand-terracotta transition-all duration-300" />
                    <span>{link.label}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 3: Featured Collections (Loaded dynamically from DB) */}
          <div className="space-y-4">
            <h4 className="font-serif text-[#FFFFFF] text-xs font-semibold tracking-widest uppercase border-b border-brand-clay/10 pb-1.5">
              Featured Mediums
            </h4>
            <ul className="space-y-2 text-xs">
              {collections.slice(0, 4).map((col) => (
                <li key={col.id} className="group">
                  <button
                    onClick={() => {
                      setCategoryFilter(col.id === 'col_1' ? 'sarees' : col.id === 'col_2' ? 'jewelry' : col.id === 'col_3' ? 'khadi' : 'all');
                      setCurrentPage('shop');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="hover:text-white text-[#C8C2BB] transition-colors text-[10.5px] uppercase tracking-widest flex items-center gap-1.5"
                  >
                    <span className="w-1 h-1 rounded-full bg-brand-clay opacity-40 group-hover:bg-brand-terracotta group-hover:opacity-100 transition-all" />
                    <span>{col.name}</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Section 4: Contact Information */}
          <div className="space-y-4">
            <h4 className="font-serif text-[#FFFFFF] text-xs font-semibold tracking-widest uppercase border-b border-brand-clay/10 pb-1.5">
              Atelier Enquiries
            </h4>
            <ul className="space-y-3 font-mono text-[10.5px]">
              <li className="flex items-start gap-2 text-[#C8C2BB]/90">
                <MapPin className="w-3.5 h-3.5 text-brand-terracotta shrink-0 mt-0.5" />
                <span>{activeSettings.address}</span>
              </li>
              <li className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-brand-olive shrink-0" />
                <a href={`tel:${activeSettings.phone}`} className="hover:text-brand-terracotta tracking-tight transition-colors">
                  {activeSettings.phone}
                </a>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-brand-olive shrink-0" />
                <a href={`mailto:${activeSettings.email}`} className="hover:text-brand-terracotta hover:underline transition-colors leading-none truncate max-w-full">
                  {activeSettings.email}
                </a>
              </li>
            </ul>
          </div>

        </div>

        {/* Section 5: Brand Identity Social Matrix */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between py-6 gap-6 border-b border-brand-clay/10">
          <div className="flex items-center gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-terracotta animate-ping" />
            <span className="text-[9px] font-mono uppercase tracking-[0.2em] text-brand-clay font-bold">
              Live Heritage Matrix Feed
            </span>
          </div>

          <div className="flex flex-wrap gap-4 items-center">
            {activeSettings.socialLinks.instagram && (
              <a
                href={activeSettings.socialLinks.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#24211F] hover:bg-[#E2536D] text-brand-clay hover:text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md"
                title="Saree Looming Gram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            )}
            {activeSettings.socialLinks.facebook && (
              <a
                href={activeSettings.socialLinks.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#24211F] hover:bg-[#3D5B94] text-[#C8C2BB] hover:text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md"
                title="Heritage Gallery Feed"
              >
                <Facebook className="w-4 h-4" />
              </a>
            )}
            {activeSettings.socialLinks.whatsapp && (
              <a
                href={activeSettings.socialLinks.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#24211F] hover:bg-[#20BE54] text-brand-clay hover:text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md"
                title="Atelier Curator Chat"
              >
                <Globe className="w-4 h-4" />
              </a>
            )}
            {activeSettings.socialLinks.youtube && (
              <a
                href={activeSettings.socialLinks.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="w-8 h-8 rounded-full bg-[#24211F] hover:bg-[#CD201F] text-brand-clay hover:text-white flex items-center justify-center transition-all duration-300 transform hover:scale-110 shadow-md"
                title="Curation Documentaries"
              >
                <Youtube className="w-4 h-4" />
              </a>
            )}
          </div>
        </div>

        {/* Section 6: Copyright & Editorial Closing */}
        <div className="relative flex flex-col sm:flex-row items-center justify-between text-[10px] text-brand-clay/80 font-sans gap-4 pt-4">
          <div>
            <p>{activeSettings.copyrightText}</p>
          </div>

          <div className="flex gap-4 tracking-widest uppercase font-semibold">
            <button onClick={() => handleNav('story')} className="hover:text-white transition-colors">Manifesto Line</button>
            <span>•</span>
            <button onClick={() => handleNav('contact')} className="hover:text-white transition-colors">Secure Dialogs</button>
            <span>•</span>
            <span className="font-mono text-[9px] text-[#B8A189]">UTC-GEN-2026</span>
          </div>
        </div>

      </div>

    </footer>
  );
};
