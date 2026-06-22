import React from 'react';
import { ShoppingBag, Heart, Menu, X, Globe, Feather } from 'lucide-react';
import { motion } from 'motion/react';

import { UserProfile, firestore } from '../lib/mockFirebase';

interface HeaderProps {
  currentPage: string;
  setCurrentPage: (page: string) => void;
  cartCount: number;
  openCart: () => void;
  wishlistCount: number;
  openWishlist: () => void;
  currentUser: UserProfile | null;
  onAuthClick: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentPage,
  setCurrentPage,
  cartCount,
  openCart,
  wishlistCount,
  openWishlist,
  currentUser,
  onAuthClick,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);
  const settings = firestore.getSettings();

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'shop', label: 'Shop' },
    { id: 'collections', label: 'Collections' },
    { id: 'about', label: 'About' },
    { id: 'journal', label: 'Journal' },
    { id: 'contact', label: 'Contact' },
  ];

  if (currentUser && (currentUser.role === 'superAdmin' || currentUser.role === 'admin')) {
    navItems.push({ id: 'admin-dashboard', label: 'Admin Panel 🛡' });
  }

  return (
    <header className="sticky top-0 z-40 w-full transition-all duration-300 bg-brand-bg/85 backdrop-blur-md border-b border-brand-clay/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 sm:h-24">
          
          {/* Brand Logo with Elegant Bengali Script */}
          <div 
            onClick={() => setCurrentPage('home')}
            className="flex items-center gap-3 cursor-pointer group"
            id="brand-logo"
          >
            <div className="relative flex items-center justify-center w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-brand-terracotta/30 bg-brand-beige/50 group-hover:border-brand-terracotta overflow-hidden transition-colors duration-300">
              <img 
                src={settings.logoUrl || "https://i.ibb.co.com/YFW3wDm4/20260610-013250.jpg"} 
                alt="রঙ" 
                className="w-full h-full object-cover transform scale-[1.1] group-hover:scale-125 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              {/* Spinning circular orbit around letter */}
              <span className="absolute inset-0 border-t border-brand-olive rounded-full animate-[spin_6s_linear_infinite] pointer-events-none" />
            </div>
            
            <div className="flex flex-col justify-center font-sans">
              <div className="flex items-center leading-none">
                <span className="font-serif text-2xl sm:text-[26px] font-bold tracking-wide text-brand-charcoal">রঙ</span>
              </div>
              <span className="text-[9px] sm:text-[10px] tracking-[0.25em] text-brand-olive font-sans uppercase mt-1">Heritage. Handmade.</span>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`nav-link-${item.id}`}
                  onClick={() => {
                    setCurrentPage(item.id);
                    // Clear product details / collection selections if clicking direct navs
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="relative py-2 text-xs lg:text-[13px] font-sans font-medium tracking-[0.16em] uppercase text-brand-charcoal/80 hover:text-brand-charcoal transition-colors duration-300"
                >
                  {item.label}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute bottom-0 left-0 right-0 h-[1.5px] bg-brand-terracotta"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Icons (Wishlist, Cart, Mobile Menu) */}
          <div className="flex items-center gap-3 sm:gap-4">
            
            {/* User Account Dropdown */}
            {currentUser ? (
              <div className="relative group font-sans">
                <button
                  id="user-menu-btn"
                  onClick={() => {
                    setCurrentPage('profile');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-brand-beige/40 text-brand-charcoal/80 stroke-[1.5] transition-all duration-300 font-semibold"
                >
                  <img
                    src={currentUser.profileImage || 'https://i.ibb.co.com/mV2JMRFb/Pngtree-default-male-avatar-5939655.png'}
                    alt=""
                    className="w-7 h-7 rounded-full object-cover border border-brand-clay/15 shrink-0"
                  />
                  <span className="hidden md:inline text-[10.5px] uppercase tracking-wider text-brand-charcoal max-w-[80px] truncate">{currentUser.name.split(' ')[0]}</span>
                </button>
                
                {/* dropdown menu */}
                <div className="absolute right-0 mt-1 w-44 bg-brand-bg border border-brand-clay/15 rounded-xl shadow-lg opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-200 py-1.5 text-[10px] uppercase tracking-wider font-bold text-brand-charcoal z-55">
                  <button
                    onClick={() => {
                      setCurrentPage('profile');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-brand-beige/50 text-brand-charcoal select-none cursor-pointer block"
                  >
                    👤 Profile Settings
                  </button>
                  {(currentUser.role === 'superAdmin' || currentUser.role === 'admin') && (
                    <button
                      onClick={() => setCurrentPage('admin-dashboard')}
                      className="w-full text-left px-4 py-2.5 hover:bg-brand-beige/50 text-brand-olive select-none cursor-pointer block"
                    >
                      🛡 Admin Dashboard
                    </button>
                  )}
                  <button
                    onClick={() => {
                      import('../lib/mockFirebase').then(m => {
                        m.firebaseAuth.logout();
                        window.location.reload();
                      });
                    }}
                    className="w-full text-left px-4 py-2.5 hover:bg-brand-beige/50 text-brand-terracotta select-none cursor-pointer block"
                  >
                    Logout Code
                  </button>
                </div>
              </div>
            ) : (
              <button
                id="header-auth-trigger"
                onClick={onAuthClick}
                className="bg-brand-charcoal hover:bg-brand-terracotta text-brand-bg text-[10px] sm:text-[11px] font-bold tracking-widest uppercase px-3.5 py-2.5 rounded-lg transition-colors duration-300 font-sans cursor-pointer shrink-0"
              >
                Sign In
              </button>
            )}

            {/* Wishlist Button */}
            <button
              id="wishlist-btn"
              onClick={openWishlist}
              className="relative p-2.5 rounded-full hover:bg-brand-beige/40 text-brand-charcoal/80 hover:text-brand-terracotta transition-all duration-300"
              aria-label="Wishlist feed"
            >
              <Heart className="w-5 h-5 stroke-[1.5]" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-olive text-[9px] font-sans font-medium text-brand-bg w-4.5 h-4.5 rounded-full flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </button>

            {/* Shopping Cart Button */}
            <button
              id="cart-bag-btn"
              onClick={openCart}
              className="relative p-2.5 rounded-full hover:bg-brand-beige/40 text-brand-charcoal/80 hover:text-brand-terracotta transition-all duration-300"
              aria-label="Shopping cart checkout"
            >
              <ShoppingBag className="w-5 h-5 stroke-[1.5]" />
              <span className="absolute -top-0.5 -right-0.5 bg-brand-terracotta text-[9px] font-sans font-medium text-brand-bg w-4.5 h-4.5 rounded-full flex items-center justify-center">
                {cartCount}
              </span>
            </button>

            {/* Mobile Menu Icon */}
            <button
              id="mobile-menu-toggle"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2.5 rounded-full hover:bg-brand-beige/40 text-brand-charcoal/80 hover:text-brand-charcoal transition-all duration-300"
              aria-label="Toggle Menu"
            >
              {mobileMenuOpen ? <X className="w-5.5 h-5.5" /> : <Menu className="w-5.5 h-5.5" />}
            </button>

          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden bg-brand-bg border-t border-brand-clay/10 overflow-hidden"
        >
          <div className="px-4 pt-4 pb-8 space-y-3">
            {navItems.map((item) => {
              const isActive = currentPage === item.id;
              return (
                <button
                  key={item.id}
                  id={`mobile-nav-${item.id}`}
                  onClick={() => {
                    setCurrentPage(item.id);
                    setMobileMenuOpen(false);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className={`block w-full text-left px-4 py-3 rounded-md text-sm font-sans font-semibold tracking-widest uppercase transition-colors duration-300 ${
                    isActive 
                      ? 'bg-brand-beige/60 text-brand-terracotta font-bold' 
                      : 'text-brand-charcoal/70 hover:text-brand-charcoal hover:bg-brand-beige/30'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
          </div>
        </motion.div>
      )}
    </header>
  );
};
