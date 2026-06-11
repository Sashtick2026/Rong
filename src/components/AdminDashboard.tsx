import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ShoppingBag, Users, Settings, BookOpen, Image, MessageSquare, BarChart3, 
  Plus, Trash2, Edit, Search, LogOut, MapPin, Activity, FileText, Check, 
  Lock, ShieldCheck, RefreshCw, X, Eye, HelpCircle, ArrowRight, Package,
  FolderOpen, Calendar, HelpCircle as AlertIcon, AlertTriangle, ChevronRight, Sparkles, Grid
} from 'lucide-react';
import { firestore, UserProfile, AdminOrder, MediaItem, SiteSettings, ContactMessage, UserRole } from '../lib/mockFirebase';
import { Product, Collection, JournalArticle, AboutSettings } from '../types';
import { CornerOrnament } from './Ornaments';
import { FooterManagementPanel } from './FooterManagementPanel';
import { CouponManagementPanel } from './CouponManagementPanel';
import { PuzzleManagementPanel } from './PuzzleManagementPanel';
import { PaymentVerificationPanel } from './PaymentVerificationPanel';
import { PaymentSettingsPanel } from './PaymentSettingsPanel';

interface AdminDashboardProps {
  currentUser: UserProfile;
  onLogout: () => void;
  onReturnToSite: () => void;
}

type AdminTab = 
  | 'dashboard' 
  | 'products' 
  | 'collections' 
  | 'orders' 
  | 'customers' 
  | 'journal' 
  | 'media' 
  | 'messages' 
  | 'analytics' 
  | 'settings' 
  | 'admins'
  | 'footer-settings'
  | 'coupon-settings'
  | 'puzzle-settings'
  | 'home-editor'
  | 'about-editor'
  | 'payment-verification'
  | 'payment-settings';

