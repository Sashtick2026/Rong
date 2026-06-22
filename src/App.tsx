import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Heart, ArrowRight, Grid, Filter, SlidersHorizontal, ChevronRight, 
  ChevronLeft, Sparkles, Star, Calendar, RefreshCw, Send, CheckCircle2, BookmarkCheck, Share2, Feather, Clock
} from 'lucide-react';

// Import our custom data and subcomponents
import { testimonials } from './data';
import { Product, Collection, CartItem, Testimonial, CommunitySnap } from './types';
import { Header } from './components/Header';
import { ProductCard } from './components/ProductCard';
import { CartDrawer } from './components/CartDrawer';
import { QuickViewModal } from './components/QuickViewModal';
import { AboutView, JournalView, ContactView } from './components/Pages';
import { 
  AlpanaCircular, LeafBranch, PotteryOrnament, HandDrawnArrow, CornerOrnament, OrganicDivider 
} from './components/Ornaments';
import { HeroInteractive } from './components/HeroInteractive';
import { HomeSections } from './components/HomeSections';
import { AmbientFloatingAtmosphere } from './components/AmbientFloatingAtmosphere';
import { AnimatedHeart } from './components/AnimatedHeart';

import { onAuthStateChanged } from 'firebase/auth';
import { doc, onSnapshot } from 'firebase/firestore';

// Auths & Admin Dashboard Imports
import { firebaseAuth, firestore, UserProfile, auth, db } from './lib/mockFirebase';
import { LoginPage, RegisterPage, ForgotPasswordPage } from './components/AuthPages';
import { AdminDashboard } from './components/AdminDashboard';
import { UserProfilePanel } from './components/UserProfilePanel';
import { ImmersiveFooter } from './components/ImmersiveFooter';