export const AdminDashboard: React.FC<AdminDashboardProps> = ({ currentUser, onLogout, onReturnToSite }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' | 'info' } | null>(null);

  // Database states
  const [products, setProducts] = useState<Product[]>([]);
  const [collections, setCollections] = useState<Collection[]>([]);
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [posts, setPosts] = useState<JournalArticle[]>([]);
  const [media, setMedia] = useState<MediaItem[]>([]);
  const [settings, setSettings] = useState<SiteSettings | null>(null);
  const [aboutSettings, setAboutSettings] = useState<AboutSettings | null>(null);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [payments, setPayments] = useState<any[]>([]);
  const [paymentSettingsState, setPaymentSettingsState] = useState<any>(null);

  // Load database values
  const reloadData = () => {
    setProducts(firestore.getProducts());
    setCollections(firestore.getCollections());
    setOrders(firestore.getOrders());
    setUsers(firestore.getUsers());
    setPosts(firestore.getJournalArticles());
    setMedia(firestore.getMedia());
    setSettings(firestore.getSettings());
    setAboutSettings(firestore.getAboutSettings());
    setMessages(firestore.getMessages());
    try {
      setPayments(firestore.getPaymentVerifications());
      setPaymentSettingsState(firestore.getPaymentSettings());
    } catch (e) {
      console.error('Error fetching traditional payments:', e);
    }
  };

  useEffect(() => {
    reloadData();
  }, []);

  const triggerToast = (message: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3000);
  };

  // Guard access checks
  const isAdmin = currentUser.role === 'admin' || currentUser.role === 'superAdmin';
  const isSuperAdmin = currentUser.role === 'superAdmin';

  if (!isAdmin) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[70vh] p-4 text-center font-sans max-w-md mx-auto">
        <AlertTriangle className="w-16 h-16 text-brand-terracotta mb-4 animate-bounce" />
        <h2 className="font-serif text-2xl font-bold text-brand-charcoal">Unauthorized Security Guard</h2>
        <p className="text-xs text-brand-charcoal/70 mt-2 leading-relaxed">
          The administration portal is restricted strictly to authorized curators. Normal accounts cannot bypass this boundary.
        </p>
        <button
          onClick={onReturnToSite}
          className="bg-brand-charcoal text-brand-bg px-6 py-2.5 rounded-lg text-xs font-semibold tracking-widest mt-6 uppercase hover:bg-brand-terracotta transition-colors"
        >
          ← Return to Craft Curation
        </button>
      </div>
    );
  }

  // Sidebar items definition
  const sidebarItems = [
    { id: 'dashboard', label: 'Overview', icon: Grid, roles: ['admin', 'superAdmin'] },
    { id: 'products', label: 'Products', icon: Package, roles: ['admin', 'superAdmin'] },
    { id: 'collections', label: 'Collections', icon: FolderOpen, roles: ['admin', 'superAdmin'] },
    { id: 'orders', label: 'Orders Logs', icon: ShoppingBag, roles: ['admin', 'superAdmin'] },
    { id: 'customers', label: 'Customers', icon: Users, roles: ['admin', 'superAdmin'] },
    { id: 'payment-verification', label: 'Payment Queue', icon: ShieldCheck, roles: ['admin', 'superAdmin'] },
    { id: 'payment-settings', label: 'bKash Settings', icon: Settings, roles: ['admin', 'superAdmin'] },
    { id: 'footer-settings', label: 'Farewell Footer', icon: Settings, roles: ['admin', 'superAdmin'] },
    { id: 'home-editor', label: 'Home Page Editor', icon: Settings, roles: ['admin', 'superAdmin'] },
    { id: 'about-editor', label: 'About Page Editor', icon: FileText, roles: ['admin', 'superAdmin'] },
    { id: 'coupon-settings', label: 'Coupons Control', icon: FileText, roles: ['admin', 'superAdmin'] },
    { id: 'puzzle-settings', label: 'Puzzle Assets', icon: Grid, roles: ['admin', 'superAdmin'] },
    { id: 'journal', label: 'Journal Articles', icon: BookOpen, roles: ['admin', 'superAdmin'] },
    { id: 'media', label: 'Media Library', icon: Image, roles: ['admin', 'superAdmin'] },
    { id: 'messages', label: 'Messages', icon: MessageSquare, roles: ['admin', 'superAdmin'] },
    { id: 'analytics', label: 'Analytics', icon: BarChart3, roles: ['admin', 'superAdmin'] },
    { id: 'settings', label: 'Site Settings', icon: Settings, roles: ['admin', 'superAdmin'] },
    { id: 'admins', label: 'Admins Control', icon: ShieldCheck, roles: ['superAdmin'] },
  ];

  return (
    <div className="min-h-screen bg-[#F4F1ED] flex font-sans text-brand-charcoal relative">
      
      {/* TOAST SYSTEM */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.9 }}
            className={`fixed bottom-6 right-6 z-55 px-5 py-3 rounded-xl shadow-xl flex items-center gap-2.5 text-xs font-semibold text-brand-bg ${
              toast.type === 'success' ? 'bg-[#5B6349]' : toast.type === 'error' ? 'bg-[#AB5039]' : 'bg-[#403B37]'
            }`}
          >
            {toast.type === 'success' ? <Check className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{toast.message}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* SIDEBAR FOR DESKTOP */}
      <nav className="hidden lg:flex flex-col w-64 bg-[#2D2A26] text-[#BBBBBB] border-r border-[#3E3A36] h-screen sticky top-0 shrink-0">
        <div className="p-6 border-b border-[#3E3A36] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-brand-terracotta flex items-center justify-center text-brand-bg font-serif font-bold text-lg">
            র
          </div>
          <div>
            <h1 className="font-serif text-[#FFFFFF] text-lg font-bold">Rong Ateliers</h1>
            <span className="text-[9px] tracking-widest text-[#B49275] uppercase block font-semibold">Curation Centre</span>
          </div>
        </div>

        {/* User Info Badge */}
        <div className="p-4 border-b border-[#3E3A36] bg-[#24211F] flex items-center gap-3">
          <img 
            src={currentUser.profileImage || 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150'} 
            alt="" 
            className="w-10 h-10 rounded-full object-cover border border-[#4E4A45]"
          />
          <div className="overflow-hidden">
            <h4 className="text-xs font-bold text-[#FFFFFF] truncate">{currentUser.name}</h4>
            <span className="text-[9px] tracking-widest uppercase text-brand-terracotta block font-bold">{currentUser.role}</span>
          </div>
        </div>

        {/* Sidebar Nav Links */}
        <div className="flex-1 overflow-y-auto px-4 py-4 space-y-1">
          {sidebarItems
            .filter(item => item.roles.includes(currentUser.role))
            .map(item => {
              const TabIcon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as AdminTab)}
                  className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs tracking-wider font-semibold transition-colors uppercase ${
                    isActive 
                      ? 'bg-brand-terracotta text-brand-bg font-bold' 
                      : 'hover:bg-[#363330] hover:text-[#FFFFFF]'
                  }`}
                >
                  <TabIcon className="w-4.5 h-4.5 shrink-0" />
                  <span>{item.label}</span>
                </button>
              );
            })}
        </div>

        {/* Bottom Actions */}
        <div className="p-4 border-t border-[#3E3A36] space-y-2 mt-auto">
          <button
            onClick={onReturnToSite}
            className="w-full flex items-center justify-center gap-2 bg-[#403B37] hover:bg-[#4E4742] text-[#FFFFFF] py-2.5 rounded-lg text-xs font-semibold tracking-wider transition-colors"
          >
            <span>Return to Site</span>
          </button>
          
          <button
            onClick={onLogout}
            className="w-full flex items-center justify-center gap-2 bg-transparent hover:bg-brand-terracotta/10 text-brand-terracotta py-2.5 rounded-lg text-xs font-bold tracking-wider transition-colors uppercase"
          >
            <LogOut className="w-4 h-4" />
            <span>Secure Logout</span>
          </button>
        </div>
      </nav>

      {/* MOBILE HEADER/SIDEBAR TRIGGER */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-[#2D2A26] text-white flex items-center justify-between px-4 z-40 border-b border-[#3E3A36]">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-brand-terracotta flex items-center justify-center text-brand-bg font-serif font-bold">
            র
          </div>
          <span className="font-serif font-bold text-base tracking-wider text-[#FFFFFF] truncate">Rong Control</span>
        </div>
        <button
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="bg-[#24211F] border border-[#3E3A36] p-2 rounded text-xs uppercase tracking-widest font-mono"
        >
          {mobileSidebarOpen ? 'Close Menu' : 'Open Menu'}
        </button>
      </div>

      {/* MOBILE DRAWER OVERLAY */}
      {mobileSidebarOpen && (
        <div className="lg:hidden fixed inset-0 z-40 flex">
          <div className="fixed inset-0 bg-[#000000]/60 backdrop-blur-xs" onClick={() => setMobileSidebarOpen(false)} />
          <nav className="relative flex flex-col w-72 bg-[#2D2A26] text-[#BBBBBB] border-r border-[#3E3A36] h-full p-6 z-10 overflow-y-auto">
            <div className="pb-6 border-b border-[#3E3A36] flex items-center gap-3 mb-6">
              <div className="w-9 h-9 rounded-full bg-brand-terracotta flex items-center justify-center text-brand-bg font-serif font-bold text-lg">
                র
              </div>
              <div>
                <h1 className="font-serif text-[#FFFFFF] text-lg font-bold">Rong Ateliers</h1>
                <span className="text-[9px] tracking-widest text-[#B49275] uppercase block font-semibold">Curation Centre</span>
              </div>
            </div>

            <div className="flex-1 space-y-1">
              {sidebarItems
                .filter(item => item.roles.includes(currentUser.role))
                .map(item => {
                  const TabIcon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        setActiveTab(item.id as AdminTab);
                        setMobileSidebarOpen(false);
                      }}
                      className={`w-full flex items-center gap-3.5 px-4 py-3 rounded-lg text-xs tracking-wider font-semibold transition-colors uppercase ${
                        isActive 
                          ? 'bg-brand-terracotta text-brand-bg font-bold' 
                          : 'hover:bg-[#363330] hover:text-[#FFFFFF]'
                      }`}
                    >
                      <TabIcon className="w-4.5 h-4.5 shrink-0" />
                      <span>{item.label}</span>
                    </button>
                  );
                })}
            </div>

            <div className="pt-6 border-t border-[#3E3A36] space-y-2 mt-6">
              <button
                onClick={() => { onReturnToSite(); setMobileSidebarOpen(false); }}
                className="w-full bg-[#403B37] text-white py-2.5 rounded-lg text-xs font-semibold uppercase tracking-wider"
              >
                Return to Site
              </button>
              
              <button
                onClick={onLogout}
                className="w-full flex items-center justify-center gap-2 text-brand-terracotta py-2 rounded-lg text-xs font-bold uppercase tracking-wider"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </nav>
        </div>
      )}

      {/* CORE CONTENT PORT */}
      <div className="flex-1 flex flex-col min-w-0 pt-16 lg:pt-0 overflow-y-auto h-screen">
        
        {/* TOPBAR */}
        <header className="hidden lg:flex items-center justify-between h-20 bg-brand-bg/95 border-b border-brand-clay/15 px-8 sticky top-0 z-30 backdrop-blur-md">
          <div className="flex items-center gap-2 text-xs font-semibold text-brand-clay uppercase tracking-widest">
            <Activity className="w-4 h-4 text-brand-olive animate-pulse" />
            <span>Workspace: Active (UTC-2026 logs)</span>
          </div>

          <div className="flex items-center gap-6 text-sm">
            <span className="text-brand-clay font-medium text-xs">Curer: <strong className="text-brand-charcoal">{currentUser.name}</strong></span>
            <div className="h-4 w-[1px] bg-brand-clay/35" />
            <button
              onClick={onReturnToSite}
              className="group inline-flex items-center gap-1.5 text-xs text-brand-olive font-bold uppercase tracking-wider"
            >
              <span>Explore Public Site</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </header>

        {/* CONTAINER FOR CONTENT ACTIONS */}
        <main className="flex-grow p-4 sm:p-8 max-w-7xl w-full mx-auto pb-24">
          <AnimatePresence mode="wait">
            
            {/* VIEW 1: DASHBOARD OVERVIEW */}
            {activeTab === 'dashboard' && (
              <motion.div
                key="admin-tab-overview"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-8"
              >
                <div>
                  <h2 className="font-serif text-3xl font-semibold text-brand-charcoal">Atelier Dashboard</h2>
                  <p className="text-xs text-brand-clay uppercase tracking-widest mt-0.5">Heritage Business Metrics & Live Archives</p>
                </div>

                {/* STATS ROW */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
                  {/* Revenue Card */}
                  <div className="bg-brand-bg border border-brand-clay/20 p-5 rounded-2xl relative shadow-xs">
                    <span className="text-[10px] uppercase font-semibold text-brand-olive tracking-wider block">Estimated Revenue</span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold block mt-1 text-brand-charcoal">৳{orders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0).toLocaleString()}</span>
                    <span className="text-[9px] text-[#5B6349] font-medium block mt-1">✔ Realized from 3 logs</span>
                  </div>

                  {/* Orders Card */}
                  <div className="bg-brand-bg border border-brand-clay/20 p-5 rounded-2xl relative shadow-xs">
                    <span className="text-[10px] uppercase font-semibold text-brand-terracotta tracking-wider block">Total Orders</span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold block mt-1 text-brand-charcoal">{orders.length}</span>
                    <span className="text-[9px] text-brand-clay block mt-1">Pending verification: {orders.filter(o => o.status === 'pending').length}</span>
                  </div>

                  {/* Products Card */}
                  <div className="bg-brand-bg border border-brand-clay/20 p-5 rounded-2xl relative shadow-xs">
                    <span className="text-[10px] uppercase font-semibold text-brand-clay tracking-wider block">Total Curations</span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold block mt-1 text-brand-charcoal">{products.length}</span>
                    <span className="text-[9px] text-brand-olive block mt-1">Active categories: 4 mediums</span>
                  </div>

                  {/* Customers Card */}
                  <div className="bg-brand-bg border border-brand-clay/20 p-5 rounded-2xl relative shadow-xs">
                    <span className="text-[10px] uppercase font-semibold text-brand-olive tracking-wider block">Registrants</span>
                    <span className="font-serif text-2xl sm:text-3xl font-bold block mt-1 text-brand-charcoal">{users.filter(u => u.role === 'customer').length}</span>
                    <span className="text-[9px] text-brand-clay block mt-1">Admin curators: {users.filter(u => u.role !== 'customer').length}</span>
                  </div>
                </div>

                {/* GRAPHIC SVG MOCK CHART */}
                <div className="bg-brand-bg border border-brand-clay/20 p-6 sm:p-8 rounded-3xl relative overflow-hidden">
                  <CornerOrnament position="top-right" />
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
                    <div>
                      <h3 className="font-serif text-lg font-bold">Seasonal Sales Index</h3>
                      <p className="text-[10px] text-brand-clay uppercase tracking-wider">Estimated monthly collections checkouts value (BDT)</p>
                    </div>
                    <span className="bg-brand-beige/50 border border-brand-clay/35 text-[9px] px-2.5 py-1 text-brand-olive font-bold rounded">
                      VOLUME VI COMPILATION
                    </span>
                  </div>

                  {/* Real hand-drawn styled SVG chart */}
                  <div className="h-64 sm:h-72 w-full pt-4">
                    <svg className="w-full h-full text-brand-terracotta" viewBox="0 0 500 200" fill="none">
                      {/* Grid Lines */}
                      <line x1="0" y1="40" x2="500" y2="40" stroke="#E3DDD5" strokeWidth="0.75" strokeDasharray="3 3" />
                      <line x1="0" y1="90" x2="500" y2="90" stroke="#E3DDD5" strokeWidth="0.75" strokeDasharray="3 3" />
                      <line x1="0" y1="140" x2="500" y2="140" stroke="#E3DDD5" strokeWidth="0.75" strokeDasharray="3 3" />
                      <line x1="0" y1="180" x2="500" y2="180" stroke="#8E857B" strokeWidth="1" />

                      {/* Line Paths representing sales curving upward */}
                      <path 
                        d="M 10,160 C 80,150 120,110 180,120 C 240,130 300,70 380,85 C 430,90 460,50 490,40" 
                        stroke="#C46E4E" 
                        strokeWidth="3.5" 
                        strokeLinecap="round"
                      />
                      
                      {/* Dots on peak sales epochs */}
                      <circle cx="180" cy="120" r="5" fill="#4B5634" stroke="#FAF7F2" strokeWidth="2" />
                      <circle cx="380" cy="85" r="5" fill="#C46E4E" stroke="#FAF7F2" strokeWidth="2" />
                      <circle cx="490" cy="40" r="5.5" fill="#C46E4E" stroke="#FAF7F2" strokeWidth="2.5" />

                      {/* Text tags at months */}
                      <text x="10" y="195" fill="#888888" fontSize="8" fontFamily="sans-serif">Jan</text>
                      <text x="100" y="195" fill="#888888" fontSize="8" fontFamily="sans-serif">Feb</text>
                      <text x="180" y="195" fill="#888888" fontSize="8" fontFamily="sans-serif">Mar</text>
                      <text x="270" y="195" fill="#888888" fontSize="8" fontFamily="sans-serif">Apr</text>
                      <text x="375" y="195" fill="#888888" fontSize="8" fontFamily="sans-serif">May</text>
                      <text x="470" y="195" fill="#888888" fontSize="8" fontFamily="sans-serif">Jun</text>

                      {/* Peak tag value */}
                      <text x="445" y="25" fill="#C46E4E" fontSize="9" fontWeight="bold" fontFamily="monospace">৳1,200 (PEAK)</text>
                    </svg>
                  </div>
                </div>

                {/* DOUBLE COLUMN PANELS */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Recent Orders List */}
                  <div className="lg:col-span-7 bg-brand-bg border border-brand-clay/20 p-5 rounded-2xl shadow-xs">
                    <h4 className="font-serif text-base font-semibold mb-3 select-none">Recent Atelier Orders</h4>
                    <div className="divide-y divide-brand-clay/10 overflow-x-auto">
                      {orders.slice(0, 3).map((item) => (
                        <div key={item.id} className="py-3 flex items-center justify-between gap-3 text-xs">
                          <div>
                            <span className="font-bold text-brand-charcoal block">{item.id}</span>
                            <span className="text-brand-clay font-medium block text-[10px]">{item.customerName} — {item.createdAt.slice(0,10)}</span>
                          </div>
                          
                          <div className="flex items-center gap-3">
                            <span className="bg-brand-beige/65 font-bold px-2 py-1 select-none text-[10px] rounded text-brand-charcoal">
                              ৳{item.totalAmount}
                            </span>
                            <span className={`text-[9px] font-semibold uppercase px-2 py-0.5 rounded select-none ${
                              item.status === 'delivered' ? 'bg-brand-olive/15 text-brand-olive' :
                              item.status === 'processing' ? 'bg-[#D2B591] text-brand-charcoal' :
                              'bg-brand-terracotta/15 text-brand-terracotta'
                            }`}>
                              {item.status}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Quick System Actions banner */}
                  <div className="lg:col-span-5 bg-brand-bg border border-brand-clay/20 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
                    <div>
                      <h4 className="font-serif text-base font-semibold mb-3 select-none">Quick Curator Actions</h4>
                      <p className="text-xs text-brand-clay leading-relaxed">
                        Expedite standard shop configurations or monitor logs. Only Super Admins may adjust permission coordinates.
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 mt-6">
                      <button
                        onClick={() => setActiveTab('products')}
                        className="bg-brand-terracotta/10 hover:bg-brand-terracotta hover:text-brand-bg transition-colors py-2 px-3 rounded-lg text-left text-[11px] font-bold text-brand-terracotta uppercase tracking-wider block"
                      >
                        + New Curation
                      </button>
                      <button
                        onClick={() => setActiveTab('journal')}
                        className="bg-brand-olive/10 hover:bg-brand-olive hover:text-brand-bg transition-colors py-2 px-3 rounded-lg text-left text-[11px] font-bold text-brand-olive uppercase tracking-wider block"
                      >
                        + Write Article
                      </button>
                      <button
                        onClick={() => setActiveTab('media')}
                        className="bg-[#2D2A26]/10 hover:bg-[#2D2A26] hover:text-brand-bg transition-colors py-2 px-3 rounded-lg text-left text-[11px] font-bold text-brand-charcoal uppercase tracking-wider block"
                      >
                        ↑ Upload media
                      </button>
                      <button
                        onClick={() => setActiveTab('settings')}
                        className="bg-brand-clay/10 hover:bg-brand-clay hover:text-brand-bg transition-colors py-2 px-3 rounded-lg text-left text-[11px] font-bold text-[#555555] uppercase tracking-wider block"
                      >
                        ⚙ Brand Settings
                      </button>
                    </div>
                  </div>
                </div>

              </motion.div>
            )}

            {/* VIEW 2: PRODUCTS CRUD */}
            {activeTab === 'products' && (
              <ProductsCrudPanel 
                products={products} 
                collections={collections}
                onSave={(prod) => { firestore.saveProduct(prod); reloadData(); triggerToast('Product listing saved successfully.'); }}
                onDelete={(id) => { firestore.deleteProduct(id); reloadData(); triggerToast('Product listing removed.'); }}
              />
            )}

            {/* VIEW 3: COLLECTIONS CRUD */}
            {activeTab === 'collections' && (
              <CollectionsCrudPanel 
                collections={collections}
                onSave={(col) => { firestore.saveCollection(col); reloadData(); triggerToast('Collection listing saved.'); }}
                onDelete={(id) => { firestore.deleteCollection(id); reloadData(); triggerToast('Collection removed.'); }}
              />
            )}

            {/* VIEW 4: ORDER MANAGEMENT */}
            {activeTab === 'orders' && (
              <OrdersPanel 
                orders={orders}
                onUpdateStatus={(id, status) => { firestore.updateOrderStatus(id, status); reloadData(); triggerToast(`Order ${id} is marked as ${status}.`); }}
              />
            )}

            {/* VIEW 5: CUSTOMER CRM DIRECTORY */}
            {activeTab === 'customers' && (
              <CustomersDirectoryPanel 
                users={users}
                orders={orders}
                onUpdateStatus={(uid, status) => { firestore.updateUserProfile(uid, { status }); reloadData(); triggerToast(`Keeper status modified.`); }}
              />
            )}

            {/* VIEW 6: JOURNAL BLOG CRUD */}
            {activeTab === 'journal' && (
              <JournalPostCrudPanel 
                articles={posts}
                onSave={(post) => { firestore.saveJournalArticle(post); reloadData(); triggerToast('Journal entry saved successfully.'); }}
                onDelete={(id) => { firestore.deleteJournalArticle(id); reloadData(); triggerToast('Journal article removed.'); }}
              />
            )}

            {/* VIEW 7: MEDIA ASSETS LIBRARY */}
            {activeTab === 'media' && (
              <MediaLibraryPanel 
                mediaItems={media}
                onUpload={(name, url, folder, size, type) => { firestore.addMediaItem(name, url, folder, size, type); reloadData(); triggerToast('File uploaded to simulated Storage.'); }}
                onDelete={(id) => { firestore.deleteMediaItem(id); reloadData(); triggerToast('Media asset removed.'); }}
              />
            )}

            {/* VIEW 8: MESSAGES */}
            {activeTab === 'messages' && (
              <MessagesPanel 
                messages={messages}
                onReply={(id) => { firestore.replyToMessage(id); reloadData(); triggerToast('Simulated reply transmitted regarding inquiry.'); }}
                onDelete={(id) => { firestore.deleteMessage(id); reloadData(); triggerToast('Message log deleted.'); }}
              />
            )}

            {/* VIEW 9: ANALYTICS DETAIL PAGES */}
            {activeTab === 'analytics' && (
              <AnalyticsDetailedView products={products} orders={orders} />
            )}

            {/* VIEW 10: SETTINGS PAGE */}
            {activeTab === 'settings' && settings && (
              <SiteSettingsPanel 
                initialSettings={settings}
                onSave={(setts) => { firestore.saveSettings(setts); reloadData(); triggerToast('Heritage brand settings stored.'); }}
              />
            )}

            {/* EDITABLE PANELS: HOME PAGE AND ABOUT PAGE */}
            {activeTab === 'home-editor' && settings && (
              <HomeEditorPanel 
                initialSettings={settings}
                onSave={(setts) => { firestore.saveSettings(setts); reloadData(); triggerToast('Home page visual layout text stored.'); }}
              />
            )}

            {activeTab === 'about-editor' && aboutSettings && (
              <AboutEditorPanel 
                initialSettings={aboutSettings}
                onSave={(setts) => { firestore.saveAboutSettings(setts); reloadData(); triggerToast('About page chronicle parameters saved.'); }}
              />
            )}

            {/* NEW VIEWS: FAREWELL FOOTER, COUPONS, AND PUZZLE PIECES */}
            {activeTab === 'footer-settings' && (
              <FooterManagementPanel />
            )}

            {activeTab === 'coupon-settings' && (
              <CouponManagementPanel />
            )}

            {activeTab === 'puzzle-settings' && (
              <PuzzleManagementPanel />
            )}

            {/* VIEW 11: ADMINS MANAGEMENT (SUPERADMIN CONTROL) */}
            {activeTab === 'admins' && (
              <SuperAdminsAccessDashboard 
                users={users}
                currentUser={currentUser}
                onUpdateRole={(uid, role) => { firestore.updateUserProfile(uid, { role }); reloadData(); triggerToast('Staff access coordinates updated.'); }}
                onSuspendUser={(uid, status) => { firestore.updateUserProfile(uid, { status }); reloadData(); triggerToast('Keeper suspended successfully.'); }}
                onCreateAdmin={(name, email, password, role) => {
                  firestore.createUserByAdmin({ name, email, role, status: 'active' });
                  reloadData();
                  triggerToast(`Staff profile for ${name} established.`);
                }}
              />
            )}

            {/* VIEW 12: bKash MANUAL PAYMENTS QUEUE */}
            {activeTab === 'payment-verification' && (
              <PaymentVerificationPanel
                verifications={payments}
                onReload={reloadData}
                triggerToast={triggerToast}
              />
            )}

            {/* VIEW 13: bKash MANUAL PAYMENTS SETTINGS */}
            {activeTab === 'payment-settings' && (
              <PaymentSettingsPanel
                settings={paymentSettingsState}
                onReload={reloadData}
                triggerToast={triggerToast}
              />
            )}

          </AnimatePresence>
        </main>

      </div>
    </div>
  );
};


// ====================================================
// SUB-PANEL: PRODUCTS CRUD MANAGER
// ====================================================
interface ProductsCrudProps {
  products: Product[];
  collections: Collection[];
  onSave: (product: Product) => void;
  onDelete: (id: string) => void;
}

const ProductsCrudPanel: React.FC<ProductsCrudProps> = ({ products, collections, onSave, onDelete }) => {
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [search, setSearch] = useState('');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [banglaName, setBanglaName] = useState('');
  const [category, setCategory] = useState<Product['category']>('sarees');
  const [price, setPrice] = useState(100);
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');
  const [banglaDescription, setBanglaDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [care, setCare] = useState('');
  const [shipping, setShipping] = useState('');
  const [collectionId, setCollectionId] = useState('');
  const [story, setStory] = useState('');
  const [bestSeller, setBestSeller] = useState(false);
  const [newArrival, setNewArrival] = useState(false);
  const [offerPercentage, setOfferPercentage] = useState(0);
  const [stock, setStock] = useState<number>(10);

  const startEdit = (p: Product) => {
    setEditingProduct(p);
    setId(p.id);
    setName(p.name);
    setBanglaName(p.banglaName);
    setCategory(p.category);
    setPrice(p.price);
    setImage(p.image);
    setDescription(p.description);
    setBanglaDescription(p.banglaDescription || '');
    setMaterials(p.materials.join(', '));
    setCare(p.care.join(', '));
    setShipping(p.shipping);
    setCollectionId(p.collectionId);
    setStory(p.story);
    setBestSeller(!!p.bestSeller);
    setNewArrival(!!p.newArrival);
    setOfferPercentage(p.offerPercentage || 0);
    setStock(p.stock !== undefined ? p.stock : 10);
    setIsFormOpen(true);
  };

  const startAdd = () => {
    setEditingProduct(null);
    setId('prod_' + Date.now());
    setName('');
    setBanglaName('');
    setCategory('sarees');
    setPrice(120);
    setImage('https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800');
    setDescription('');
    setBanglaDescription('');
    setMaterials('Rajshahi Silk, Gold threads');
    setCare('Dry clean only, wrap in fine cotton');
    setShipping('Ships in 3-5 business days beautifully packed.');
    setCollectionId(collections[0]?.id || '');
    setStory('');
    setBestSeller(false);
    setNewArrival(true);
    setOfferPercentage(0);
    setStock(10);
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image || !price) return;

    const saved: Product = {
      id,
      name,
      banglaName,
      category,
      price: Number(price),
      image,
      images: [image],
      description,
      banglaDescription,
      materials: materials.split(',').map(m => m.trim()).filter(Boolean),
      care: care.split(',').map(c => c.trim()).filter(Boolean),
      shipping,
      collectionId,
      story,
      bestSeller,
      newArrival,
      offerPercentage: offerPercentage > 0 ? Number(offerPercentage) : undefined,
      stock: Number(stock),
    };
    onSave(saved);
    setIsFormOpen(false);
  };

  const filtered = products.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.category.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-6" id="products-crud-panel">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h3 className="font-serif text-2xl font-semibold">Curation Inventory Management</h3>
          <p className="text-xs text-brand-clay uppercase tracking-widest mt-0.5">CRUD system for sarees, clay pottery, bangles</p>
        </div>
        
        <button
          onClick={startAdd}
          className="bg-[#5B6349] hover:bg-brand-charcoal text-brand-bg px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>Add Custom Artifact</span>
        </button>
      </div>

      {/* FILTER SEARCH WRAPPER */}
      <div className="bg-brand-bg border border-brand-clay/20 p-4 rounded-xl flex items-center gap-3">
        <Search className="w-4 h-4 text-brand-clay shrink-0" />
        <input
          type="text"
          placeholder="Filter curations by name parameters..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent w-full border-0 text-xs sm:text-sm focus:outline-none placeholder-brand-clay"
        />
      </div>

      {/* LIST TABLE */}
      <div className="bg-brand-bg border border-brand-clay/20 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-beige/35 border-b border-brand-clay/15 text-[10px] tracking-widest text-[#555555] uppercase font-bold select-none">
                <th className="py-4 px-6">Artifact Card</th>
                <th className="py-4 px-6">Medium</th>
                <th className="py-4 px-6">Price index</th>
                <th className="py-4 px-6">Available Stock</th>
                <th className="py-4 px-6">Status flags</th>
                <th className="py-4 px-6 text-right">Settings</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-clay/15 text-xs text-brand-charcoal/85">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-brand-beige/10 transition-colors">
                  <td className="py-4 px-6 flex items-center gap-3">
                    <img src={p.image} referrerPolicy="no-referrer" className="w-10 h-12 object-cover rounded border border-brand-clay/15 bg-brand-beige" />
                    <div>
                      <span className="font-bold block text-sm">{p.name}</span>
                      <span className="text-[10.5px] text-brand-clay font-serif italic mt-0.5 block">{p.banglaName}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 uppercase tracking-wider text-[10px] font-semibold text-brand-olive">{p.category}</td>
                  <td className="py-4 px-6 font-bold text-brand-charcoal">৳{p.price}</td>
                  <td className="py-4 px-6">
                    {p.stock === 0 ? (
                      <span className="text-red-700 bg-red-100/70 border border-red-200 font-bold px-2 py-0.5 rounded text-[10px] uppercase">Stock Out</span>
                    ) : (
                      <span className="font-mono font-bold text-[#555555] bg-gray-100 border border-gray-200/50 px-2 py-0.5 rounded text-[10.5px]">
                        {p.stock !== undefined ? p.stock : 10} units
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 space-x-1.5 whitespace-nowrap">
                    {p.bestSeller && <span className="bg-[#B49275]/20 text-brand-charcoal/80 font-bold px-1.5 py-0.5 text-[9px] uppercase rounded">Bestseller</span>}
                    {p.newArrival && <span className="bg-[#5B6349]/10 text-[#4B5634] font-bold px-1.5 py-0.5 text-[9px] uppercase rounded text-brand-olive">New</span>}
                    {!p.bestSeller && !p.newArrival && <span className="text-[9px] text-[#888888]">Standard Catalog</span>}
                  </td>
                  <td className="py-4 px-6 text-right space-x-2">
                    <button
                      onClick={() => startEdit(p)}
                      className="text-brand-olive hover:text-brand-charcoal p-1 border border-brand-clay/20 hover:bg-brand-beige rounded"
                      aria-label="Edit item settings"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    {deleteConfirmId === p.id ? (
                      <button
                        onClick={() => {
                          onDelete(p.id);
                          setDeleteConfirmId(null);
                        }}
                        className="text-white bg-brand-terracotta hover:bg-brand-charcoal px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded"
                        aria-label="Confirm permanent deletion of product"
                      >
                        Sure?
                      </button>
                    ) : (
                      <button
                        onClick={() => {
                          setDeleteConfirmId(p.id);
                          setTimeout(() => setDeleteConfirmId(prev => prev === p.id ? null : prev), 3500);
                        }}
                        className="text-brand-terracotta hover:text-brand-charcoal p-1 border border-brand-clay/20 hover:bg-brand-beige rounded"
                        aria-label="Delete item permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM SYSTEM */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-xs" onClick={() => setIsFormOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-brand-bg max-w-2xl w-full p-6 sm:p-8 rounded-3xl z-10 overflow-y-auto max-h-[85vh] border border-brand-clay/20 shadow-2xl font-sans"
            >
              <button
                onClick={() => setIsFormOpen(false)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-beige bg-brand-bg/95 border border-brand-clay/15 shadow-sm"
              >
                <X className="w-4 h-4" />
              </button>

              <h4 className="font-serif text-xl sm:text-2xl font-semibold text-brand-charcoal mb-6">
                {editingProduct ? 'Edit Curation Spec' : 'Add Custom Curation'}
              </h4>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Curation Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Bengali Calligraphic Title</label>
                    <input type="text" value={banglaName} onChange={(e) => setBanglaName(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Format Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value as Product['category'])} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta">
                      <option value="sarees">Sarees</option>
                      <option value="jewelry">Jewelry</option>
                      <option value="bangles">Bangles</option>
                      <option value="homeDecor">Home Décor</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Price Index (BDT)</label>
                    <input type="number" required value={price} onChange={(e) => setPrice(Number(e.target.value))} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Active Offer (%)</label>
                    <input type="number" value={offerPercentage} onChange={(e) => setOfferPercentage(Math.max(0, Math.min(95, Number(e.target.value))))} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" min={0} max={95} placeholder="0" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Available Stock</label>
                    <input type="number" required value={stock} onChange={(e) => setStock(Math.max(0, Number(e.target.value)))} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" min={0} placeholder="10" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Concept Series Link</label>
                    <select value={collectionId} onChange={(e) => setCollectionId(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta">
                      {collections.map(c => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Visual Image Coordinate Url</label>
                  <input type="text" required value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Aesthetic Narrative (English)</label>
                  <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta resize-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Bengali Narrative (বাংলা)</label>
                  <textarea rows={2} value={banglaDescription} onChange={(e) => setBanglaDescription(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2定位 focus:outline-none focus:border-brand-terracotta resize-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Natural Composition (separate with commas)</label>
                    <input type="text" value={materials} onChange={(e) => setMaterials(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" placeholder="Pure Rajshahi Silk, Gold laces" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Care Instructions (commas)</label>
                    <input type="text" value={care} onChange={(e) => setCare(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 pr-10 focus:outline-none focus:border-brand-terracotta" placeholder="Dry clean only, iron reversely" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Curation Storytelling Paragraph</label>
                  <textarea rows={2} value={story} onChange={(e) => setStory(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta resize-none" placeholder="Weavers spent 12 days setting the warp..." />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Box packaging & shipping rules</label>
                  <input type="text" value={shipping} onChange={(e) => setShipping(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" />
                </div>

                <div className="flex gap-6 items-center pt-2">
                  <div className="flex items-center gap-2">
                    <input id="form-best-seller" type="checkbox" checked={bestSeller} onChange={(e) => setBestSeller(e.target.checked)} className="rounded border-brand-clay/40 text-brand-terracotta text-brand-olive" />
                    <label htmlFor="form-best-seller" className="text-xs font-semibold cursor-pointer">Bestselling Display</label>
                  </div>
                  <div className="flex items-center gap-2">
                    <input id="form-new-arrival" type="checkbox" checked={newArrival} onChange={(e) => setNewArrival(e.target.checked)} className="rounded border-brand-clay/40 text-brand-terracotta text-brand-olive" />
                    <label htmlFor="form-new-arrival" className="text-xs font-semibold cursor-pointer">New Arrival Highlight</label>
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#5B6349] hover:bg-[#2D2A26] text-brand-bg font-bold uppercase tracking-widest py-3.5 rounded-xl transition-colors mt-4 block cursor-pointer">
                  Save Curation Coordinates
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ====================================================
// SUB-PANEL: COLLECTIONS CRUD
// ====================================================
interface CollectionsCrudProps {
  collections: Collection[];
  onSave: (collection: Collection) => void;
  onDelete: (id: string) => void;
}

const CollectionsCrudPanel: React.FC<CollectionsCrudProps> = ({ collections, onSave, onDelete }) => {
  const [editingCollection, setEditingCollection] = useState<Collection | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [id, setId] = useState('');
  const [name, setName] = useState('');
  const [banglaName, setBanglaName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [quote, setQuote] = useState('');
  const [image, setImage] = useState('');
  const [curator, setCurator] = useState('');

  const startEdit = (c: Collection) => {
    setEditingCollection(c);
    setId(c.id);
    setName(c.name);
    setBanglaName(c.banglaName);
    setSubtitle(c.subtitle);
    setDescription(c.description);
    setQuote(c.quote);
    setImage(c.image);
    setCurator(c.curator);
    setIsFormOpen(true);
  };

  const startAdd = () => {
    setEditingCollection(null);
    setId('col_' + Date.now());
    setName('');
    setBanglaName('');
    setSubtitle('');
    setDescription('');
    setQuote('');
    setImage('https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800');
    setCurator('');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !image || !curator) return;
    onSave({ id, name, banglaName, subtitle, description, quote, image, curator });
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6" id="collections-crud-panel">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-serif text-2xl font-semibold">Portfolios & Concept Collections</h3>
          <p className="text-xs text-brand-clay uppercase tracking-widest mt-0.5">Edit major launch streams of Rong</p>
        </div>
        
        <button
          onClick={startAdd}
          className="bg-[#5B6349] hover:bg-brand-charcoal text-white px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>New Series</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {collections.map(c => (
          <div key={c.id} className="bg-brand-bg border border-brand-clay/20 rounded-2xl overflow-hidden flex flex-col justify-between shadow-xs">
            <div>
              <div className="relative aspect-[16/10] bg-brand-beige/40 border-b border-brand-clay/15">
                <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
                <span className="absolute bottom-2 left-2 text-[8px] font-semibold tracking-wider bg-brand-charcoal px-2.5 py-1 text-brand-bg rounded">
                  {c.curator} CURATION
                </span>
              </div>
              <div className="p-5">
                <h4 className="font-serif text-base font-bold text-brand-charcoal">{c.name}</h4>
                <p className="font-serif text-xs italic text-brand-olive mt-0.5">{c.banglaName} — {c.subtitle}</p>
                <p className="text-xs text-brand-charcoal/70 line-clamp-3 leading-relaxed mt-3">{c.description}</p>
              </div>
            </div>

            <div className="border-t border-brand-clay/15 p-4 flex justify-between bg-brand-beige/10">
              <span className="text-[10px] font-mono tracking-wide text-brand-clay self-center uppercase">ID: {c.id}</span>
              <div className="space-x-1 flex">
                <button onClick={() => startEdit(c)} className="text-brand-olive p-1.5 border border-brand-clay/15 bg-brand-bg hover:bg-brand-beige rounded" aria-label="Edit collection settings">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                {deleteConfirmId === c.id ? (
                  <button
                    onClick={() => {
                      onDelete(c.id);
                      setDeleteConfirmId(null);
                    }}
                    className="text-white bg-brand-terracotta hover:bg-brand-charcoal px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded"
                  >
                    Sure?
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setDeleteConfirmId(c.id);
                      setTimeout(() => setDeleteConfirmId(prev => prev === c.id ? null : prev), 3500);
                    }}
                    className="text-brand-terracotta p-1.5 border border-brand-clay/15 bg-brand-bg hover:bg-brand-beige rounded"
                    aria-label="Delete collection permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-xs" onClick={() => setIsFormOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-brand-bg max-w-lg w-full p-6 sm:p-8 rounded-3xl z-10 overflow-y-auto max-h-[85vh] border border-brand-clay/20 shadow-2xl font-sans"
            >
              <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-beige bg-brand-bg/95 border border-brand-clay/15 shadow-sm">
                <X className="w-4 h-4" />
              </button>

              <h4 className="font-serif text-xl font-bold mb-6 text-brand-charcoal">
                {editingCollection ? 'Edit Portfolio Concept' : 'New Heritage Portfolio'}
              </h4>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Portfolio ID Code</label>
                  <input type="text" value={id} disabled={!!editingCollection} onChange={(e) => setId(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta disabled:opacity-50" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Portfolio Name</label>
                    <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Bengali Title Calligraphy</label>
                    <input type="text" value={banglaName} onChange={(e) => setBanglaName(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Narrative Subtitle (English)</label>
                  <input type="text" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Historical Quote (Editorial block)</label>
                  <textarea rows={2} value={quote} onChange={(e) => setQuote(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta resize-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Concept Synopsis (Description)</label>
                  <textarea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta resize-none" />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Visual Banner Url</label>
                    <input type="text" required value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Curation Director (Curator)</label>
                    <input type="text" required value={curator} onChange={(e) => setCurator(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" />
                  </div>
                </div>

                <button type="submit" className="w-full bg-[#5B6349] hover:bg-[#2D2A26] text-brand-bg font-bold uppercase tracking-widest py-3.5 rounded-xl transition-colors mt-4 block cursor-pointer">
                  Store Portfolio Coordinates
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ====================================================
// SUB-PANEL: ORDERS PANEL (VERIFICATION & STATE HANDLES)
// ====================================================
interface OrdersPanelProps {
  orders: AdminOrder[];
  onUpdateStatus: (id: string, status: AdminOrder['status']) => void;
}

const OrdersPanel: React.FC<OrdersPanelProps> = ({ orders, onUpdateStatus }) => {
  const [selectedOrder, setSelectedOrder] = useState<AdminOrder | null>(null);

  const pendingCount = orders.filter(o => o.status === 'pending').length;
  const processingCount = orders.filter(o => o.status === 'processing').length;

  return (
    <div className="space-y-6" id="orders-admin-panel">
      <div>
        <h3 className="font-serif text-2xl font-semibold">Atelier Checkout Logs</h3>
        <p className="text-xs text-brand-clay uppercase tracking-widest mt-0.5">Manage digital transactions and craft logistics statuses</p>
      </div>

      {/* COUNTERS HEADER */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-brand-bg border border-brand-clay/15 p-4 rounded-xl text-center select-none">
          <span className="text-[9px] uppercase tracking-wider text-brand-clay font-bold font-mono">Pending verification</span>
          <span className="block font-serif text-xl font-bold mt-1 text-brand-charcoal">{pendingCount} packages</span>
        </div>
        <div className="bg-brand-bg border border-brand-clay/15 p-4 rounded-xl text-center select-none">
          <span className="text-[9px] uppercase tracking-wider text-brand-olive font-bold font-mono">Active processing</span>
          <span className="block font-serif text-xl font-bold mt-1 text-brand-charcoal">{processingCount} orders</span>
        </div>
        <div className="bg-brand-bg border border-brand-clay/15 p-4 rounded-xl text-center select-none">
          <span className="text-[9px] uppercase tracking-wider text-brand-clay font-bold font-mono">Shipped packages</span>
          <span className="block font-serif text-xl font-bold mt-1 text-brand-charcoal">{orders.filter(o => o.status === 'shipped').length} loads</span>
        </div>
        <div className="bg-brand-bg border border-brand-clay/15 p-4 rounded-xl text-center select-none">
          <span className="text-[9px] uppercase tracking-wider text-brand-olive font-bold font-mono">Successfully delivered</span>
          <span className="block font-serif text-xl font-bold mt-1 text-brand-charcoal">{orders.filter(o => o.status === 'delivered').length} curations</span>
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-brand-bg border border-brand-clay/20 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-beige/35 border-b border-brand-clay/15 text-[10px] tracking-widest text-[#555555] uppercase font-bold">
                <th className="py-4 px-6">Invoice ID</th>
                <th className="py-4 px-6">Keeper Customer</th>
                <th className="py-4 px-6">Date of Order</th>
                <th className="py-4 px-6">Total index</th>
                <th className="py-4 px-6">Logistics Status</th>
                <th className="py-4 px-6 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-clay/15 text-xs text-brand-charcoal/85">
              {orders.map((o) => (
                <tr key={o.id} className="hover:bg-brand-beige/10 transition-colors">
                  <td className="py-4 px-6 font-bold">{o.id}</td>
                  <td className="py-4 px-6">
                    <span className="font-semibold block">{o.customerName}</span>
                    <span className="text-[10px] text-brand-clay block mt-0.5">{o.customerEmail}</span>
                  </td>
                  <td className="py-4 px-6 font-mono text-[11px] text-brand-clay">{o.createdAt.slice(0, 10)} {o.createdAt.slice(11, 16)}</td>
                  <td className="py-4 px-6 font-bold">৳{o.totalAmount}</td>
                  <td className="py-4 px-6">
                    <select
                      value={o.status}
                      onChange={(e) => onUpdateStatus(o.id, e.target.value as AdminOrder['status'])}
                      className={`font-semibold text-[10px] uppercase border px-2 py-1 rounded focus:outline-none ${
                        o.status === 'delivered' ? 'bg-brand-olive/10 border-brand-olive text-brand-olive' :
                        o.status === 'cancelled' ? 'bg-brand-terracotta/10 border-brand-terracotta text-brand-terracotta' :
                        o.status === 'pending' ? 'bg-brand-clay/10 border-brand-clay text-brand-clay' :
                        'bg-brand-beige border-brand-clay text-brand-charcoal'
                      }`}
                    >
                      <option value="pending">Pending</option>
                      <option value="processing">Processing</option>
                      <option value="shipped">Shipped</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-right">
                    <button
                      onClick={() => setSelectedOrder(o)}
                      className="text-brand-charcoal hover:text-brand-terracotta bg-brand-beige/40 p-1.5 border border-brand-clay/15 hover:bg-brand-beige rounded inline-flex items-center gap-1 font-semibold"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Review</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL DRAWER OVERLAY */}
      <AnimatePresence>
        {selectedOrder && (
          <div className="fixed inset-0 z-55 flex items-center justify-end">
            <div className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-xs" onClick={() => setSelectedOrder(null)} />
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="relative bg-brand-bg w-full max-w-md h-full p-6 sm:p-8 overflow-y-auto border-l border-brand-clay/20 shadow-2xl flex flex-col justify-between font-sans"
            >
              <div>
                <button onClick={() => setSelectedOrder(null)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-beige">
                  <X className="w-4.5 h-4.5" />
                </button>

                <span className="text-[9px] uppercase tracking-widest text-[#B49275] font-mono font-bold block mb-1">Invoice specification</span>
                <h4 className="font-serif text-xl sm:text-2xl font-bold mb-6 text-brand-charcoal">{selectedOrder.id}</h4>

                <div className="space-y-4 text-xs sm:text-sm">
                  {/* Status Indicator banner */}
                  <div className="bg-brand-beige/35 border border-brand-clay/15 rounded-xl p-3 flex justify-between select-none items-center">
                    <span className="text-[10px] uppercase font-bold text-brand-clay tracking-wider">Logistics status:</span>
                    <span className="bg-brand-charcoal text-brand-bg text-[9px] font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                      {selectedOrder.status}
                    </span>
                  </div>

                  {/* Customer Block */}
                  <div className="space-y-2 border-b border-brand-clay/15 pb-4">
                    <h5 className="font-serif text-sm font-bold text-brand-charcoal">Registrant coordinates:</h5>
                    <div className="text-brand-charcoal/80 space-y-1">
                      <p>Name: <strong>{selectedOrder.customerName}</strong></p>
                      <p>Email: <a href={`mailto:${selectedOrder.customerEmail}`} className="underline text-brand-terracotta">{selectedOrder.customerEmail}</a></p>
                      <p>Shipping Address: <strong>{selectedOrder.shippingAddress}</strong></p>
                    </div>
                  </div>

                  {/* Products Block */}
                  <div className="space-y-3">
                    <h5 className="font-serif text-sm font-bold text-brand-charcoal">Purchased craft artifacts:</h5>
                    <div className="divide-y divide-brand-clay/10">
                      {selectedOrder.products.map((item, idx) => (
                        <div key={idx} className="py-2.5 flex items-center justify-between gap-3 font-sans">
                          <div className="flex items-center gap-2.5">
                            <img src={item.product?.image} className="w-8 h-10 object-cover rounded bg-brand-beige/50 border border-brand-clay/15" />
                            <div>
                              <span className="font-semibold block line-clamp-1">{item.product?.name}</span>
                              <span className="text-[10px] text-brand-clay block italic">{item.product?.banglaName} × {item.quantity} units</span>
                            </div>
                          </div>
                          <span className="font-bold text-brand-charcoal shrink-0">৳{item.product?.price * item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Action and Checkout details foot block */}
              <div className="border-t border-brand-clay/15 pt-6 bg-brand-bg mt-6">
                <div className="flex justify-between items-baseline mb-6">
                  <span className="text-brand-clay font-semibold">Total Invoice realized:</span>
                  <span className="font-serif text-xl sm:text-2xl font-bold text-brand-charcoal">৳{selectedOrder.totalAmount}</span>
                </div>
                
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => { onUpdateStatus(selectedOrder.id, 'shipped'); setSelectedOrder(null); }}
                    className="bg-[#5B6349] hover:bg-brand-charcoal text-brand-bg font-bold uppercase text-[10px] tracking-wider py-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Mark Shipped
                  </button>
                  <button
                    onClick={() => { onUpdateStatus(selectedOrder.id, 'delivered'); setSelectedOrder(null); }}
                    className="bg-brand-charcoal hover:bg-brand-olive text-brand-bg font-bold uppercase text-[10px] tracking-wider py-3 rounded-lg transition-colors cursor-pointer"
                  >
                    Mark Delivered
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ====================================================
// SUB-PANEL: CUSTOMER CRM DIRECTORY PANEL
// ====================================================
interface CustomersProps {
  users: UserProfile[];
  orders: AdminOrder[];
  onUpdateStatus: (uid: string, status: UserProfile['status']) => void;
}

const CustomersDirectoryPanel: React.FC<CustomersProps> = ({ users, orders, onUpdateStatus }) => {
  const [search, setSearch] = useState('');

  const customersOnly = users.filter(u => u.role === 'customer');
  const filtered = customersOnly.filter(c => c.name.toLowerCase().includes(search.toLowerCase()) || c.email.toLowerCase().includes(search.toLowerCase()));

  // Count order counts per customer helper
  const getCustomerStats = (email: string) => {
    const userOrders = orders.filter(o => o.customerEmail.toLowerCase() === email.toLowerCase());
    const totalSpent = userOrders.reduce((sum, o) => o.status !== 'cancelled' ? sum + o.totalAmount : sum, 0);
    return { orderCount: userOrders.length, totalSpent };
  };

  return (
    <div className="space-y-6" id="customers-crm-panel">
      <div>
        <h3 className="font-serif text-2xl font-semibold">Keeper Registrants Directory</h3>
        <p className="text-xs text-brand-clay uppercase tracking-widest mt-0.5">Track loyal customers and monitor spending histories</p>
      </div>

      <div className="bg-brand-bg border border-brand-clay/20 p-4 rounded-xl flex items-center gap-3">
        <Search className="w-4 h-4 text-brand-clay shrink-0" />
        <input
          type="text"
          placeholder="Search registered Keepers by name/email coordinates..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="bg-transparent w-full border-0 text-xs sm:text-sm focus:outline-none placeholder-brand-clay"
        />
      </div>

      <div className="bg-brand-bg border border-brand-clay/20 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-brand-beige/35 border-b border-brand-clay/15 text-[10px] tracking-widest text-[#555555] uppercase font-bold">
                <th className="py-4 px-6">Keeper Name</th>
                <th className="py-4 px-6">Date Registered</th>
                <th className="py-4 px-6">Total checkouts volume</th>
                <th className="py-4 px-6">Spent Value</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Access Block</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-clay/15 text-xs text-brand-charcoal/85">
              {filtered.map((c) => {
                const stats = getCustomerStats(c.email);
                return (
                  <tr key={c.uid} className="hover:bg-brand-beige/10 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-brand-beige/70 font-bold border border-brand-clay/15 flex items-center justify-center font-serif text-xs text-brand-terracotta">
                          {c.name.slice(0, 1)}
                        </div>
                        <div>
                          <span className="font-bold block">{c.name}</span>
                          <span className="text-[10px] text-brand-clay block mt-0.5">{c.email}</span>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-brand-clay font-mono">{c.createdAt.slice(0, 10)}</td>
                    <td className="py-4 px-6 font-semibold select-none">{stats.orderCount} orders</td>
                    <td className="py-4 px-6 font-bold text-brand-charcoal">৳{stats.totalSpent} realized</td>
                    <td className="py-4 px-6">
                      <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded select-none ${
                        c.status === 'active' ? 'bg-[#5B6349]/15 text-[#4B5634]' : 'bg-brand-terracotta/15 text-brand-terracotta'
                      }`}>
                        {c.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      {c.status === 'active' ? (
                        <button
                          onClick={() => { if (confirm('Suspend access for this registered customer?')) onUpdateStatus(c.uid, 'suspended'); }}
                          className="text-brand-terracotta hover:underline font-mono text-[10px] uppercase font-bold cursor-pointer"
                        >
                          Suspend Access
                        </button>
                      ) : (
                        <button
                          onClick={() => onUpdateStatus(c.uid, 'active')}
                          className="text-brand-olive hover:underline font-mono text-[10px] uppercase font-bold cursor-pointer"
                        >
                          Reinstate Access
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


// ====================================================
// SUB-PANEL: JOURNAL ARTICLES BLOG CRUD
// ====================================================
interface JournalProps {
  articles: JournalArticle[];
  onSave: (article: JournalArticle) => void;
  onDelete: (id: string) => void;
}

const JournalPostCrudPanel: React.FC<JournalProps> = ({ articles, onSave, onDelete }) => {
  const [editingPost, setEditingPost] = useState<JournalArticle | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  // Form Fields
  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [banglaTitle, setBanglaTitle] = useState('');
  const [category, setCategory] = useState('Craftsmanship');
  const [excerpt, setExcerpt] = useState('');
  const [author, setAuthor] = useState('');
  const [image, setImage] = useState('');
  const [firstPara, setFirstPara] = useState('');
  const [secondPara, setSecondPara] = useState('');

  const startEdit = (a: JournalArticle) => {
    setEditingPost(a);
    setId(a.id);
    setTitle(a.title);
    setBanglaTitle(a.banglaTitle);
    setCategory(a.category);
    setExcerpt(a.excerpt);
    setAuthor(a.author);
    setImage(a.image);
    setFirstPara(a.content[0] || '');
    setSecondPara(a.content[1] || '');
    setIsFormOpen(true);
  };

  const startAdd = () => {
    setEditingPost(null);
    setId('story-' + Date.now());
    setTitle('');
    setBanglaTitle('');
    setCategory('Craftsmanship');
    setExcerpt('');
    setAuthor('Atelier Director');
    setImage('https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800');
    setFirstPara('');
    setSecondPara('');
    setIsFormOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !image) return;

    onSave({
      id,
      title,
      banglaTitle,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      category,
      readTime: '6 min read',
      excerpt,
      content: [firstPara, secondPara].filter(Boolean),
      image,
      author,
    });
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6" id="journal-admin-panel">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-serif text-2xl font-semibold">Atelier Chronicle Journal Pages</h3>
          <p className="text-xs text-brand-clay uppercase tracking-widest mt-0.5">Write research, designers manifesto, and craft history pieces</p>
        </div>
        
        <button
          onClick={startAdd}
          className="bg-[#5B6349] hover:bg-brand-charcoal text-white px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Plus className="w-4.5 h-4.5" />
          <span>New Article</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {articles.map(a => (
          <div key={a.id} className="bg-brand-bg border border-brand-clay/20 p-5 rounded-2xl shadow-xs flex flex-col justify-between">
            <div className="space-y-3">
              <div className="flex justify-between items-center text-[10px] font-mono text-brand-olive uppercase font-bold select-none">
                <span>{a.category}</span>
                <span>{a.date}</span>
              </div>
              <h4 className="font-serif text-lg font-bold text-brand-charcoal line-clamp-1">{a.title}</h4>
              <p className="font-serif text-sm italic text-brand-terracotta">{a.banglaTitle}</p>
              <p className="text-xs text-brand-charcoal/70 line-clamp-3 leading-relaxed">{a.excerpt}</p>
            </div>

            <div className="border-t border-brand-clay/15 mt-5 pt-4 flex justify-between items-center text-xs">
              <span className="text-brand-clay">By: <strong>{a.author}</strong></span>
              <div className="space-x-1 flex">
                <button onClick={() => startEdit(a)} className="text-brand-olive p-1.5 border border-brand-clay/15 bg-brand-bg hover:bg-brand-beige rounded" aria-label="Edit journal post">
                  <Edit className="w-3.5 h-3.5" />
                </button>
                {deleteConfirmId === a.id ? (
                  <button
                    onClick={() => {
                      onDelete(a.id);
                      setDeleteConfirmId(null);
                    }}
                    className="text-white bg-brand-terracotta hover:bg-brand-charcoal px-2 py-0.5 text-[9px] font-bold tracking-wider uppercase rounded"
                  >
                    Sure?
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setDeleteConfirmId(a.id);
                      setTimeout(() => setDeleteConfirmId(prev => prev === a.id ? null : prev), 3500);
                    }}
                    className="text-brand-terracotta p-1.5 border border-brand-clay/15 bg-brand-bg hover:bg-brand-beige rounded"
                    aria-label="Delete journal post permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-xs" onClick={() => setIsFormOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-brand-bg max-w-2xl w-full p-6 sm:p-8 rounded-3xl z-10 overflow-y-auto max-h-[85vh] border border-brand-clay/20 shadow-2xl font-sans"
            >
              <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-beige bg-brand-bg/95 border border-brand-clay/15 shadow-sm">
                <X className="w-4.5 h-4.5" />
              </button>

              <h4 className="font-serif text-xl sm:text-2xl font-semibold mb-6">
                {editingPost ? 'Edit Journal Entry' : 'Draft New Journal Entry'}
              </h4>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Journal Title</label>
                    <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Bengali Title Script</label>
                    <input type="text" value={banglaTitle} onChange={(e) => setBanglaTitle(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Medium Theme Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta">
                      <option value="Craftsmanship">Craftsmanship</option>
                      <option value="Design Philosophy">Design Philosophy</option>
                      <option value="Heritage Preservation">Heritage Preservation</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Author Name Coordinates</label>
                    <input type="text" value={author} onChange={(e) => setAuthor(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Featured Photo Url</label>
                    <input type="text" required value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Brief Excerpt/Snippet Summary</label>
                  <textarea rows={2} value={excerpt} onChange={(e) => setExcerpt(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta resize-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Article First Paragraph</label>
                  <textarea rows={4} required value={firstPara} onChange={(e) => setFirstPara(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta resize-none" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Article Second Paragraph</label>
                  <textarea rows={4} value={secondPara} onChange={(e) => setSecondPara(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta resize-none" />
                </div>

                <button type="submit" className="w-full bg-[#5B6349] hover:bg-[#2D2A26] text-brand-bg font-bold uppercase tracking-widest py-3.5 rounded-xl transition-colors mt-4 block cursor-pointer">
                  Save and Publish Column
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};


// ====================================================
// SUB-PANEL: MEDIA LIBRARY MANAGER (SIM_STORAGE)
// ====================================================
interface MediaProps {
  mediaItems: MediaItem[];
  onUpload: (name: string, url: string, folder: MediaItem['folder'], size: number, type: string) => void;
  onDelete: (id: string) => void;
}

const MediaLibraryPanel: React.FC<MediaProps> = ({ mediaItems, onUpload, onDelete }) => {
  const [selectedFolder, setSelectedFolder] = useState<MediaItem['folder'] | 'all'>('all');
  const [simName, setSimName] = useState('');
  const [simUrl, setSimUrl] = useState('');
  const [simFolder, setSimFolder] = useState<MediaItem['folder']>('curations');

  const folders: { id: MediaItem['folder'] | 'all'; label: string }[] = [
    { id: 'all', label: 'All Folders' },
    { id: 'curations', label: 'Saree Curations' },
    { id: 'decor', label: 'Clay Pottery & Decor' },
    { id: 'banners', label: 'Campaign Banners' },
    { id: 'general', label: 'General Assets' },
  ];

  const handleSimUpload = (e: React.FormEvent) => {
    e.preventDefault();
    if (!simName || !simUrl) return;
    onUpload(simName, simUrl, simFolder, Math.floor(400000 + Math.random() * 900000), 'image/png');
    setSimName('');
    setSimUrl('');
  };

  const filtered = selectedFolder === 'all' ? mediaItems : mediaItems.filter(m => m.folder === selectedFolder);

  return (
    <div className="space-y-6" id="media-library-panel">
      <div>
        <h3 className="font-serif text-2xl font-semibold">Atelier Media Asset Library</h3>
        <p className="text-xs text-brand-clay uppercase tracking-widest mt-0.5">Simulated Firebase Storage integration module</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* LEFT SIMULATED UPLOAD FORM */}
        <div className="lg:col-span-4 bg-brand-bg border border-brand-clay/20 p-5 rounded-2xl shadow-xs">
          <h4 className="font-serif text-base font-semibold mb-3">Expedite Image Storage</h4>
          <form onSubmit={handleSimUpload} className="space-y-4 text-xs font-sans">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Asset Name</label>
              <input type="text" required value={simName} onChange={(e) => setSimName(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2" placeholder="bangles_shakuntala.png" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Direct URL Coordinate</label>
              <input type="text" required value={simUrl} onChange={(e) => setSimUrl(e.target.value)} className="w-full bg-[#FAF7F5] border border-brand-clay/40 rounded-xl px-3 py-2 pr-10" placeholder="https://images.unsplash.com/..." />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Storage Bucket Folder</label>
              <select value={simFolder} onChange={(e) => setSimFolder(e.target.value as MediaItem['folder'])} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 pr-10">
                <option value="curations">Curations</option>
                <option value="decor">Decor</option>
                <option value="banners">Banners</option>
                <option value="general">General</option>
              </select>
            </div>
            <button type="submit" className="w-full bg-brand-charcoal hover:bg-brand-terracotta text-white py-3 rounded-lg text-xs tracking-widest uppercase font-bold transition-colors cursor-pointer block">
              Store File in Bucket
            </button>
          </form>
        </div>

        {/* RIGHT MEDIA STREAM GRID */}
        <div className="lg:col-span-8 space-y-6">
          {/* Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-brand-bg border border-brand-clay/15 p-1 px-1.5 rounded-xl justify-start items-center">
            {folders.map(f => (
              <button
                key={f.id}
                onClick={() => setSelectedFolder(f.id)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-sans font-bold tracking-wider uppercase transition-colors ${
                  selectedFolder === f.id ? 'bg-[#5B6349] text-brand-bg' : 'text-brand-clay hover:text-brand-charcoal'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Grid display */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {filtered.map(m => (
              <div key={m.id} className="bg-brand-bg border border-brand-clay/15 rounded-xl overflow-hidden shadow-xs flex flex-col justify-between group relative">
                <div className="aspect-square relative bg-brand-beige/35 border-b border-brand-clay/15">
                  <img src={m.url} alt={m.name} className="w-full h-full object-cover" />
                  <button
                    onClick={() => onDelete(m.id)}
                    className="absolute top-2 right-2 p-1.5 rounded-full bg-brand-charcoal/80 text-brand-bg hover:bg-brand-terracotta transition-colors shadow-md opacity-0 group-hover:opacity-100"
                    aria-label="Delete permanent media coordinate"
                  >
                    <Trash2 className="w-3" />
                  </button>
                </div>
                <div className="p-3 text-[10.5px]">
                  <span className="font-bold block truncate text-brand-charcoal">{m.name}</span>
                  <span className="text-[9.5px] text-brand-clay font-mono block mt-0.5">{m.size} — {m.folder}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};


// ====================================================
// SUB-PANEL: INCOMING CLIENT MESSAGES
// ====================================================
interface MessagesProps {
  messages: ContactMessage[];
  onReply: (id: string) => void;
  onDelete: (id: string) => void;
}

const MessagesPanel: React.FC<MessagesProps> = ({ messages, onReply, onDelete }) => {
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  return (
    <div className="space-y-6" id="messages-panel">
      <div>
        <h3 className="font-serif text-2xl font-semibold">Curation Society Inquiries</h3>
        <p className="text-xs text-brand-clay uppercase tracking-widest mt-0.5">Read transmissions from design collectors & general questions</p>
      </div>

      <div className="space-y-4">
        {messages.map(m => (
          <div key={m.id} className="bg-brand-bg border border-brand-clay/20 p-5 rounded-2xl relative shadow-xs flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex justify-between items-center text-[10.5px] select-none text-brand-clay">
                <span className="font-bold">Sender: <a href={`mailto:${m.email}`} className="underline text-brand-terracotta">{m.name}</a></span>
                <span>Date: {m.createdAt.slice(0, 10)}</span>
              </div>
              <h4 className="font-serif text-base font-semibold text-brand-charcoal">Sub: {m.subject}</h4>
              <p className="text-xs sm:text-sm text-brand-charcoal/85 leading-relaxed text-justify-custom font-sans p-3 bg-brand-beige/20 border border-brand-clay/10 rounded-xl">
                {m.message}
              </p>
            </div>

            <div className="border-t border-brand-clay/15 mt-4 pt-4 flex justify-between items-center text-xs">
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded select-none ${
                m.replied ? 'bg-[#5B6349]/15 text-[#4B5634]' : 'bg-[#EFAD1E]/15 text-[#CFA71F]'
              }`}>
                {m.replied ? '✔ Replied' : 'Pending Curator Reply'}
              </span>

              <div className="space-x-1 flex">
                {!m.replied && (
                  <button onClick={() => onReply(m.id)} className="bg-[#5B6349] text-brand-bg hover:bg-brand-charcoal py-1.5 px-3 rounded text-[10px] font-bold uppercase transition-colors cursor-pointer">
                    Simulate Dispatch Reply
                  </button>
                )}
                {deleteConfirmId === m.id ? (
                  <button
                    onClick={() => {
                      onDelete(m.id);
                      setDeleteConfirmId(null);
                    }}
                    className="text-white bg-brand-terracotta hover:bg-brand-charcoal px-2 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded"
                  >
                    Sure?
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setDeleteConfirmId(m.id);
                      setTimeout(() => setDeleteConfirmId(prev => prev === m.id ? null : prev), 3500);
                    }}
                    className="text-brand-terracotta p-1.5 border border-brand-clay/15 hover:bg-brand-beige rounded"
                    aria-label="Delete message permanently"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


// ====================================================
// SUB-PANEL: DETAILED ANALYTICS (CUSTOM RESPONSIVE CHARTS)
// ====================================================
interface AnalyticsProps {
  products: Product[];
  orders: AdminOrder[];
}

const AnalyticsDetailedView: React.FC<AnalyticsProps> = ({ products, orders }) => {
  return (
    <div className="space-y-8" id="analytics-panel">
      <div>
        <h3 className="font-serif text-2xl font-semibold">Atelier Analytics Engine</h3>
        <p className="text-xs text-brand-clay uppercase tracking-widest mt-0.5">Examine seasonal design conversions and order metrics</p>
      </div>

      {/* THREE CARDS ROW */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-brand-bg border border-brand-clay/20 p-5 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-brand-clay tracking-wider">Conversion rate index</span>
          <span className="font-serif text-2xl sm:text-3xl font-bold block mt-1">3.85%</span>
          <p className="text-[10px] text-brand-olive mt-1">✔ Industry leading for heritage boutiques (+0.4% from May)</p>
        </div>
        <div className="bg-brand-bg border border-brand-clay/20 p-5 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-brand-clay tracking-wider">Average Basket coordinate</span>
          <span className="font-serif text-2xl sm:text-3xl font-bold block mt-1">৳330</span>
          <p className="text-[10px] text-brand-clay mt-1">Saree checkouts drive high basket densities.</p>
        </div>
        <div className="bg-brand-bg border border-brand-clay/20 p-5 rounded-2xl">
          <span className="text-[10px] uppercase font-bold text-brand-clay tracking-wider">Visitor coordinates (June 2026)</span>
          <span className="font-serif text-2xl sm:text-3xl font-bold block mt-1">1,940 Keepers</span>
          <p className="text-[10px] text-[#5B6349] mt-1">94% Organic navigation traffic reported.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Sales by category */}
        <div className="lg:col-span-6 bg-brand-bg border border-brand-clay/20 p-6 sm:p-8 rounded-3xl">
          <h4 className="font-serif text-base font-bold mb-4">Volume Distribution by Category</h4>
          <svg className="w-full h-48" viewBox="0 0 200 100">
            {/* Real responsive donut graph or bar visualizer */}
            <rect x="10" y="20" width="35" height="60" fill="#4B5634" rx="3" />
            <rect x="55" y="40" width="35" height="40" fill="#C46E4E" rx="3" />
            <rect x="100" y="55" width="35" height="25" fill="#8E857B" rx="3" />
            <rect x="145" y="70" width="35" height="10" fill="#2D2A26" rx="3" />
            
            <text x="15" y="92" fontSize="6.5" fill="#555" fontWeight="semibold">Sarees</text>
            <text x="60" y="92" fontSize="6.5" fill="#555" fontWeight="semibold">Jewels</text>
            <text x="105" y="92" fontSize="6.5" fill="#555" fontWeight="semibold">Decor</text>
            <text x="150" y="92" fontSize="6.5" fill="#555" fontWeight="semibold">Bangles</text>

            <text x="21" y="16" fontSize="7" fill="#4B5634" fontWeight="bold">60%</text>
            <text x="66" y="36" fontSize="7" fill="#C46E4E" fontWeight="bold">25%</text>
            <text x="111" y="51" fontSize="7" fill="#8E857B" fontWeight="bold">10%</text>
            <text x="158" y="66" fontSize="7" fill="#2D2A26" fontWeight="bold">5%</text>
          </svg>
        </div>

        {/* Analytics Insights block */}
        <div className="lg:col-span-6 bg-brand-bg border border-brand-clay/20 p-6 sm:p-8 rounded-3xl flex flex-col justify-between">
          <div>
            <span className="text-[10px] tracking-widest uppercase text-brand-olive font-bold">Atelier Observations</span>
            <h4 className="font-serif text-lg font-bold text-brand-charcoal mt-1 mb-3">June design trends summary</h4>
            <ul className="space-y-3 text-xs text-brand-charcoal/80 leading-relaxed list-disc pl-4 font-sans">
              <li><strong>The Nilufer Silk Saree</strong> is our highest grossing asset log, accounting for 60% of absolute realized revenue.</li>
              <li>Sourcing coordinates indicate a 40% surge in inquiries regarding <strong>Matir Trishna clay pottery pieces</strong>.</li>
              <li>Organic conversions peaks at 21:00 UTC (BD standard night hours) coinciding with Digital Catalog dispatch.</li>
            </ul>
          </div>
          <p className="text-[10.5px] text-brand-clay italic border-t border-brand-clay/15 pt-4 mt-6">
            Data compiles from Google Firebase and custom cloud logs daily at 00:00 UTC.
          </p>
        </div>
      </div>
    </div>
  );
};


// ====================================================
// SUB-PANEL: HOME PAGE EDITOR PANEL
// ====================================================
interface HomeEditorPanelProps {
  initialSettings: SiteSettings;
  onSave: (settings: SiteSettings) => void;
}

const HomeEditorPanel: React.FC<HomeEditorPanelProps> = ({ initialSettings, onSave }) => {
  const [heroTitleLine1, setHeroTitleLine1] = useState(initialSettings.heroTitleLine1 || 'Archived Loom.');
  const [heroTitleLine2, setHeroTitleLine2] = useState(initialSettings.heroTitleLine2 || 'Slow Crafted.');
  const [heroDescription, setHeroDescription] = useState(initialSettings.heroDescription || '');
  const [logoUrl, setLogoUrl] = useState(initialSettings.logoUrl || '');
  const [philosophyPretitle, setPhilosophyPretitle] = useState(initialSettings.philosophyPretitle || '');
  const [philosophyTitle1, setPhilosophyTitle1] = useState(initialSettings.philosophyTitle1 || '');
  const [philosophyTitle2, setPhilosophyTitle2] = useState(initialSettings.philosophyTitle2 || '');
  const [philosophyTitle3, setPhilosophyTitle3] = useState(initialSettings.philosophyTitle3 || '');
  const [philosophyDescription, setPhilosophyDescription] = useState(initialSettings.philosophyDescription || '');
  const [philosophyCardTitle, setPhilosophyCardTitle] = useState(initialSettings.philosophyCardTitle || '');
  const [philosophyCardSubtitle, setPhilosophyCardSubtitle] = useState(initialSettings.philosophyCardSubtitle || '');
  const [workflowPretitle, setWorkflowPretitle] = useState(initialSettings.workflowPretitle || '');
  const [workflowTitle, setWorkflowTitle] = useState(initialSettings.workflowTitle || '');
  const [workflowSubtitle, setWorkflowSubtitle] = useState(initialSettings.workflowSubtitle || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      ...initialSettings,
      heroTitleLine1,
      heroTitleLine2,
      heroDescription,
      logoUrl,
      philosophyPretitle,
      philosophyTitle1,
      philosophyTitle2,
      philosophyTitle3,
      philosophyDescription,
      philosophyCardTitle,
      philosophyCardSubtitle,
      workflowPretitle,
      workflowTitle,
      workflowSubtitle
    });
  };

  return (
    <div className="space-y-6" id="home-editor-panel">
      <div>
        <h3 className="font-serif text-2xl font-semibold text-[#2D2A26]">Home Page Content Editor</h3>
        <p className="text-xs text-brand-clay uppercase tracking-widest mt-0.5">Edit almost every text line, subheaders, quotes and logos on your home feed</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-brand-bg border border-brand-clay/20 p-6 sm:p-10 rounded-2xl relative shadow-xs font-sans text-xs sm:text-sm space-y-6">
        <CornerOrnament position="top-right" />
        <CornerOrnament position="bottom-left" />

        {/* HERO SECTION */}
        <div className="space-y-4">
          <h4 className="font-serif text-base font-semibold pb-2 border-b border-brand-clay/15 text-brand-charcoal">01 // Hero Banner Settings</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Hero Title Line 1 (Bold Text)</label>
              <input type="text" value={heroTitleLine1} onChange={(e) => setHeroTitleLine1(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Hero Title Line 2 (Terracotta Italic)</label>
              <input type="text" value={heroTitleLine2} onChange={(e) => setHeroTitleLine2(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Hero Creative Description</label>
            <textarea rows={3} value={heroDescription} onChange={(e) => setHeroDescription(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 resize-none focus:outline-none" />
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Boutique Brand Logo Url (Global logo, used in header & footer)</label>
            <input type="text" value={logoUrl} onChange={(e) => setLogoUrl(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
          </div>
        </div>

        {/* PHILOSOPHY SECTION */}
        <div className="space-y-4 pt-4">
          <h4 className="font-serif text-base font-semibold pb-2 border-b border-brand-clay/15 text-brand-charcoal">02 // Brand Philosophy Settings</h4>
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Philosophy Pretitle Tag</label>
              <input type="text" value={philosophyPretitle} onChange={(e) => setPhilosophyPretitle(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Title Row Line 1</label>
              <input type="text" value={philosophyTitle1} onChange={(e) => setPhilosophyTitle1(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Title Row Line 2</label>
              <input type="text" value={philosophyTitle2} onChange={(e) => setPhilosophyTitle2(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Title Row Line 3</label>
              <input type="text" value={philosophyTitle3} onChange={(e) => setPhilosophyTitle3(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Philosophy Manifesto Description</label>
            <textarea rows={3} value={philosophyDescription} onChange={(e) => setPhilosophyDescription(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 resize-none focus:outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Right Card Decorative Title (e.g. মাটির তৃষ্ণা)</label>
              <input type="text" value={philosophyCardTitle} onChange={(e) => setPhilosophyCardTitle(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Right Card Description Subtitle</label>
              <input type="text" value={philosophyCardSubtitle} onChange={(e) => setPhilosophyCardSubtitle(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* WORKFLOW FLOW CHART SECTION */}
        <div className="space-y-4 pt-4">
          <h4 className="font-serif text-base font-semibold pb-2 border-b border-brand-clay/15 text-brand-charcoal">03 // Harvest Workflow Segment</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Segment Pretitle Tag</label>
              <input type="text" value={workflowPretitle} onChange={(e) => setWorkflowPretitle(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Segment Title</label>
              <input type="text" value={workflowTitle} onChange={(e) => setWorkflowTitle(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Segment Supporting Subtitle</label>
              <input type="text" value={workflowSubtitle} onChange={(e) => setWorkflowSubtitle(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
          </div>
        </div>

        <button type="submit" className="w-full bg-[#5B6349] hover:bg-brand-charcoal text-brand-bg py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors shadow-md block cursor-pointer">
          Publish Home Page Content Layout
        </button>
      </form>
    </div>
  );
};


// ====================================================
// SUB-PANEL: ABOUT PAGE EDITOR PANEL
// ====================================================
interface AboutEditorProps {
  initialSettings: AboutSettings;
  onSave: (settings: AboutSettings) => void;
}

const AboutEditorPanel: React.FC<AboutEditorProps> = ({ initialSettings, onSave }) => {
  const [pretitle, setPretitle] = useState(initialSettings.pretitle || '');
  const [titleLine1, setTitleLine1] = useState(initialSettings.titleLine1 || '');
  const [titleLine2, setTitleLine2] = useState(initialSettings.titleLine2 || '');
  const [quote, setQuote] = useState(initialSettings.quote || '');
  const [image, setImage] = useState(initialSettings.image || '');
  const [badge, setBadge] = useState(initialSettings.badge || '');
  const [manifestoTitle, setManifestoTitle] = useState(initialSettings.manifestoTitle || '');
  const [manifestoPara1, setManifestoPara1] = useState(initialSettings.manifestoPara1 || '');
  const [manifestoPara2, setManifestoPara2] = useState(initialSettings.manifestoPara2 || '');
  const [manifestoQuote, setManifestoQuote] = useState(initialSettings.manifestoQuote || '');
  
  const [pillar1Title, setPillar1Title] = useState(initialSettings.pillar1Title || '');
  const [pillar1Desc, setPillar1Desc] = useState(initialSettings.pillar1Desc || '');
  const [pillar1Badge, setPillar1Badge] = useState(initialSettings.pillar1Badge || '');

  const [pillar2Title, setPillar2Title] = useState(initialSettings.pillar2Title || '');
  const [pillar2Desc, setPillar2Desc] = useState(initialSettings.pillar2Desc || '');
  const [pillar2Badge, setPillar2Badge] = useState(initialSettings.pillar2Badge || '');

  const [pillar3Title, setPillar3Title] = useState(initialSettings.pillar3Title || '');
  const [pillar3Desc, setPillar3Desc] = useState(initialSettings.pillar3Desc || '');
  const [pillar3Badge, setPillar3Badge] = useState(initialSettings.pillar3Badge || '');

  const [earthPretitle, setEarthPretitle] = useState(initialSettings.earthPretitle || '');
  const [earthTitle, setEarthTitle] = useState(initialSettings.earthTitle || '');
  const [earthDesc, setEarthDesc] = useState(initialSettings.earthDesc || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({
      pretitle,
      titleLine1,
      titleLine2,
      quote,
      image,
      badge,
      manifestoTitle,
      manifestoPara1,
      manifestoPara2,
      manifestoQuote,
      pillar1Title,
      pillar1Desc,
      pillar1Badge,
      pillar2Title,
      pillar2Desc,
      pillar2Badge,
      pillar3Title,
      pillar3Desc,
      pillar3Badge,
      earthTitle,
      earthDesc,
      earthPretitle
    });
  };

  return (
    <div className="space-y-6" id="about-editor-panel">
      <div>
        <h3 className="font-serif text-2xl font-semibold text-[#2D2A26]">About Page Narrative Editor</h3>
        <p className="text-xs text-brand-clay uppercase tracking-widest mt-0.5 font-sans">Edit every single heading, quote, banner image and physical paragraph of your About Storytelling view</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-brand-bg border border-brand-clay/20 p-6 sm:p-10 rounded-2xl relative shadow-xs font-sans text-xs sm:text-sm space-y-6">
        <CornerOrnament position="top-right" />
        <CornerOrnament position="bottom-left" />

        {/* HERO STORY BOARD */}
        <div className="space-y-4">
          <h4 className="font-serif text-base font-semibold pb-2 border-b border-brand-clay/15 text-brand-charcoal">01 // Storyboard Landing Section</h4>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Pretitle Tagline</label>
              <input type="text" value={pretitle} onChange={(e) => setPretitle(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Display Title Line 1</label>
              <input type="text" value={titleLine1} onChange={(e) => setTitleLine1(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Display Title Line 2</label>
              <input type="text" value={titleLine2} onChange={(e) => setTitleLine2(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Italic Headline Quote</label>
            <textarea rows={2} value={quote} onChange={(e) => setQuote(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 resize-none focus:outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Narrative Co-ordinate Banner Image (Url)</label>
              <input type="text" value={image} onChange={(e) => setImage(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Text Badge Overlay (e.g. ESTD. 2026 / DHAKA)</label>
              <input type="text" value={badge} onChange={(e) => setBadge(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
          </div>
        </div>

        {/* THE MANIFESTO */}
        <div className="space-y-4 pt-4">
          <h4 className="font-serif text-base font-semibold pb-2 border-b border-brand-clay/15 text-brand-charcoal">02 // The Manifesto Block</h4>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Manifesto Title</label>
            <input type="text" value={manifestoTitle} onChange={(e) => setManifestoTitle(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Manifesto Column 1 Paragraph</label>
              <textarea rows={4} value={manifestoPara1} onChange={(e) => setManifestoPara1(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 resize-none focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Manifesto Column 2 Paragraph</label>
              <textarea rows={4} value={manifestoPara2} onChange={(e) => setManifestoPara2(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 resize-none focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Manifesto Closing Quote (Italic Callout)</label>
            <input type="text" value={manifestoQuote} onChange={(e) => setManifestoQuote(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
          </div>
        </div>

        {/* PILLARS */}
        <div className="space-y-4 pt-4">
          <h4 className="font-serif text-base font-semibold pb-2 border-b border-brand-clay/15 text-brand-charcoal">03 // The Three Core Pillars</h4>
          
          {/* Pillar 1 */}
          <div className="p-4 rounded-xl border border-brand-clay/15 bg-brand-beige/25 space-y-3">
            <h5 className="font-serif text-xs font-bold text-brand-olive uppercase">Pillar 01</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-[#555555] mb-1">Title</label>
                <input type="text" value={pillar1Title} onChange={(e) => setPillar1Title(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-1.5 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-[#555555] mb-1">Badge Tag</label>
                <input type="text" value={pillar1Badge} onChange={(e) => setPillar1Badge(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-1.5 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-bold tracking-widest uppercase text-[#555555] mb-1">Description Paragraph</label>
              <textarea rows={2} value={pillar1Desc} onChange={(e) => setPillar1Desc(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-1.5 resize-none focus:outline-none" />
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 rounded-xl border border-brand-clay/15 bg-brand-beige/25 space-y-3">
            <h5 className="font-serif text-xs font-bold text-brand-olive uppercase">Pillar 02</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-[#555555] mb-1">Title</label>
                <input type="text" value={pillar2Title} onChange={(e) => setPillar2Title(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-1.5 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-[#555555] mb-1">Badge Tag</label>
                <input type="text" value={pillar2Badge} onChange={(e) => setPillar2Badge(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-1.5 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-bold tracking-widest uppercase text-[#555555] mb-1">Description Paragraph</label>
              <textarea rows={2} value={pillar2Desc} onChange={(e) => setPillar2Desc(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-1.5 resize-none focus:outline-none" />
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 rounded-xl border border-brand-clay/15 bg-brand-beige/25 space-y-3">
            <h5 className="font-serif text-xs font-bold text-[#5B6349] uppercase">Pillar 03</h5>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-[#555555] mb-1">Title</label>
                <input type="text" value={pillar3Title} onChange={(e) => setPillar3Title(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-1.5 focus:outline-none" />
              </div>
              <div>
                <label className="block text-[9px] font-bold tracking-widest uppercase text-[#555555] mb-1">Badge Tag</label>
                <input type="text" value={pillar3Badge} onChange={(e) => setPillar3Badge(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-1.5 focus:outline-none" />
              </div>
            </div>
            <div>
              <label className="block text-[9px] font-bold tracking-widest uppercase text-[#555555] mb-1">Description Paragraph</label>
              <textarea rows={2} value={pillar3Desc} onChange={(e) => setPillar3Desc(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-1.5 resize-none focus:outline-none" />
            </div>
          </div>
        </div>

        {/* SOIL-TO-SILK PHILOSOPHY */}
        <div className="space-y-4 pt-4">
          <h4 className="font-serif text-base font-semibold pb-2 border-b border-brand-clay/15 text-brand-charcoal">04 // Soil directly to Silk Philosophy</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Philosophy Header tag (e.g. Earthbound Statement)</label>
              <input type="text" value={earthPretitle} onChange={(e) => setEarthPretitle(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Philosophy Title</label>
              <input type="text" value={earthTitle} onChange={(e) => setEarthTitle(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Philosophy Long Narrative</label>
            <textarea rows={3} value={earthDesc} onChange={(e) => setEarthDesc(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 resize-none focus:outline-none" />
          </div>
        </div>

        <button type="submit" className="w-full bg-[#5B6349] hover:bg-brand-charcoal text-brand-bg py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors shadow-md block cursor-pointer">
          Confirm About Page Narrative Chronicle
        </button>
      </form>
    </div>
  );
};


// ====================================================
// SUB-PANEL: SITEsettings PANEL
// ====================================================
interface SettingsProps {
  initialSettings: SiteSettings;
  onSave: (settings: SiteSettings) => void;
}

const SiteSettingsPanel: React.FC<SettingsProps> = ({ initialSettings, onSave }) => {
  const [siteName, setSiteName] = useState(initialSettings.siteName);
  const [logoText, setLogoText] = useState(initialSettings.logoText);
  const [phone, setPhone] = useState(initialSettings.phone);
  const [email, setEmail] = useState(initialSettings.email);
  const [address, setAddress] = useState(initialSettings.address);
  const [facebook, setFacebook] = useState(initialSettings.facebook);
  const [instagram, setInstagram] = useState(initialSettings.instagram);
  const [youtube, setYoutube] = useState(initialSettings.youtube);
  const [seoTitle, setSeoTitle] = useState(initialSettings.seoTitle);
  const [seoDescription, setSeoDescription] = useState(initialSettings.seoDescription);
  const [shippingCost, setShippingCost] = useState(initialSettings.shippingCost ?? 25);
  const [freeShippingThreshold, setFreeShippingThreshold] = useState(initialSettings.freeShippingThreshold ?? 500);
  const [bkashNumber, setBkashNumber] = useState(initialSettings.bkashNumber || '01712-345678');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ 
      siteName, 
      logoText, 
      phone, 
      email, 
      address, 
      facebook, 
      instagram, 
      youtube, 
      seoTitle, 
      seoDescription,
      shippingCost: Number(shippingCost),
      freeShippingThreshold: Number(freeShippingThreshold),
      bkashNumber
    });
  };

  return (
    <div className="space-y-6" id="settings-panel">
      <div>
        <h3 className="font-serif text-2xl font-semibold">Atelier Brand Settings</h3>
        <p className="text-xs text-brand-clay uppercase tracking-widest mt-0.5">Control contact codes, logos, typography metadata</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-brand-bg border border-brand-clay/20 p-6 sm:p-10 rounded-2xl relative shadow-xs font-sans text-xs sm:text-sm space-y-6">
        <CornerOrnament position="top-right" />
        <CornerOrnament position="bottom-left" />

        {/* SECTION: Identity */}
        <div className="space-y-4">
          <h4 className="font-serif text-base font-semibold pb-2 border-b border-brand-clay/15 text-brand-charcoal select-none">Atelier Identity</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Brand Name</label>
              <input type="text" value={siteName} onChange={(e) => setSiteName(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Logo Text Script</label>
              <input type="text" value={logoText} onChange={(e) => setLogoText(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2" />
            </div>
          </div>
        </div>

        {/* SECTION: Contacts */}
        <div className="space-y-4">
          <h4 className="font-serif text-base font-semibold pb-2 border-b border-brand-clay/15 text-brand-charcoal select-none">Contact Coordinates</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Atelier Email</label>
              <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Atelier Telephone</label>
              <input type="text" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2" />
            </div>
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Atelier Physical Address</label>
            <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2" />
          </div>
        </div>

        {/* SECTION: Socials */}
        <div className="space-y-4">
          <h4 className="font-serif text-base font-semibold pb-2 border-b border-brand-clay/15 text-brand-charcoal select-none">Digital Social Connections</h4>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Facebook</label>
              <input type="text" value={facebook} onChange={(e) => setFacebook(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Instagram</label>
              <input type="text" value={instagram} onChange={(e) => setInstagram(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">YouTube Channel</label>
              <input type="text" value={youtube} onChange={(e) => setYoutube(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2" />
            </div>
          </div>
        </div>

        {/* SECTION: Logistics coordinates & Shipping settings */}
        <div className="space-y-4">
          <h4 className="font-serif text-base font-semibold pb-2 border-b border-brand-clay/15 text-brand-charcoal select-none">Logistical Coordinates & Shipping</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Base Shipping Cost (৳)</label>
              <input type="number" min={0} value={shippingCost} onChange={(e) => setShippingCost(Number(e.target.value))} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2" />
            </div>
            <div>
              <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Free Shipping Threshold Coupon (৳)</label>
              <input type="number" min={0} value={freeShippingThreshold} onChange={(e) => setFreeShippingThreshold(Number(e.target.value))} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2" />
            </div>
          </div>
        </div>

        {/* SECTION: Mobile bKash Payment */}
        <div className="space-y-4 bg-red-50/20 border border-brand-terracotta/10 p-5 rounded-2xl relative">
          <div className="absolute top-4 right-4 text-[10px] bg-brand-terracotta text-white px-2 py-0.5 rounded-full font-serif italic select-none">bKash Merchant Portal</div>
          <h4 className="font-serif text-base font-semibold pb-2 border-b border-brand-clay/15 text-brand-charcoal select-none">bKash Mobile Wallet Integration</h4>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Merchant bKash Number (Editable)</label>
            <input 
              type="text" 
              value={bkashNumber} 
              onChange={(e) => setBkashNumber(e.target.value)} 
              className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 font-mono text-sm tracking-widest" 
              placeholder="e.g. 01712-345678"
            />
            <p className="text-[10px] text-brand-clay mt-1.5 leading-relaxed">
              Customers will see this phone number on the checkout step to send funds. They will be directed to send the exact order value and input their Transaction ID to authenticate and record the order.
            </p>
          </div>
        </div>

        {/* SECTION: SEO */}
        <div className="space-y-4">
          <h4 className="font-serif text-base font-semibold pb-2 border-b border-brand-clay/15 text-brand-charcoal select-none">Search engine Optimization</h4>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Global SEO Title Meta</label>
            <input type="text" value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2" />
          </div>
          <div>
            <label className="block text-[10px] font-bold tracking-widest uppercase text-[#555555] mb-1">Global SEO Description Meta</label>
            <textarea rows={3} value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 resize-none" />
          </div>
        </div>

        <button type="submit" className="w-full bg-[#5B6349] hover:bg-brand-charcoal text-brand-bg py-4 rounded-xl text-xs font-bold tracking-widest uppercase transition-colors shadow-md block cursor-pointer">
          Confirm Brand configurations
        </button>
      </form>
    </div>
  );
};


// ====================================================
// SUB-PANEL: SUPERADMIN DISCRETIONARY PANEL (ADMIN MANAGEMENTS)
// ====================================================
interface SuperAdminProps {
  users: UserProfile[];
  currentUser: UserProfile;
  onUpdateRole: (uid: string, role: UserRole) => void;
  onSuspendUser: (uid: string, status: UserProfile['status']) => void;
  onCreateAdmin: (name: string, email: string, password: string, role: UserRole) => void;
}

const SuperAdminsAccessDashboard: React.FC<SuperAdminProps> = ({ users, currentUser, onUpdateRole, onSuspendUser, onCreateAdmin }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('admin');
  const [isFormOpen, setIsFormOpen] = useState(false);

  const staffUsers = users.filter(u => u.role === 'admin' || u.role === 'superAdmin');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !password) return;
    onCreateAdmin(name, email, password, role);
    setName('');
    setEmail('');
    setPassword('');
    setIsFormOpen(false);
  };

  return (
    <div className="space-y-6" id="superadmin-curators-panel">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-serif text-2xl font-semibold">Staff Security Access Controls</h3>
          <p className="text-xs text-brand-clay uppercase tracking-widest mt-0.5">Manage administrator coordinates, role privileges, and activity locks</p>
        </div>
        
        <button
          onClick={() => setIsFormOpen(true)}
          className="bg-brand-charcoal hover:bg-brand-terracotta text-white px-5 py-2.5 rounded-lg text-xs font-bold tracking-widest uppercase transition-colors inline-flex items-center gap-2 cursor-pointer shadow-sm"
        >
          <Lock className="w-4 h-4" />
          <span>New Staff User</span>
        </button>
      </div>

      <div className="bg-brand-bg border border-brand-clay/20 rounded-2xl overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs sm:text-sm">
            <thead>
              <tr className="bg-brand-beige/35 border-b border-brand-clay/15 text-[10px] tracking-widest text-[#555555] uppercase font-bold">
                <th className="py-4 px-6">Staff Curator</th>
                <th className="py-4 px-6">Privilege role</th>
                <th className="py-4 px-6">Creation Log</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Access Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-clay/15 text-brand-charcoal/85">
              {staffUsers.map((u) => (
                <tr key={u.uid} className="hover:bg-brand-beige/10 transition-colors">
                  <td className="py-4 px-6">
                    <div className="flex items-center gap-2.5">
                      <img src={u.profileImage || "https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150"} className="w-8 h-8 rounded-full object-cover border border-brand-clay/15" />
                      <div>
                        <span className="font-bold block">{u.name}</span>
                        <span className="text-[10px] text-brand-clay block mt-0.5">{u.email}</span>
                      </div>
                    </div>
                  </td>
                  <td className="py-4 px-6">
                    <select
                      value={u.role}
                      disabled={u.uid === currentUser.uid}
                      onChange={(e) => onUpdateRole(u.uid, e.target.value as UserRole)}
                      className="bg-[#FAF7F5] border border-brand-clay/35 rounded py-1 px-1.5 text-xs text-brand-charcoal font-semibold uppercase focus:outline-none focus:border-brand-terracotta disabled:opacity-50"
                    >
                      <option value="admin">Admin</option>
                      <option value="superAdmin">Super Admin</option>
                    </select>
                  </td>
                  <td className="py-4 px-6 text-brand-clay font-mono text-[11px]">{u.createdAt.slice(0, 10)}</td>
                  <td className="py-4 px-6">
                    <span className={`text-[9.5px] font-bold px-2 py-0.5 rounded select-none ${
                      u.status === 'active' ? 'bg-[#5B6349]/15 text-[#4B5634]' : 'bg-brand-terracotta/15 text-brand-terracotta'
                    }`}>
                      {u.status}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-right font-semibold">
                    {u.uid === currentUser.uid ? (
                      <span className="text-[10px] text-[#888888] font-mono italic">Self (Unmodifiable)</span>
                    ) : u.status === 'active' ? (
                      <button
                        onClick={() => { if (confirm(`Lock staff credentials for ${u.name}?`)) onSuspendUser(u.uid, 'suspended'); }}
                        className="text-brand-terracotta hover:underline font-mono text-[10px] uppercase font-bold cursor-pointer"
                      >
                        Lock Access
                      </button>
                    ) : (
                      <button
                        onClick={() => onSuspendUser(u.uid, 'active')}
                        className="text-brand-olive hover:underline font-mono text-[10px] uppercase font-bold cursor-pointer"
                      >
                        Unlock Access
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-55 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-brand-charcoal/45 backdrop-blur-xs" onClick={() => setIsFormOpen(false)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-brand-bg max-w-md w-full p-6 sm:p-8 rounded-3xl z-10 border border-brand-clay/20 shadow-2xl font-sans"
            >
              <button onClick={() => setIsFormOpen(false)} className="absolute top-4 right-4 p-2 rounded-full hover:bg-brand-beige bg-brand-bg/95 border border-brand-clay/15 shadow-sm">
                <X className="w-4 h-4" />
              </button>

              <h4 className="font-serif text-xl font-bold mb-6 text-brand-charcoal">
                Establish Staff Profile
              </h4>

              <form onSubmit={handleSubmit} className="space-y-4 text-xs sm:text-sm">
                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Staff Member Full Name</label>
                  <input type="text" required value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" placeholder="Samina Begum" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Staff Email Coordinates</label>
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" placeholder="samina@rangheritage.com" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Temporary key Password</label>
                  <input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-terracotta" placeholder="••••••••" />
                </div>

                <div>
                  <label className="block text-[10px] font-bold tracking-widest text-[#555555] uppercase mb-1">Staff Access Level</label>
                  <select value={role} onChange={(e) => setRole(e.target.value as UserRole)} className="w-full bg-brand-bg border border-brand-clay/40 rounded-xl px-3 py-2 pr-10 focus:outline-none focus:border-brand-terracotta">
                    <option value="admin">Admin Curer</option>
                    <option value="superAdmin">Super Admin Access</option>
                  </select>
                </div>

                <button type="submit" className="w-full bg-[#5B6349] hover:bg-[#2D2A26] text-brand-bg font-bold uppercase tracking-widest py-3.5 rounded-xl transition-colors mt-4 block cursor-pointer">
                  Authorise Staff Access
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};