export default function App() {
  // Page Navigation States
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Custom Toast State
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };
  
  // Shopping Cart & Wishlist States
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Product[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState<boolean>(false);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);
  
  // Payment Pending Popup States
  const [showPendingPopup, setShowPendingPopup] = useState<boolean>(false);
  const [pendingOrderId, setPendingOrderId] = useState<string>('');
  
  // Shop Filters
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [priceFilter, setPriceFilter] = useState<number>(500);
  const [sortBy, setSortBy] = useState<string>('default');
  const [selectedCollectionFilter, setSelectedCollectionFilter] = useState<string>('all');

  // Contact / Newsletter inputs
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState<boolean>(false);

  // Review submission inputs
  const [isReviewFormOpen, setIsReviewFormOpen] = useState<boolean>(false);
  const [reviewName, setReviewName] = useState<string>('');
  const [reviewQuote, setReviewQuote] = useState<string>('');
  const [reviewLocation, setReviewLocation] = useState<string>('');
  const [reviewSubmitted, setReviewSubmitted] = useState<boolean>(false);

  // Details Page state helper inside Detail View
  const [selectedDetailPhoto, setSelectedDetailPhoto] = useState<string>('');

  // ----------------------------------------------------
  // Dynamic Datastores & Stateful Accounts
  // ----------------------------------------------------
  const [storeProducts, setStoreProducts] = useState<Product[]>([]);
  const [storeCollections, setStoreCollections] = useState<Collection[]>([]);
  const [storeReviews, setStoreReviews] = useState<Testimonial[]>([]);
  const [storeSnaps, setStoreSnaps] = useState<CommunitySnap[]>([]);
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState<boolean>(false);
  const [authMode, setAuthMode] = useState<'login' | 'register' | 'forgot'>('login');

  useEffect(() => {
    let unsubscribeDoc: (() => void) | null = null;

    // Sync current user coordinates in real-time across devices
    const unsubscribeAuth = onAuthStateChanged(auth, (firebaseUser) => {
      // Clean up previous document listener if exists
      if (unsubscribeDoc) {
        unsubscribeDoc();
        unsubscribeDoc = null;
      }

      if (firebaseUser) {
        // Close auth overlay immediately upon detecting authenticated state
        setIsAuthModalOpen(false);

        // 1. Immediately apply cached credentials if available for instant UI rendering
        const cached = localStorage.getItem('rongo_real_auth_cache');
        if (cached) {
          try {
            const parsed = JSON.parse(cached);
            if (parsed && parsed.uid === firebaseUser.uid) {
              setCurrentUser(parsed);
            }
          } catch (e) {}
        }

        // 2. Attach a real-time snapshot listener on the user's specific Firestore document
        unsubscribeDoc = onSnapshot(doc(db, 'users', firebaseUser.uid), (docSnap) => {
          if (docSnap.exists()) {
            const freshProfile = docSnap.data() as UserProfile;
            setCurrentUser(freshProfile);
            localStorage.setItem('rongo_real_auth_cache', JSON.stringify(freshProfile));
          } else {
            // Construct fallback profile if the Firestore document doesn't exist yet
            const activeProfile = firebaseAuth.getCurrentUser();
            if (activeProfile) {
              setCurrentUser(activeProfile);
            }
          }
        }, (err) => {
          console.warn('Real-time profile sync skip (retained cached/auth profile):', err);
          const activeProfile = firebaseAuth.getCurrentUser();
          if (activeProfile) {
            setCurrentUser(activeProfile);
          }
        });
      } else {
        setCurrentUser(null);
      }
    });

    return () => {
      unsubscribeAuth();
      if (unsubscribeDoc) {
        unsubscribeDoc();
      }
    };
  }, []);

  useEffect(() => {
    // Secure route guide: block unauthorized customers from accessing the administrator dashboard
    if (currentPage === 'admin-dashboard') {
      const isAuthorized = currentUser && (currentUser.role === 'superAdmin' || currentUser.role === 'admin');
      if (!isAuthorized) {
        triggerToast('Access Denied: You do not have permission to view the admin dashboard.');
        setCurrentPage('home');
        return;
      }
    }
    // Sync boutique counters whenever pages drift to inherit fresh edits
    setStoreProducts(firestore.getProducts());
    setStoreCollections(firestore.getCollections());
  }, [currentPage, currentUser]);

  // Dynamic SEO Page Title Orchestrator
  useEffect(() => {
    if (selectedProduct) {
      document.title = `${selectedProduct.name} (${selectedProduct.banglaName || ''}) — Curated Craft | রঙ (Rongo) Heritage`;
      return;
    }

    switch (currentPage) {
      case 'home':
        document.title = 'রঙ (Rongo) Heritage — Limited Handmade Bengal Lifestyle & Accessories Curation';
        break;
      case 'shop':
        document.title = 'Curated Craft Collection & Handlooms | রঙ (Rongo) Heritage';
        break;
      case 'collections':
        document.title = 'Signature Series & Heritable Lineages | রঙ (Rongo) Heritage';
        break;
      case 'about':
        document.title = 'Our Slow Craft Manifesto & Atelier Philosophy | রঙ (Rongo) Heritage';
        break;
      case 'journal':
        document.title = 'Bengal Archives & Handloom Rhythm Chronicles | রঙ (Rongo) Heritage';
        break;
      case 'contact':
        document.title = 'Atelier Appointments & Inquiries | রঙ (Rongo) Heritage';
        break;
      case 'profile':
        document.title = 'Collector Profile Control | রঙ (Rongo) Heritage';
        break;
      case 'admin-dashboard':
        document.title = 'Keeper Curation Console | রঙ (Rongo) Heritage';
        break;
      default:
        document.title = 'রঙ (Rongo) Heritage';
    }
  }, [currentPage, selectedProduct]);

  // Real-time Catalog Synchronizer
  useEffect(() => {
    // Setup reactive snapshots to immediately map store edits across all active tabs
    const unsubscribeProducts = firestore.onProductsSnapshot ? firestore.onProductsSnapshot((products) => {
      setStoreProducts(products);
    }) : () => {};

    const unsubscribeCollections = firestore.onCollectionsSnapshot ? firestore.onCollectionsSnapshot((collections) => {
      setStoreCollections(collections);
    }) : () => {};

    const unsubscribeReviews = firestore.onReviewsSnapshot ? firestore.onReviewsSnapshot((reviews) => {
      setStoreReviews(reviews);
    }) : () => {};

    const unsubscribeSnaps = firestore.onCommunitySnapsSnapshot ? firestore.onCommunitySnapsSnapshot((snaps) => {
      setStoreSnaps(snaps);
    }) : () => {};

    return () => {
      unsubscribeProducts();
      unsubscribeCollections();
      unsubscribeReviews();
      unsubscribeSnaps();
    };
  }, []);

  // ----------------------------------------------------
  // Handler Functions
  // ----------------------------------------------------
  
  const handleAddToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const existing = prevCart.find(item => item.product.id === product.id);
      if (existing) {
        return prevCart.map(item => 
          item.product.id === product.id 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prevCart, { product, quantity }];
    });
    // Open cart automatically to show tactile progress
    setIsCartOpen(true);
  };

  const handleUpdateCartQuantity = (productId: string, delta: number) => {
    setCart(prevCart => 
      prevCart.map(item => {
        if (item.product.id === productId) {
          const newQty = item.quantity + delta;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter(item => item.quantity > 0)
    );
  };

  const handleRemoveCartItem = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.product.id !== productId));
  };

  const handleClearCart = () => {
    setCart([]);
  };

  const handleToggleWishlist = (product: Product) => {
    setWishlist(prevWish => {
      const exists = prevWish.some(item => item.id === product.id);
      if (exists) {
        return prevWish.filter(item => item.id !== product.id);
      }
      return [...prevWish, product];
    });
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setNewsletterSubmitted(true);
    setTimeout(() => {
      setNewsletterEmail('');
    }, 2000);
  };

  // Navigates directly to full details page
  const handleOpenProductDetails = (product: Product) => {
    setSelectedProduct(product);
    setSelectedDetailPhoto(product.image);
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Safe checks
  const isProductWishlisted = (product: Product) => {
    return wishlist.some(item => item.id === product.id);
  };

  // Filtered Shop items
  const filteredProducts = storeProducts.filter(p => {
    const matchesCategory = categoryFilter === 'all' || p.category === categoryFilter;
    const matchesCollection = selectedCollectionFilter === 'all' || p.collectionId === selectedCollectionFilter;
    const matchesPrice = p.price <= priceFilter;
    return matchesCategory && matchesCollection && matchesPrice;
  }).sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'best-seller') return (b.bestSeller ? 1 : 0) - (a.bestSeller ? 1 : 0);
    return 0; // default
  });

  // ----------------------------------------------------
  // Guard access and intercept admin routes completely
  // ----------------------------------------------------
  if (currentPage === 'admin-dashboard' && currentUser && (currentUser.role === 'superAdmin' || currentUser.role === 'admin')) {
    return (
      <AdminDashboard
        currentUser={currentUser}
        onLogout={() => {
          firebaseAuth.logout();
          setCurrentUser(null);
          setCurrentPage('home');
        }}
        onReturnToSite={() => {
          setCurrentPage('home');
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg handmade-grain relative overflow-x-hidden">
      
      {/* AMBIENT FLOATING ATMOSPHERE & LIGHT TRACKER */}
      <AmbientFloatingAtmosphere />
      
      {/* IMMERSIVE WATERMARK WATERFALL SPINNING ALPANA */}
      <div className="fixed -bottom-24 -left-24 pointer-events-none select-none opacity-[0.05] hover:opacity-[0.08] transition-opacity duration-700 z-0 select-none">
        <div className="animate-alpana-orbit-left">
          <AlpanaCircular size={360} />
        </div>
      </div>
      <div className="fixed -top-32 -right-32 pointer-events-none select-none opacity-[0.05] hover:opacity-[0.08] transition-opacity duration-700 z-0 select-none">
        <div className="animate-alpana-orbit-right">
          <AlpanaCircular size={500} />
        </div>
      </div>

      {/* GLOBAL HEADER */}
      <Header 
        currentPage={currentPage}
        setCurrentPage={(page) => {
          setCurrentPage(page);
          setSelectedProduct(null); // Clear active item view when clicking around
        }}
        cartCount={cart.reduce((sum, i) => sum + i.quantity, 0)}
        openCart={() => setIsCartOpen(true)}
        wishlistCount={wishlist.length}
        openWishlist={() => setIsWishlistOpen(true)}
        currentUser={currentUser}
        onAuthClick={() => {
          setAuthMode('login');
          setIsAuthModalOpen(true);
        }}
      />

      {/* CORE PAGES PORT ROUTER */}
      <main className="relative min-h-[70vh]">
        
        {/* VIEW: Product Deep Detail Page (Overriding current viewed page index for focus) */}
        {selectedProduct ? (
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-20"
            id="product-detail-view"
          >
            {/* Breadcrumb row */}
            <div className="flex items-center gap-2 text-xs text-brand-clay mb-8">
              <button onClick={() => setSelectedProduct(null)} className="hover:text-brand-charcoal transition-colors font-medium">Rongo Curation</button>
              <ChevronRight className="w-3 h-3" />
              <button 
                onClick={() => {
                  setCategoryFilter(selectedProduct.category);
                  setCurrentPage('shop');
                  setSelectedProduct(null);
                }} 
                className="hover:text-brand-charcoal transition-colors font-medium uppercase tracking-wider text-[10px]"
              >
                {selectedProduct.category}
              </button>
              <ChevronRight className="w-3 h-3" />
              <span className="text-brand-charcoal font-semibold line-clamp-1">{selectedProduct.name}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              
              {/* Product Gallery (Left) */}
              <div className="lg:col-span-7 space-y-4">
                <div className="relative aspect-[3/4] bg-brand-beige/30 rounded-2xl overflow-hidden border border-brand-clay/15">
                  <img
                    src={selectedDetailPhoto || null}
                    alt={selectedProduct?.name}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover transition-all duration-700"
                  />
                  
                  {/* Floating traditional clay tags */}
                  <div className="absolute bottom-4 left-4 bg-brand-bg/95 backdrop-blur-sm border border-brand-clay/30 px-3.5 py-2 rounded-lg text-[10px] tracking-widest font-semibold uppercase text-brand-charcoal shadow-sm flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-brand-terracotta" />
                    <span>Pure Organic Craft</span>
                  </div>
                </div>

                {/* Alternate view previews */}
                {selectedProduct.images && selectedProduct.images.length > 1 && (
                  <div className="flex gap-4">
                    {selectedProduct.images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedDetailPhoto(img)}
                        className={`w-20 h-24 rounded-lg overflow-hidden border transition-all duration-300 ${
                          selectedDetailPhoto === img ? 'border-brand-terracotta ring-1 ring-brand-terracotta' : 'border-brand-clay/25 opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img || null} alt="" referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Product Information & Story (Right) */}
              <div className="lg:col-span-5 space-y-6">
                
                <div>
                  <span className="text-[10px] font-bold tracking-widest uppercase text-brand-olive">{selectedProduct.category} journal series</span>
                  <h1 className="font-serif text-3xl sm:text-4xl font-semibold text-brand-charcoal tracking-tight mt-1">
                    {selectedProduct.name}
                  </h1>
                  <p className="font-serif text-lg italic text-brand-terracotta mt-1">
                    {selectedProduct.banglaName}
                  </p>
                </div>

                <div className="font-serif text-xl font-bold text-brand-charcoal border-b border-brand-clay/15 pb-4">
                  ৳{selectedProduct.price} BDT
                </div>

                {/* Primary Story / Background */}
                <div className="space-y-4">
                  <h3 className="text-xs uppercase tracking-widest font-semibold text-brand-charcoal">Curation Narrative:</h3>
                  <p className="text-xs sm:text-sm text-brand-charcoal/85 leading-relaxed text-justify-custom font-sans">
                    {selectedProduct.description}
                  </p>
                  <p className="text-xs sm:text-sm text-brand-clay italic leading-relaxed text-justify-custom font-serif">
                    {selectedProduct.story}
                  </p>
                </div>

                {/* Materials & Technical Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t border-b border-brand-clay/15 py-6">
                  <div>
                    <span className="block text-[10px] font-semibold tracking-wider text-brand-olive uppercase mb-2">Natural Composition</span>
                    <ul className="space-y-1.5 text-xs text-brand-charcoal/80">
                      {selectedProduct.materials.map((mat, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-clay" />
                          <span>{mat}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <span className="block text-[10px] font-semibold tracking-wider text-brand-olive uppercase mb-2">Care Instructions</span>
                    <ul className="space-y-1.5 text-xs text-brand-charcoal/80">
                      {selectedProduct.care.map((c, i) => (
                        <li key={i} className="flex items-center gap-1.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-brand-terracotta/60" />
                          <span>{c}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Packing and shipping notes */}
                <div className="text-xs text-brand-charcoal/70 bg-brand-beige/30 p-4 rounded-xl border border-brand-clay/15">
                  <span className="font-bold block text-brand-charcoal mb-0.5">Heritage Shipping:</span>
                  {selectedProduct.shipping}
                </div>

                {/* Action button rows */}
                <div className="flex gap-4 pt-4">
                  <button
                    id="add-to-bag-detail"
                    disabled={selectedProduct.stock === 0}
                    onClick={() => {
                      if (selectedProduct.stock === 0) return;
                      handleAddToCart(selectedProduct, 1);
                    }}
                    className={`flex-1 flex items-center justify-center gap-2 py-4 rounded-xl text-xs font-semibold tracking-widest uppercase transition-all duration-300 ${
                      selectedProduct.stock === 0 
                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed border border-gray-200' 
                        : 'bg-brand-terracotta hover:bg-brand-charcoal text-brand-bg shadow-md shadow-brand-terracotta/10'
                    }`}
                  >
                    <ShoppingBag className="w-4 h-4" />
                    {selectedProduct.stock === 0 ? 'Stock Out' : 'Place Curation in Bag'}
                  </button>

                  <button
                    id="wishlist-toggle-detail"
                    onClick={() => handleToggleWishlist(selectedProduct)}
                    className={`p-4 border rounded-xl hover:scale-105 transition-all duration-300 ${
                      isProductWishlisted(selectedProduct) 
                        ? 'text-brand-terracotta border-brand-terracotta bg-brand-beige/25' 
                        : 'border-brand-clay/30 text-brand-charcoal/70 hover:text-brand-terracotta'
                    }`}
                  >
                    <AnimatedHeart isWishlisted={isProductWishlisted(selectedProduct)} className="w-4 h-4" />
                  </button>
                </div>

                {/* Return button */}
                <button
                  id="back-to-curations-btn"
                  onClick={() => setSelectedProduct(null)}
                  className="w-full text-center py-2 text-[10px] uppercase tracking-widest font-semibold text-brand-clay hover:text-brand-charcoal transition-colors mt-4 block"
                >
                  ← Return to all curations
                </button>

              </div>
            </div>

            {/* SECTION: Related Products */}
            <div className="mt-20 border-t border-brand-clay/15 pt-16">
              <h3 className="font-serif text-2xl font-medium text-brand-charcoal mb-8 text-center sm:text-left">Complementary Curations</h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8">
                {storeProducts
                  .filter(p => p.id !== selectedProduct.id && p.category === selectedProduct.category)
                  .slice(0, 4)
                  .map(prod => (
                    <ProductCard
                      key={prod.id}
                      product={prod}
                      onViewDetails={handleOpenProductDetails}
                      onQuickView={(p) => setQuickViewProduct(p)}
                      onAddToCart={(p) => handleAddToCart(p)}
                      onToggleWishlist={handleToggleWishlist}
                      isWishlisted={isProductWishlisted(prod)}
                    />
                  ))}
              </div>
            </div>

          </motion.div>
        ) : (
          /* REGULAR PAGE VIEWS */
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: HOME */}
            {currentPage === 'home' && (
              <motion.div 
                key="home-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
              >
                {/* Premium Cinematic Hero Section with 3D Depth System and Mouse Interactiveness */}
                <HeroInteractive 
                  products={storeProducts}
                  onOpenProductDetails={handleOpenProductDetails}
                  onExploreShop={() => {
                    setCategoryFilter('all');
                    setCurrentPage('shop');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                  onExploreStory={() => {
                    setCurrentPage('about');
                    window.scrollTo({ top: 0, behavior: 'instant' });
                  }}
                />

                {/* Modular Premium Subsections: 01. Categories, 02. Philosophy, 03. Exhibition Grid, 04. Crafts, 05. Codes, 06. Community */}
                <HomeSections 
                  products={storeProducts}
                  onOpenProductDetails={handleOpenProductDetails}
                  onQuickView={(p) => setQuickViewProduct(p)}
                  onAddToCart={(p) => handleAddToCart(p, 1)}
                  onToggleWishlist={handleToggleWishlist}
                  isProductWishlisted={isProductWishlisted}
                  setCategoryFilter={setCategoryFilter}
                  setCurrentPage={setCurrentPage}
                  communitySnaps={storeSnaps}
                  onSubmitSnap={async (title, location, img) => {
                    if (firestore.saveCommunitySnap) {
                      await firestore.saveCommunitySnap({ id: '', title, location, img, approved: false });
                    }
                  }}
                />

                {/* Complementary Keepsakes & Testimonials Block */}
                <section className="py-16 sm:py-24 bg-brand-beige/25 border-t border-b border-brand-clay/10">
                  <div className="max-w-5xl mx-auto px-4">
                    <div className="text-center mb-10 sm:mb-14">
                      <span className="text-[11px] font-sans font-bold tracking-widest text-brand-terracotta uppercase">Patron Reviews</span>
                      <h2 className="font-serif text-3xl font-medium text-brand-charcoal tracking-tight mt-1">Client Testimonials</h2>
                      <p className="text-[11px] text-brand-clay font-sans mt-1.5 mb-5">
                        Heartfelt narratives and reviews shared by our actual customers and collectors.
                      </p>
                      <button
                        onClick={() => setIsReviewFormOpen(!isReviewFormOpen)}
                        className="inline-flex items-center gap-2 text-[10px] sm:text-xs font-bold tracking-widest text-brand-olive hover:text-brand-charcoal uppercase border border-[#B49275]/30 hover:border-brand-charcoal hover:bg-brand-bg/60 px-4 py-2 rounded-lg transition-all duration-300 pointer-events-auto"
                      >
                        {isReviewFormOpen ? 'Close Form' : 'Write a Review'}
                      </button>
                    </div>

                    {/* Review Panel Form */}
                    <AnimatePresence>
                      {isReviewFormOpen && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mb-12 overflow-hidden max-w-md mx-auto bg-brand-bg border border-brand-clay/15 rounded-2xl p-6 sm:p-8 shadow-sm"
                        >
                          <h3 className="font-serif text-sm font-bold text-brand-charcoal mb-4 text-center tracking-tight text-brand-olive uppercase">Write Your Review</h3>
                          {reviewSubmitted ? (
                            <div className="text-center py-6">
                              <span className="text-[#5B6349] font-serif font-bold text-sm block">Review Submitted!</span>
                              <p className="text-xs text-brand-clay mt-2 leading-relaxed">
                                Thank you for supporting traditional heritage! Your voice has been saved and will appear in our carousel once validated by our coordinators.
                              </p>
                              <button
                                onClick={() => { setReviewSubmitted(false); setReviewName(''); setReviewQuote(''); setReviewLocation(''); }}
                                className="mt-4 text-[10px] uppercase tracking-widest font-bold text-brand-olive hover:underline"
                              >
                                Write Another Review
                              </button>
                            </div>
                          ) : (
                            <form 
                              onSubmit={async (e) => {
                                e.preventDefault();
                                if (!reviewName || !reviewQuote) return;
                                if (firestore.saveReview) {
                                  await firestore.saveReview({
                                    id: 'rev_' + Date.now(),
                                    name: reviewName,
                                    role: 'Global Patron',
                                    quote: reviewQuote,
                                    location: reviewLocation || 'Atelier Patrons',
                                    approved: false
                                  });
                                }
                                setReviewSubmitted(true);
                              }}
                              className="space-y-4 text-xs"
                            >
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-olive mb-1">
                                  Your Name *
                                </label>
                                <input
                                  type="text"
                                  required
                                  value={reviewName}
                                  onChange={(e) => setReviewName(e.target.value)}
                                  placeholder="e.g., Anika Rahman"
                                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-brand-clay/20 rounded-lg text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:outline-none text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-olive mb-1">
                                  Your Coordinates / Location
                                </label>
                                <input
                                  type="text"
                                  value={reviewLocation}
                                  onChange={(e) => setReviewLocation(e.target.value)}
                                  placeholder="e.g., Sylhet, Bangladesh"
                                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-brand-clay/20 rounded-lg text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:outline-none text-xs"
                                />
                              </div>
                              <div>
                                <label className="block text-[10px] font-bold uppercase tracking-wider text-brand-olive mb-1">
                                  Your Review Letter *
                                </label>
                                <textarea
                                  required
                                  rows={3}
                                  value={reviewQuote}
                                  onChange={(e) => setReviewQuote(e.target.value)}
                                  placeholder="e.g., The handwoven Jamdani is a work of pure art. Excellent touch and beautiful storytelling craftsmanship."
                                  className="w-full px-3 py-2 bg-[#FAF7F2] border border-brand-clay/20 rounded-lg text-brand-charcoal focus:ring-1 focus:ring-brand-terracotta focus:outline-none text-xs leading-relaxed"
                                />
                              </div>
                              <button
                                type="submit"
                                className="w-full py-2 bg-[#2D2A26] hover:bg-[#403B37] text-white font-semibold tracking-wider hover:shadow-xs transition-all duration-300 rounded-lg uppercase text-[10px]"
                              >
                                Transmit Review
                              </button>
                            </form>
                          )}
                        </motion.div>
                      )}
                    </AnimatePresence>

                    {(() => {
                      const realApprovedReviews = storeReviews.filter(
                        r => r && r.approved !== false && r.id !== '1' && r.id !== '2' && r.id !== '3'
                      );
                      if (realApprovedReviews.length > 0) {
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            {realApprovedReviews.map((test) => (
                              <div 
                                key={test.id} 
                                className="bg-brand-bg border border-brand-clay/15 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-sm relative overflow-hidden"
                              >
                                {/* Corner deco */}
                                <CornerOrnament position="top-left" />
                                <span className="text-4xl font-serif text-brand-terracotta/25 absolute top-4 right-4 font-bold">“</span>
                                
                                <p className="text-xs sm:text-sm text-[#2D2A26]/80 italic leading-relaxed text-justify mb-6 font-serif relative">
                                  {test.quote}
                                </p>

                                <div>
                                  <span className="h-[1px] w-8 bg-brand-clay block mb-3" />
                                  <h4 className="font-serif text-sm font-bold text-brand-charcoal">{test.name}</h4>
                                  <p className="text-[10px] text-brand-olive uppercase tracking-[0.16em] font-medium mt-0.5">
                                    {test.role} — <span className="text-brand-clay font-sans">{test.location}</span>
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        );
                      } else {
                        return (
                          <div className="text-center py-10 bg-brand-bg/50 border border-brand-clay/10 rounded-2xl p-6 sm:p-8 max-w-md mx-auto shadow-xs">
                            <span className="text-brand-clay text-xs block font-serif italic">
                              "No customer testimonials registered yet. When we are live, authentic feedback will be cataloged here."
                            </span>
                          </div>
                        );
                      }
                    })()}
                  </div>
                </section>

                {/* The Heritage Circular Newsletter Sign up */}
                <section className="py-16 sm:py-24 bg-brand-beige/35 border-b border-brand-clay/15 relative overflow-hidden">
                  <div className="absolute top-10 left-10 opacity-5">
                    <AlpanaCircular size={230} />
                  </div>
                  <div className="absolute bottom-10 right-10 opacity-5">
                    <PotteryOrnament size={180} />
                  </div>

                  <div className="max-w-2xl mx-auto px-4 text-center z-10 relative">
                    <span className="text-[10px] tracking-[0.2em] uppercase text-brand-olive font-bold">The Heritage Circular</span>
                    <h2 className="font-serif text-3xl sm:text-4xl font-semibold text-brand-charcoal tracking-tight mt-2 mb-4">
                      Join the Curation Society
                    </h2>
                    <p className="text-xs sm:text-sm text-brand-charcoal/70 leading-relaxed max-w-md mx-auto mb-8 font-sans">
                      Receive notifications of our season launches, limited pottery firing schedules, and exclusive digital journal catalogs.
                    </p>

                    {newsletterSubmitted ? (
                      <div className="bg-brand-bg/95 border border-brand-olive/40 p-5 rounded-2xl flex flex-col items-center justify-center gap-2 max-w-md mx-auto shadow-sm">
                        <CheckCircle2 className="w-8 h-8 text-brand-olive" />
                        <h4 className="font-serif text-base font-semibold text-brand-charcoal">Curation Spot Secured</h4>
                        <p className="text-[11px] text-brand-charcoal/70">A traditional greeting note has been sent. Check your coordinates.</p>
                      </div>
                    ) : (
                      <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" id="newsletter-form">
                        <input
                          type="email"
                          required
                          value={newsletterEmail}
                          onChange={(e) => setNewsletterEmail(e.target.value)}
                          placeholder="Your email address (coordinates)"
                          className="flex-1 bg-brand-bg border border-brand-clay/40 rounded-xl px-4 py-3 text-xs sm:text-sm focus:outline-none focus:border-brand-terracotta placeholder-brand-clay"
                        />
                        <button
                          type="submit"
                          className="bg-brand-charcoal hover:bg-brand-olive text-brand-bg px-6 py-3 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors flex items-center justify-center gap-1.5"
                          id="newsletter-submit-btn"
                        >
                          <span>Secure Spot</span>
                          <Send className="w-3.5 h-3.5 text-brand-bg" />
                        </button>
                      </form>
                    )}
                  </div>
                </section>

              </motion.div>
            )}

            {/* VIEW 2: SHOP PAGE (Gallery Style) */}
            {currentPage === 'shop' && (
              <motion.div 
                key="shop-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16"
              >
                {/* Shop Editorial Header */}
                <div className="text-center max-w-xl mx-auto mb-10 sm:mb-16">
                  <span className="text-[10px] font-sans font-bold tracking-widest text-brand-olive uppercase">Active Studio Collections</span>
                  <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-brand-charcoal tracking-tight mt-1 mb-2">
                    Heritage Curations
                  </h1>
                  <span className="text-xs text-brand-clay uppercase tracking-widest">Explore limited physical assets</span>
                  <OrganicDivider />
                </div>

                {/* Filters Row */}
                <div className="bg-brand-beige/25 border border-brand-clay/15 rounded-3xl p-5 sm:p-6 mb-12 flex flex-col gap-6 font-sans">
                  
                  <div className="flex flex-wrap items-center justify-between gap-4">
                    
                    {/* Category Tabs */}
                    <div className="flex flex-wrap gap-2">
                      {[
                        { id: 'all', label: 'All Curation' },
                        { id: 'sarees', label: 'Sarees' },
                        { id: 'jewelry', label: 'Jewelry' },
                        { id: 'bangles', label: 'Bangles' },
                        { id: 'homeDecor', label: 'Home Décor' },
                      ].map((cat) => (
                        <button
                          key={cat.id}
                          id={`filter-cat-${cat.id}`}
                          onClick={() => setCategoryFilter(cat.id)}
                          className={`px-4 py-2 rounded-lg text-[10px] sm:text-xs font-semibold tracking-wider uppercase transition-all duration-300 ${
                            categoryFilter === cat.id 
                              ? 'bg-brand-charcoal text-brand-bg' 
                              : 'bg-brand-bg hover:bg-brand-beige/40 text-brand-charcoal border border-brand-clay/20'
                          }`}
                        >
                          {cat.label}
                        </button>
                      ))}
                    </div>

                    {/* Sorter Selector */}
                    <div className="flex items-center gap-2">
                      <SlidersHorizontal className="w-4 h-4 text-brand-olive stroke-[1.5]" />
                      <select
                        id="sort-selector"
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="bg-brand-bg border border-brand-clay/30 rounded-lg py-1.5 px-3 text-xs text-brand-charcoal focus:outline-none focus:border-brand-terracotta"
                      >
                        <option value="default">Default Sort Index</option>
                        <option value="price-low">Price: Low to High</option>
                        <option value="price-high">Price: High to Low</option>
                        <option value="best-seller">Sort by Best Seller</option>
                      </select>
                    </div>

                  </div>

                  {/* Range Slider for Price Limit */}
                  <div className="border-t border-brand-clay/10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex flex-col gap-1 w-full sm:max-w-xs">
                      <label className="text-[10px] uppercase font-semibold tracking-wider text-brand-olive">Price Ceiling limit:</label>
                      <input
                        type="range"
                        min="50"
                        max="500"
                        step="10"
                        value={priceFilter}
                        onChange={(e) => setPriceFilter(parseInt(e.target.value))}
                        className="w-full accent-brand-terracotta cursor-pointer"
                      />
                      <span className="text-xs text-brand-charcoal font-semibold">Under ৳{priceFilter} BDT</span>
                    </div>

                    {/* Collection Specific Filters */}
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-semibold text-brand-olive uppercase tracking-wider">Concept Series:</span>
                      <select
                        id="collection-selector"
                        value={selectedCollectionFilter}
                        onChange={(e) => setSelectedCollectionFilter(e.target.value)}
                        className="bg-brand-bg border border-brand-clay/30 rounded-lg py-1.5 px-3 text-xs text-brand-charcoal focus:outline-none focus:border-brand-terracotta"
                      >
                        <option value="all">All Concept Collections</option>
                        <option value="matir-trishna">Matir Trishna (Clay)</option>
                        <option value="nokshi-shadh">Nokshi Shadh (Silk/Looms)</option>
                        <option value="bela-boshonto">Bela Boshonto (Bangles/Spring)</option>
                      </select>
                    </div>

                    {/* Clear Filter button active state */}
                    {(categoryFilter !== 'all' || selectedCollectionFilter !== 'all' || priceFilter < 500) && (
                      <button
                        onClick={() => {
                          setCategoryFilter('all');
                          setSelectedCollectionFilter('all');
                          setPriceFilter(500);
                        }}
                        className="text-[10px] tracking-widest font-bold text-brand-terracotta uppercase ml-auto hover:underline"
                      >
                        Reset filters
                      </button>
                    )}
                  </div>
                </div>

                {/* Gallery Card Items container with responsive masonries */}
                {filteredProducts.length === 0 ? (
                  <div className="text-center py-20 bg-brand-beige/10 border border-dashed border-brand-clay/30 rounded-2xl">
                    <h3 className="font-serif text-lg font-medium text-brand-charcoal mb-1">No curations match the criteria</h3>
                    <p className="text-xs text-brand-charcoal/60">Try adjustments to your price ceiling or category filters.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
                    {filteredProducts.map((prod) => (
                      <ProductCard
                        key={prod.id}
                        product={prod}
                        onViewDetails={handleOpenProductDetails}
                        onQuickView={(p) => setQuickViewProduct(p)}
                        onAddToCart={(p) => handleAddToCart(p)}
                        onToggleWishlist={handleToggleWishlist}
                        isWishlisted={isProductWishlisted(prod)}
                      />
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* VIEW 3: COLLECTIONS PAGE (Art posters) */}
            {currentPage === 'collections' && (
              <motion.div 
                key="collections-page"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-20"
              >
                {/* Page Intro title */}
                <div className="text-center max-w-xl mx-auto mb-16">
                  <span className="text-[10px] font-sans font-bold tracking-widest text-brand-olive uppercase">Concept narratives</span>
                  <h1 className="font-serif text-3xl sm:text-5xl font-semibold text-brand-charcoal tracking-tight mt-1 mb-2">
                    Heritage Portfolios
                  </h1>
                  <span className="text-xs text-brand-clay uppercase tracking-widest">Documented series posters</span>
                  <OrganicDivider />
                </div>

                {/* Poster stack elements */}
                <div className="space-y-16 sm:space-y-24">
                  {storeCollections.map((col, index) => {
                    const isEven = index % 2 === 0;
                    return (
                      <div 
                        key={col.id} 
                        className={`flex flex-col lg:flex-row items-center gap-8 sm:gap-12 pb-16 sm:pb-24 border-b border-brand-clay/15 last:border-0 ${
                          isEven ? '' : 'lg:flex-row-reverse'
                        }`}
                        id={`collection-poster-${col.id}`}
                      >
                        {/* Visual Poster Banner */}
                        <div className="w-full lg:w-1/2 relative">
                          <div className="relative border border-brand-clay/20 p-3 sm:p-5 rounded-2xl bg-brand-bg overflow-hidden shadow-xl max-w-lg mx-auto">
                            <CornerOrnament position="top-left" />
                            <CornerOrnament position="bottom-right" />
                            
                            <div className="aspect-[16/10] sm:aspect-[4/3] rounded-xl overflow-hidden bg-brand-beige/40">
                              <img src={col.image || null} alt={col.name} referrerPolicy="no-referrer" className="w-full h-full object-cover grayscale-[10%] hover:grayscale-0 transition-all duration-1000" />
                            </div>
                            
                            {/* Small decorative label on poster */}
                            <span className="absolute bottom-10 left-10 tracking-[0.2em] font-mono text-[9px] uppercase text-brand-bg bg-brand-charcoal px-3 py-1.5 rounded">
                              SECURE {col.banglaName} ITEMS
                            </span>
                          </div>
                        </div>

                        {/* Concept story info (Right) */}
                        <div className="w-full lg:w-1/2 space-y-6 flex flex-col justify-center">
                          <span className="text-[10px] font-sans font-bold tracking-widest text-brand-terracotta uppercase">Port-{index + 1} catalog series</span>
                          
                          <div>
                            <h2 className="font-serif text-2xl sm:text-4xl font-semibold text-brand-charcoal tracking-tight">
                              {col.name}
                            </h2>
                            <p className="font-serif text-lg italic text-brand-olive mt-0.5">{col.banglaName} / {col.subtitle}</p>
                          </div>

                          <blockquote className="border-l-2 border-brand-terracotta pl-4 font-serif text-sm italic text-brand-charcoal/80 leading-relaxed text-justify-custom py-1">
                            {col.quote}
                          </blockquote>

                          <p className="text-xs sm:text-sm text-brand-charcoal/75 leading-relaxed text-justify-custom font-sans">
                            {col.description}
                          </p>

                          <div className="flex justify-between items-center text-xs text-brand-clay font-medium pt-2">
                            <span>Series Curator: <strong>{col.curator}</strong></span>
                          </div>

                          <button
                            id={`curate-col-btn-${col.id}`}
                            onClick={() => {
                              setSelectedCollectionFilter(col.id);
                              setCategoryFilter('all');
                              setCurrentPage('shop');
                              window.scrollTo({ top: 0, behavior: 'smooth' });
                            }}
                            className="bg-brand-charcoal hover:bg-brand-terracotta text-brand-bg font-sans font-semibold tracking-widest uppercase text-xs py-3.5 px-6 rounded-xl w-full sm:w-fit transition-colors duration-300"
                          >
                            Explore Series Artifacts ({col.name})
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>
            )}

            {/* VIEW 4: ABOUT VIEW */}
            {currentPage === 'about' && <AboutView />}

            {/* VIEW 5: JOURNAL VIEW */}
            {currentPage === 'journal' && <JournalView />}

            {/* VIEW 6: CONTACT VIEW */}
            {currentPage === 'contact' && <ContactView />}

            {/* VIEW 7: PROFILE VIEW */}
            {currentPage === 'profile' && (
              <motion.div
                key="profile-page"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.5 }}
              >
                {currentUser ? (
                  <UserProfilePanel
                    currentUser={currentUser}
                    onUpdateUser={(user) => setCurrentUser(user)}
                    onNavigateHome={() => setCurrentPage('home')}
                    triggerToast={triggerToast}
                  />
                ) : (
                  <div className="max-w-md mx-auto text-center py-20 px-6 font-sans border border-brand-clay/15 rounded-3xl bg-brand-bg/50 my-12 relative overflow-hidden shadow-sm">
                    <CornerOrnament position="top-right" />
                    <div className="flex justify-center mb-4">
                      <AlpanaCircular size={100} className="text-brand-clay/40" />
                    </div>
                    <h3 className="font-serif text-xl font-bold text-brand-charcoal mb-2">Secure Curator Space</h3>
                    <p className="text-xs text-brand-clay/90 leading-relaxed mb-6">
                      You must authenticate your keeper credentials before viewing your personal atelier settings.
                    </p>
                    <button
                      onClick={() => {
                        setAuthMode('login');
                        setIsAuthModalOpen(true);
                      }}
                      className="inline-block bg-brand-charcoal hover:bg-brand-olive text-brand-bg text-[10px] font-bold uppercase tracking-widest px-6 py-3 rounded-xl transition-all shadow-md"
                    >
                      Authenticate Now
                    </button>
                  </div>
                )}
              </motion.div>
            )}

          </AnimatePresence>
        )}

      </main>

      {/* IMMERSIVE HERITAGE FAREWELL JOURNAL FOOTER */}
      <ImmersiveFooter 
        setCurrentPage={setCurrentPage}
        setCategoryFilter={setCategoryFilter}
        triggerToast={triggerToast}
      />

      {/* SHOPPING CART SLIDE-OUT DRAWER */}
      <AnimatePresence>
        {isCartOpen && (
          <CartDrawer
            isOpen={isCartOpen}
            onClose={() => setIsCartOpen(false)}
            cartItems={cart}
            onUpdateQuantity={handleUpdateCartQuantity}
            onRemoveItem={handleRemoveCartItem}
            onClearCart={handleClearCart}
            currentUser={currentUser}
            onRequestLogin={() => {
              setAuthMode('login');
              setIsAuthModalOpen(true);
            }}
            onPaymentSuccess={(orderId) => {
              setPendingOrderId(orderId);
              setShowPendingPopup(true);
            }}
          />
        )}
      </AnimatePresence>

      {/* PAYMENT PENDING POPUP MODAL */}
      <AnimatePresence>
        {showPendingPopup && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
              onClick={() => setShowPendingPopup(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.3 }}
              className="relative bg-[#ECE7E1] border border-[#D2B591]/40 rounded-2xl p-6 sm:p-8 max-w-md w-full shadow-2xl text-center space-y-6 overflow-hidden"
              style={{ contentVisibility: 'auto' }}
            >
              {/* Corner Ornaments */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-2 border-l-2 border-brand-terracotta/40 rounded-tl-xl pointer-events-none" />
              <div className="absolute top-0 right-0 w-8 h-8 border-t-2 border-r-2 border-brand-terracotta/40 rounded-tr-xl pointer-events-none" />
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-2 border-l-2 border-brand-terracotta/40 rounded-bl-xl pointer-events-none" />
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-2 border-r-2 border-brand-terracotta/40 rounded-br-xl pointer-events-none" />

              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#D2B591]/15 text-brand-terracotta mb-2 animate-pulse">
                <Clock className="w-9 h-9 stroke-[1.25]" />
              </div>
              
              <div className="space-y-2">
                <span className="text-[10px] font-sans font-semibold tracking-widest uppercase text-brand-terracotta block">bKash Transaction Registered</span>
                <h3 className="font-serif text-2xl font-bold text-brand-charcoal leading-snug">
                  Your Payment Verification is Pending
                </h3>
                {pendingOrderId && (
                  <p className="text-[10px] text-brand-clay font-mono bg-[#ECE7E1]/50 py-1 px-3 rounded-md inline-block border border-brand-clay/10">
                    Reference Code: {pendingOrderId}
                  </p>
                )}
              </div>

              <div className="text-xs text-brand-charcoal/80 leading-relaxed space-y-3 bg-[#f5f1eb] p-4 rounded-xl border border-brand-clay/10 text-left">
                <p>
                  We have successfully logged your bKash traditional transaction details into our heritage archives. 
                </p>
                <p>
                  Our validation processes have been initiated. Once verified, your status will update automatically under your profile. You may close this window and continue browsing.
                </p>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => setShowPendingPopup(false)}
                  className="w-full bg-brand-charcoal hover:bg-brand-terracotta text-[#ECE7E1] py-3.5 px-6 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors duration-300"
                >
                  Conclude & Discover More
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK VIEW DETAILS DIALOG */}
      <AnimatePresence>
        {quickViewProduct && (
          <QuickViewModal
            product={quickViewProduct}
            isOpen={quickViewProduct !== null}
            onClose={() => setQuickViewProduct(null)}
            onAddToCart={(p) => handleAddToCart(p)}
            onToggleWishlist={handleToggleWishlist}
            onViewDetails={handleOpenProductDetails}
            isWishlisted={isProductWishlisted(quickViewProduct)}
          />
        )}
      </AnimatePresence>

      {/* SECURE REGISTER / LOGIN OVERLAYS */}
      <AnimatePresence>
        {isAuthModalOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-brand-charcoal/60 backdrop-blur-sm"
              onClick={() => setIsAuthModalOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="z-10 w-full max-w-md"
            >
              {authMode === 'login' && (
                <LoginPage 
                  onSuccess={(user) => {
                    setCurrentUser(user);
                    setIsAuthModalOpen(false);
                    triggerToast(`Login successful! Welcome back, ${user.name || 'Keeper'}.`);
                    if (user.role === 'superAdmin' || user.role === 'admin') {
                      setCurrentPage('admin-dashboard');
                    }
                  }}
                  onClose={() => setIsAuthModalOpen(false)}
                  onAltAction={() => setAuthMode('register')}
                  onForgotPassword={() => setAuthMode('forgot')}
                />
              )}
              {authMode === 'register' && (
                <RegisterPage
                  onSuccess={(user) => {
                    setCurrentUser(user);
                    setIsAuthModalOpen(false);
                    triggerToast("Registration successful! Welcome to Rongo.");
                  }}
                  onClose={() => setIsAuthModalOpen(false)}
                  onAltAction={() => setAuthMode('login')}
                />
              )}
              {authMode === 'forgot' && (
                <ForgotPasswordPage
                  onSuccess={() => {}}
                  onClose={() => setIsAuthModalOpen(false)}
                  onAltAction={() => {}}
                  onBackToLogin={() => setAuthMode('login')}
                />
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* WISHLIST PANEL OVERLAY MODAL */}
      <AnimatePresence>
        {isWishlistOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <div 
              className="absolute inset-0 bg-brand-charcoal/40 backdrop-blur-sm"
              onClick={() => setIsWishlistOpen(false)}
            />
            
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="relative bg-brand-bg max-w-lg w-full p-6 sm:p-8 rounded-2xl border border-brand-clay/20 z-10 shadow-2xl font-sans"
            >
              <button
                id="close-wishlist-modal"
                onClick={() => setIsWishlistOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-beige text-brand-charcoal transition-colors bg-brand-bg/95 border border-brand-clay/20 shadow-sm"
              >
                <XIcon />
              </button>

              <div className="flex items-center gap-1.5 mb-6 text-brand-olive text-xs font-semibold uppercase tracking-wider">
                <Heart className="w-4 h-4 fill-brand-terracotta text-brand-terracotta" />
                <span>Selected Curation Favorites ({wishlist.length})</span>
              </div>

              {wishlist.length === 0 ? (
                <div className="py-12 text-center text-xs text-brand-charcoal/60">
                  <p className="font-serif text-sm text-brand-charcoal font-medium mb-1">Your core is empty of favorites</p>
                  <p>Check through our catalog cards and press heart buttons to pin them here.</p>
                </div>
              ) : (
                <div className="space-y-4 max-h-[50vh] overflow-y-auto pr-2">
                  {wishlist.map((item) => (
                    <div key={item.id} className="flex gap-3 items-center pb-3 border-b border-brand-clay/10">
                      <img src={item.image || null} alt={item.name} referrerPolicy="no-referrer" className="w-12 h-16 object-cover bg-brand-beige/40 rounded border border-brand-clay/10" />
                      <div className="flex-1">
                        <h4 className="font-serif text-sm font-medium text-brand-charcoal line-clamp-1 leading-snug">{item.name}</h4>
                        <span className="text-[10px] text-brand-clay block mt-0.5">{item.banglaName}</span>
                        <span className="font-serif text-xs font-bold text-brand-charcoal block mt-1">৳{item.price}</span>
                      </div>
                      
                      <button
                        onClick={() => {
                          handleAddToCart(item);
                          setIsWishlistOpen(false);
                        }}
                        className="bg-brand-terracotta text-brand-bg text-[9px] uppercase tracking-wider font-bold py-1.5 px-3 rounded hover:bg-brand-charcoal transition-colors"
                      >
                        Buy Now
                      </button>

                      <button
                        onClick={() => handleToggleWishlist(item)}
                        className="text-brand-clay hover:text-brand-terracotta p-1 text-[11px]"
                        aria-label="Remove item"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* GLOBAL TOAST BANNER */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-160 bg-brand-charcoal text-brand-bg px-5 py-3.5 rounded-2xl border border-brand-clay/30 shadow-2xl flex items-center gap-2 max-w-sm font-sans"
          >
            <div className="w-5 h-5 rounded-full bg-brand-terracotta border border-brand-terracotta/20 flex items-center justify-center shrink-0">
              <span className="font-serif font-bold text-xs text-brand-bg">র</span>
            </div>
            <p className="text-xs font-semibold tracking-wide">{toastMessage}</p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}

const XIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <path d="M13.5 4.5l-9 9M4.5 4.5l9 9" />
  </svg>
);
