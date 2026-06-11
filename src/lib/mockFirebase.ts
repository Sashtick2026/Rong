import { initializeApp } from 'firebase/app';
import { 
  getAuth, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged, 
  signInWithPopup, 
  GoogleAuthProvider, 
  sendPasswordResetEmail,
  updateProfile
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  deleteDoc, 
  collection, 
  query, 
  where, 
  onSnapshot,
  getDocFromServer,
  addDoc
} from 'firebase/firestore';

import { Product, Collection, JournalArticle } from '../types';
import { products as initialProducts, collections as initialCollections, journalArticles as initialPosts } from '../data';
import firebaseConfig from '../../firebase-applet-config.json';

// ==========================================
// FIREBASE CONFIGURATION & INITIALIZATION
// ==========================================

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);
export const auth = getAuth(app);

// ==========================================
// TYPE DEFINITIONS matching production-ready database schema
// ==========================================

export type UserRole = 'customer' | 'admin' | 'superAdmin';

export interface UserProfile {
  uid: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  profileImage?: string;
  status: 'active' | 'suspended';
  phone?: string;
  address?: string;
}

export interface AdminOrder {
  id: string;
  customerId: string;
  customerName: string;
  customerEmail: string;
  products: {
    product: Product;
    quantity: number;
  }[];
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  createdAt: string;
  shippingAddress: string;
  bkashNumber?: string;
  bkashTransactionId?: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  size: string; // e.g. "1.2 MB"
  type: string; // e.g. "image/png"
  folder: 'curations' | 'decor' | 'banners' | 'general';
  createdAt: string;
}

export interface SiteSettings {
  siteName: string;
  logoText: string;
  phone: string;
  email: string;
  address: string;
  facebook: string;
  instagram: string;
  youtube: string;
  seoTitle: string;
  seoDescription: string;
  shippingCost?: number;
  freeShippingThreshold?: number;
  heroTitleLine1?: string;
  heroTitleLine2?: string;
  heroDescription?: string;
  logoUrl?: string;
  philosophyPretitle?: string;
  philosophyTitle1?: string;
  philosophyTitle2?: string;
  philosophyTitle3?: string;
  philosophyDescription?: string;
  philosophyCardTitle?: string;
  philosophyCardSubtitle?: string;
  workflowPretitle?: string;
  workflowTitle?: string;
  workflowSubtitle?: string;
  bkashNumber?: string;
}

export interface AboutSettings {
  pretitle: string;
  titleLine1: string;
  titleLine2: string;
  quote: string;
  image: string;
  badge: string;
  manifestoTitle: string;
  manifestoPara1: string;
  manifestoPara2: string;
  manifestoQuote: string;
  pillar1Title: string;
  pillar1Desc: string;
  pillar1Badge: string;
  pillar2Title: string;
  pillar2Desc: string;
  pillar2Badge: string;
  pillar3Title: string;
  pillar3Desc: string;
  pillar3Badge: string;
  earthTitle: string;
  earthDesc: string;
  earthPretitle: string;
}

export interface FooterSettings {
  brandName: string;
  brandTagline: string;
  footerMessage: string;
  logoUrl: string;
  newsletterTitle: string;
  newsletterDescription: string;
  email: string;
  phone: string;
  address: string;
  socialLinks: {
    facebook: string;
    instagram: string;
    pinterest: string;
    youtube: string;
    whatsapp: string;
  };
  copyrightText: string;
  navigationLinks: { label: string; href: string }[];
  featuredCollections: { id: string; name: string }[];
  footerBackgroundUrl?: string;
  illustrationUrl?: string;
  bgTextureUrl?: string;
  decGraphicsUrl?: string;
  status?: 'draft' | 'published';
}

export interface Coupon {
  code: string;
  discountPercent: number;
  active: boolean;
  description?: string;
}

export interface PuzzlePieces {
  piece1Url: string;
  piece2Url: string;
  piece3Url: string;
  piece4Url: string;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  createdAt: string;
  replied: boolean;
}

// ==========================================
// STATIC INITIAL DATA DEFAULTS (FALLBACK LISTS)
// ==========================================

const initialUsers: UserProfile[] = [
  {
    uid: 'user_super_admin',
    name: 'Kazi Rang Super',
    email: 'superadmin@rang.com',
    role: 'superAdmin',
    createdAt: '2026-01-10T12:00:00Z',
    updatedAt: '2026-06-10T03:00:00Z',
    profileImage: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop',
    status: 'active',
    phone: '+880 1712 345678',
    address: 'Gulshan-2, Dhaka',
  },
  {
    uid: 'user_admin_1',
    name: 'Adiba Rahman',
    email: 'admin@rang.com',
    role: 'admin',
    createdAt: '2026-02-15T09:30:00Z',
    updatedAt: '2026-06-08T11:20:00Z',
    profileImage: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=200&auto=format&fit=crop',
    status: 'active',
    phone: '+880 1819 987654',
    address: 'Banani, Dhaka',
  },
  {
    uid: 'user_customer_1',
    name: 'Naimul Islam',
    email: 'customer@gmail.com',
    role: 'customer',
    createdAt: '2026-04-01T15:22:00Z',
    updatedAt: '2026-04-01T15:22:00Z',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop',
    status: 'active',
    phone: '+880 1552 443322',
    address: 'Dhanmondi, Dhaka',
  }
];

const initialOrders: AdminOrder[] = [
  {
    id: 'RNG-2026-89410',
    customerId: 'user_customer_1',
    customerName: 'Naimul Islam',
    customerEmail: 'customer@gmail.com',
    products: [
      {
        product: initialProducts[0],
        quantity: 1,
      },
      {
        product: initialProducts[1],
        quantity: 2,
      },
    ],
    totalAmount: 600,
    status: 'processing',
    createdAt: '2026-06-08T10:14:00Z',
    shippingAddress: 'House 42, Road 15, Dhanmondi, Dhaka, Bangladesh',
  }
];

const defaultSettings: SiteSettings = {
  siteName: 'রঙ Heritage',
  logoText: 'রঙ',
  phone: '+880 2 8812345',
  email: 'dialog@rangheritage.com',
  address: 'Gulshan-2, Road 44, Building 5A, Dhaka 1212, Bangladesh',
  facebook: 'https://facebook.com/rang.heritage',
  instagram: 'https://instagram.com/rang.heritage',
  youtube: 'https://youtube.com/c/rangheritage',
  seoTitle: 'রঙ — Handmade Lifestyle & Heritage Curation of Bengal',
  seoDescription: 'Discover limited premium Rajshahi silks, traditional terracotta collar jewelry, unrefined brass objects, and hand-painted sarees with roots in Bangladesh.',
  shippingCost: 25,
  freeShippingThreshold: 500,
  heroTitleLine1: 'Archived Loom.',
  heroTitleLine2: 'Slow Crafted.',
  heroDescription: 'Operating as a visual culture register, রঙ archives the handloom rhythms of Bangladesh. Combining slow, kiln-fired riverbed soil and botanically dyed yarns, each curated piece stands as an authentic monument to ancient aesthetic geometries.',
  bkashNumber: '01712-345678',
  logoUrl: 'https://i.ibb.co.com/YFW3wDm4/20260610-013250.jpg',
  philosophyPretitle: '02 // Brand Philosophy',
  philosophyTitle1: 'We celebrate the beauty of',
  philosophyTitle2: 'handmade traditions and',
  philosophyTitle3: 'sustainable living.',
  philosophyDescription: 'For generations, the weavers and ceramists of Bengal have practiced a silent communion with local soil and fibers. We cultivate these slower paces, ensuring every artifact of "হাতে তৈরি" (handmade) beauty represents a curated archive of Bangladeshi identity.',
  philosophyCardTitle: 'মাটির তৃষ্ণা',
  philosophyCardSubtitle: 'Thirst of Clay Series // Fired 1000°C',
  workflowPretitle: '03 // The Integration of Harvest',
  workflowTitle: "The Flow of Brand's Work",
  workflowSubtitle: 'Harmonizing Soil, Loom & Pigment'
};

const defaultAboutSettings: AboutSettings = {
  pretitle: "The Inception of Rang",
  titleLine1: "Where Soil Meets",
  titleLine2: "the Silent Brush",
  quote: "“Rang (রঙ) is not merely a label of accessories; it is a dedicated journal celebrating the organic longevity of Bangladeshi culture and craftsmanship.”",
  image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop",
  badge: "ESTD. 2026 / DHAKA",
  manifestoTitle: "Our Manifesto",
  manifestoPara1: "In an age governed by automated assembly lines and synthetic, fast-decaying products, Rang was founded with a conviction: to create objects that contain soul, breath, and historical weight. Our materials are born from fertile silt beds, hand-spun fibers, and unrefined minerals.",
  manifestoPara2: "Every hand-painted saree we curate, every single clay bead strung onto our accessories represents an unhurried dialog between the master designer and raw matter. We reject traditional high-volume production, choosing instead to showcase limited releases where every single product has its own lineage, story, and serial code.",
  manifestoQuote: "“We do not manufacture. We whisper old-world geometries onto new surfaces, creating functional canvases of daily luxury.”",
  pillar1Title: "Pristine Craftsmanship",
  pillar1Desc: "Our creative directors work alongside skilled clay-turners and painters in Dhaka, Sonargaon, and Rajshahi to map custom motifs using botanical pigments and natural binders.",
  pillar1Badge: "No synthetic stamps",
  pillar2Title: "Heritage Preservation",
  pillar2Desc: "By taking ancient geometric principles—such as traditional Alpana temple lines and the physical seals of Bengal terracotta monuments—we make sure that old cultural codes remain active.",
  pillar2Badge: "Documented design origins",
  pillar3Title: "Absolute Longevity",
  pillar3Desc: "We design with the planet’s threshold in mind. Clay returns seamlessly to the soil; brass is endlessly recyclable; and our hand-woven silk and cotton threads are organically harvested.",
  pillar3Badge: "100% natural packaging",
  earthTitle: "Our Soil to Silk Philosophy",
  earthDesc: "We believe that every product we usher into your home should eventually be able to return to the earth without leaving a permanent chemical trace. That is why our tags are hand-pressed from recycled cotton waste, and our delivery crates are crafted from sustainable local softwood timber.",
  earthPretitle: "Earthbound Statement",
};

const defaultFooterSettings: FooterSettings = {
  brandName: 'রঙ',
  brandTagline: 'Where Heritage Meets Imagination',
  footerMessage: '“রঙ (Rang) is not merely a label of accessories; it is a dedicated journal celebrating the organic longevity of Bangladeshi culture and craftsmanship.”',
  logoUrl: 'https://i.ibb.co.com/YFW3wDm4/20260610-013250.jpg',
  newsletterTitle: 'Sign up for our Heritage Dispatch',
  newsletterDescription: 'Receive seasonal journals, weaver schedules, limited-edition announcements and handcrafted tales of Bengal.',
  email: 'dialog@rangheritage.com',
  phone: '+880 2 8812345',
  address: 'Gulshan-2, Road 44, Building 5A, Dhaka 1212, Bangladesh',
  socialLinks: {
    facebook: 'https://facebook.com/rang.heritage',
    instagram: 'https://instagram.com/rang.heritage',
    pinterest: 'https://pinterest.com/rangheritage',
    youtube: 'https://youtube.com/c/rangheritage',
    whatsapp: 'https://wa.me/88028812345'
  },
  copyrightText: '© 2026 রঙ Heritage. All rights reserved regarding designs, drawings, and documents.',
  navigationLinks: [
    { label: 'Home', href: 'home' },
    { label: 'Shop Curation', href: 'shop' },
    { label: 'Our Story', href: 'story' },
    { label: 'Heritage Journal', href: 'journal' },
    { label: 'Atelier Contact', href: 'contact' }
  ],
  featuredCollections: [
    { id: 'col_1', name: 'Rajshahi Silk Sarees' },
    { id: 'col_2', name: 'Terracotta Neckware' },
    { id: 'col_3', name: 'Hand-dyed Khadi' }
  ],
  status: 'published'
};

const defaultCoupons: Coupon[] = [
  { code: 'HERITAGE15', discountPercent: 15, active: true },
  { code: 'BESHILOVE25', discountPercent: 25, active: true },
  { code: 'RANG10', discountPercent: 10, active: true }
];

const defaultPuzzlePieces: PuzzlePieces = {
  piece1Url: 'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?q=80&w=600',
  piece2Url: 'https://images.unsplash.com/photo-1612196808214-b8e1d6145a8c?q=80&w=600',
  piece3Url: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?q=80&w=600',
  piece4Url: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?q=80&w=600'
};

const defaultMediaList: MediaItem[] = [
  {
    id: 'med_1',
    name: 'hero_saree_editorial.png',
    url: initialProducts[0].image,
    size: '1.4 MB',
    type: 'image/png',
    folder: 'curations',
    createdAt: '2026-05-10T10:00:00Z',
  },
  {
    id: 'med_2',
    name: 'handmade_jewelry.png',
    url: initialProducts[1].image,
    size: '850 KB',
    type: 'image/png',
    folder: 'curations',
    createdAt: '2026-05-10T10:05:00Z',
  }
];

const initialMessages: ContactMessage[] = [
  {
    id: 'msg_1',
    name: 'Mustari Khan',
    email: 'mustari.k@outlook.com',
    subject: 'Exhibition curation request',
    message: 'Hello, our cultural arts gallery in Chittagong is organising a boutique launch of traditional textiles. We are incredibly interested in presenting three of your Nilufer Silk sarees. Please connect back with details.',
    createdAt: '2026-06-08T08:12:00Z',
    replied: true,
  }
];

// ==========================================
// CLIENT-SIDE REALTIME IN-MEMORY CACHE LOADER
// ==========================================

let cachedProducts: Product[] = JSON.parse(localStorage.getItem('rang_real_products') || '[]');
let cachedCollections: Collection[] = JSON.parse(localStorage.getItem('rang_real_collections') || '[]');
let cachedOrders: AdminOrder[] = JSON.parse(localStorage.getItem('rang_real_orders') || '[]');
let cachedUsers: UserProfile[] = JSON.parse(localStorage.getItem('rang_real_users') || '[]');
let cachedPosts: JournalArticle[] = JSON.parse(localStorage.getItem('rang_real_posts') || '[]');
let cachedMedia: MediaItem[] = JSON.parse(localStorage.getItem('rang_real_media') || '[]');
let cachedSettings: SiteSettings = JSON.parse(localStorage.getItem('rang_real_settings') || 'null') || defaultSettings;
let cachedFooterSettings: FooterSettings = JSON.parse(localStorage.getItem('rang_real_footer') || 'null') || defaultFooterSettings;
let cachedCoupons: Coupon[] = JSON.parse(localStorage.getItem('rang_real_coupons') || '[]');
let cachedPuzzlePieces: PuzzlePieces = JSON.parse(localStorage.getItem('rang_real_puzzle') || 'null') || defaultPuzzlePieces;
let cachedAboutSettings: AboutSettings = JSON.parse(localStorage.getItem('rang_real_about') || 'null') || defaultAboutSettings;
let cachedMessages: ContactMessage[] = JSON.parse(localStorage.getItem('rang_real_messages') || '[]');

export interface PaymentSettings {
  bkashNumber: string;
  bkashAccountType: string;
  paymentInstructions: string;
  verificationMessage: string;
  notificationSettings: string;
}

export interface PaymentVerification {
  verificationId: string;
  orderId: string;
  transactionId: string;
  senderNumber: string;
  amount: number;
  screenshotUrl?: string;
  status: 'verification_pending' | 'payment_verified' | 'payment_rejected';
  submittedAt: string;
  verifiedAt?: string;
  verifiedBy?: string;
  rejectionReason?: string;
}

export interface InAppNotification {
  notificationId: string;
  userId: string;
  role: 'admin' | 'customer';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

const defaultPaymentSettings: PaymentSettings = {
  bkashNumber: '01712-345678',
  bkashAccountType: 'Personal Account',
  paymentInstructions: 'Please make a manual/Send Money bKash transfer of the total order sum. Once completed, specify the sender mobile number, total amount paid, and copy-paste the bKash Transaction ID (TxnID) returned in the SMS/App to initiate verification.',
  verificationMessage: 'We have received your payment information. Our team is verifying your payment with bKash archives. This usually takes between 10-30 minutes. You will receive an immediate in-app notice and an invoice email once verified.',
  notificationSettings: 'enabled'
};

let cachedPaymentSettings: PaymentSettings = JSON.parse(localStorage.getItem('rong_real_payment_settings') || 'null') || defaultPaymentSettings;
let cachedPaymentVerifications: PaymentVerification[] = JSON.parse(localStorage.getItem('rong_real_payment_verifications') || '[]');
let cachedInAppNotifications: InAppNotification[] = JSON.parse(localStorage.getItem('rong_real_notifications') || '[]');

// ==========================================
// FIRESTORE ERROR HANDLING MANDATE
// ==========================================

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || []
    },
    operationType,
    path
  };
  console.error('Firestore Error Raised: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Ensure active server test connection
async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn("Please check your Firebase configuration.");
    }
  }
}
setTimeout(testConnection, 2500);

// ==========================================
// BACKGROUND SEEDING MANAGEMENT
// ==========================================

async function seedDatabaseIfNeeded() {
  // Check fast local storage indicator to immediately bypass slow network database query on load
  if (localStorage.getItem('rong_database_seeded_v3') === 'true') {
    return;
  }
  
  try {
    const querySnap = await getDocs(collection(db, 'products'));
    if (querySnap.empty) {
      console.log('No products found on Firestore. Beginning automatic database seed...');
      
      // 1. Seed products (include mapping for schema & frontend variables)
      for (const p of initialProducts) {
        const docData = {
          ...p,
          productId: p.id,
          title: p.name,
          mainImage: p.image,
          galleryImages: p.images || [p.image],
          featured: p.bestSeller || false,
          shortDescription: p.description.slice(0, 150),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'products', p.id), docData);
      }

      // 2. Seed collections
      for (const c of initialCollections) {
        const docData = {
          ...c,
          title: c.name,
          slug: c.id,
          bannerImageUrl: c.image,
          featured: true
        };
        await setDoc(doc(db, 'collections', c.id), docData);
      }

      // 3. Seed settings
      await setDoc(doc(db, 'siteSettings', 'general'), {
        siteName: defaultSettings.siteName,
        logoText: defaultSettings.logoText,
        email: defaultSettings.email,
        phone: defaultSettings.phone,
        address: defaultSettings.address,
        facebook: defaultSettings.facebook,
        instagram: defaultSettings.instagram,
        youtube: defaultSettings.youtube,
        seoTitle: defaultSettings.seoTitle,
        seoDescription: defaultSettings.seoDescription,
        shippingCost: defaultSettings.shippingCost,
        freeShippingThreshold: defaultSettings.freeShippingThreshold,
        bkashNumber: defaultSettings.bkashNumber,
        logoUrl: defaultSettings.logoUrl
      });

      await setDoc(doc(db, 'siteSettings', 'footer'), defaultFooterSettings);
      await setDoc(doc(db, 'siteSettings', 'about'), defaultAboutSettings);
      await setDoc(doc(db, 'siteSettings', 'puzzle'), defaultPuzzlePieces);
      await setDoc(doc(db, 'siteSettings', 'paymentSettings'), defaultPaymentSettings);

      // 4. Seed journalPosts
      for (const post of initialPosts) {
        const docData = {
          postId: post.id,
          title: post.title,
          slug: post.title.toLowerCase().replace(/\s+/g, '-'),
          content: Array.isArray(post.content) ? post.content : [post.content],
          coverImageUrl: post.image,
          published: true,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'journalPosts', post.id), docData);
      }

      // 5. Seed coupons
      for (const coupon of defaultCoupons) {
        await setDoc(doc(db, 'coupons', coupon.code), coupon);
      }

      // 6. Seed initial user profiles
      for (const u of initialUsers) {
        await setDoc(doc(db, 'users', u.uid), {
          ...u,
          role: u.uid === 'user_super_admin' ? 'superAdmin' : u.role
        });
      }

      // 7. Seed initial media entries
      for (const m of defaultMediaList) {
        await setDoc(doc(db, 'media', m.id), m);
      }

      // 8. Seed initial contact messages
      for (const msg of initialMessages) {
        await setDoc(doc(db, 'messages', msg.id), msg);
      }

      // 9. Seed initial orders list
      for (const ord of initialOrders) {
        await setDoc(doc(db, 'orders', ord.id), {
          ...ord,
          status: 'processing'
        });
      }

      console.log('Atelier Firebase database successfully prepared!');
    }
    localStorage.setItem('rong_database_seeded_v3', 'true');
  } catch (err) {
    if (err instanceof Error && err.message.includes('offline')) {
      console.warn('Seeding database deferred: Firestore is currently offline.');
    } else {
      console.warn('Seeding database failed:', err);
    }
  }
}

// Start database seeding checker
seedDatabaseIfNeeded();

// ==========================================
// REALTIME LISTENER DEPLOYMENTS
// ==========================================

const setupRealtimeSync = () => {
  // Products Sync
  onSnapshot(collection(db, 'products'), (snap) => {
    const list: Product[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        name: data.title || data.name || '',
        banglaName: data.banglaName || data.title || '',
        category: data.category || 'sarees',
        price: Number(data.price || 0),
        image: data.mainImage || data.image || '',
        images: data.galleryImages || data.images || [],
        description: data.description || '',
        banglaDescription: data.banglaDescription || data.description || '',
        materials: data.materials || [],
        care: data.care || [],
        shipping: data.shipping || 'Regular shipping',
        bestSeller: data.featured || data.bestSeller || false,
        newArrival: data.newArrival || false,
        collectionId: data.collection || data.collectionId || 'matir-trishna',
        story: data.story || '',
        offerPercentage: Number(data.offerPercentage || 0),
        stock: Number(data.stock ?? 1)
      });
    });
    cachedProducts = list;
    localStorage.setItem('rang_real_products', JSON.stringify(list));
  });

  // Collections Sync
  onSnapshot(collection(db, 'collections'), (snap) => {
    const list: Collection[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        name: data.title || data.name || '',
        banglaName: data.banglaName || data.title || '',
        subtitle: data.subtitle || '',
        description: data.description || '',
        quote: data.quote || '',
        image: data.bannerImageUrl || data.image || '',
        curator: data.curator || 'Curator'
      });
    });
    cachedCollections = list;
    localStorage.setItem('rang_real_collections', JSON.stringify(list));
  });

  // Orders Sync
  onSnapshot(collection(db, 'orders'), (snap) => {
    const list: AdminOrder[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as AdminOrder);
    });
    // Sort newest orders first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    cachedOrders = list;
    localStorage.setItem('rang_real_orders', JSON.stringify(list));
  });

  // Users Directory Sync
  onSnapshot(collection(db, 'users'), (snap) => {
    const list: UserProfile[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as UserProfile);
    });
    cachedUsers = list;
    localStorage.setItem('rang_real_users', JSON.stringify(list));
  });

  // Journal (journalPosts) Sync
  onSnapshot(collection(db, 'journalPosts'), (snap) => {
    const list: JournalArticle[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        title: data.title || '',
        banglaTitle: data.banglaTitle || data.title || '',
        date: data.createdAt ? new Date(data.createdAt).toLocaleDateString() : new Date().toLocaleDateString(),
        category: data.category || 'Slow Atelier',
        readTime: data.readTime || '3 Min',
        excerpt: data.excerpt || data.shortDescription || (data.title + ' narrative register'),
        content: Array.isArray(data.content) ? data.content : [data.content || ''],
        image: data.coverImageUrl || '',
        author: data.author || 'Atelier Registrar'
      });
    });
    cachedPosts = list;
    localStorage.setItem('rang_real_posts', JSON.stringify(list));
  });

  // Media Library Sync
  onSnapshot(collection(db, 'media'), (snap) => {
    const list: MediaItem[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as MediaItem);
    });
    cachedMedia = list;
    localStorage.setItem('rang_real_media', JSON.stringify(list));
  });

  // SiteSettings Sync
  onSnapshot(collection(db, 'siteSettings'), (snap) => {
    snap.forEach((snapDoc) => {
      const data = snapDoc.data();
      if (snapDoc.id === 'general') {
        cachedSettings = { ...defaultSettings, ...data };
        localStorage.setItem('rang_real_settings', JSON.stringify(cachedSettings));
      } else if (snapDoc.id === 'footer') {
        cachedFooterSettings = { ...defaultFooterSettings, ...data };
        localStorage.setItem('rang_real_footer', JSON.stringify(cachedFooterSettings));
      } else if (snapDoc.id === 'about') {
        cachedAboutSettings = { ...defaultAboutSettings, ...data };
        localStorage.setItem('rang_real_about', JSON.stringify(cachedAboutSettings));
      } else if (snapDoc.id === 'puzzle') {
        cachedPuzzlePieces = { ...defaultPuzzlePieces, ...data };
        localStorage.setItem('rang_real_puzzle', JSON.stringify(cachedPuzzlePieces));
      } else if (snapDoc.id === 'paymentSettings') {
        cachedPaymentSettings = { ...defaultPaymentSettings, ...data } as PaymentSettings;
        localStorage.setItem('rong_real_payment_settings', JSON.stringify(cachedPaymentSettings));
      }
    });
  });

  // Payment Verification Sync
  onSnapshot(collection(db, 'paymentVerification'), (snap) => {
    const list: PaymentVerification[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as PaymentVerification);
    });
    // Sort newest first
    list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    cachedPaymentVerifications = list;
    localStorage.setItem('rong_real_payment_verifications', JSON.stringify(list));
  });

  // In-App Notifications Sync
  onSnapshot(collection(db, 'notifications'), (snap) => {
    const list: InAppNotification[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as InAppNotification);
    });
    // Sort newest first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    cachedInAppNotifications = list;
    localStorage.setItem('rong_real_notifications', JSON.stringify(list));
  });

  // Coupons Sync
  onSnapshot(collection(db, 'coupons'), (snap) => {
    const list: Coupon[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as Coupon);
    });
    cachedCoupons = list;
    localStorage.setItem('rang_real_coupons', JSON.stringify(list));
  });

  // Messages Sync
  onSnapshot(collection(db, 'messages'), (snap) => {
    const list: ContactMessage[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as ContactMessage);
    });
    cachedMessages = list;
    localStorage.setItem('rang_real_messages', JSON.stringify(list));
  });
};

setupRealtimeSync();

// ==========================================
// AUTH STATE CACHING DRIVER
// ==========================================

let currentUserProfile: UserProfile | null = JSON.parse(localStorage.getItem('rang_real_auth_cache') || 'null');

onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    // 1. Immediately apply cached credentials if matches the active uid
    const cached = localStorage.getItem('rang_real_auth_cache');
    if (cached) {
      try {
        const parsed = JSON.parse(cached);
        if (parsed && parsed.uid === firebaseUser.uid) {
          currentUserProfile = parsed;
        }
      } catch (e) {}
    }

    // 2. Fallback to immediate local object if no cache exists, avoiding any blocking wait
    if (!currentUserProfile) {
      const isSuper = firebaseUser.email === 'rongo5707@gmail.com' || firebaseUser.email === 'superadmin@rang.com' || firebaseUser.email === 'superadmin@rong.com';
      currentUserProfile = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Atelier Keeper',
        email: firebaseUser.email || '',
        role: isSuper ? 'superAdmin' : 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
      };
    }
    
    localStorage.setItem('rang_real_auth_cache', JSON.stringify(currentUserProfile));
    localStorage.setItem('rang_auth_current_uid', firebaseUser.uid);

    // 3. Perform completely asynchronous background revalidation against Firestore
    const docRef = doc(db, 'users', firebaseUser.uid);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        const freshProfile = docSnap.data() as UserProfile;
        currentUserProfile = freshProfile;
        localStorage.setItem('rang_real_auth_cache', JSON.stringify(freshProfile));
        
        // update lastLogin asynchronously
        updateDoc(docRef, { lastLogin: new Date().toISOString() }).catch(() => {});
      } else {
        const isSuper = firebaseUser.email === 'rongo5707@gmail.com' || firebaseUser.email === 'superadmin@rang.com' || firebaseUser.email === 'superadmin@rong.com';
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Atelier Keeper',
          email: firebaseUser.email || '',
          role: isSuper ? 'superAdmin' : 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
        };
        setDoc(docRef, profile).catch(() => {});
        currentUserProfile = profile;
        localStorage.setItem('rang_real_auth_cache', JSON.stringify(profile));
      }
    }).catch((err) => {
      console.warn('Silent profile revalidation skipped (retained cached profile):', err.message);
    });
  } else {
    currentUserProfile = null;
    localStorage.removeItem('rang_real_auth_cache');
    localStorage.removeItem('rang_auth_current_uid');
  }
});

// ==========================================
// EXPORTED INTEGRATED REPOSITORIES
// ==========================================

export const firebaseAuth = {
  getCurrentUser: (): UserProfile | null => {
    return currentUserProfile;
  },

  login: async (email: string, password: string, rememberMe?: boolean): Promise<UserProfile> => {
    const superAdminEmail = 'rongo5707@gmail.com';
    const superAdminPass = 'superadmin@Niloy@2007.Muiz@2008';

    try {
      // Automatic super admin registration support on login
      if (email.toLowerCase() === superAdminEmail) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email') {
            try {
              const cred = await createUserWithEmailAndPassword(auth, email, password);
              const profile: UserProfile = {
                uid: cred.user.uid,
                name: 'Rongo Super Admin',
                email: superAdminEmail,
                role: 'superAdmin',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'active',
              };
              await setDoc(doc(db, 'users', cred.user.uid), profile);
              currentUserProfile = profile;
              localStorage.setItem('rang_real_auth_cache', JSON.stringify(profile));
              return profile;
            } catch (signupErr) {
              console.error('Superadmin self-sign-up crash:', signupErr);
            }
          }
          throw err;
        }
      } else {
        await signInWithEmailAndPassword(auth, email, password);
      }

      const firebaseUser = auth.currentUser;
      if (!firebaseUser) throw new Error('Unresolved Auth Credential session');

      let profileSnap = null;
      let offlineFallback = false;
      try {
        profileSnap = await getDoc(doc(db, 'users', firebaseUser.uid));
      } catch (getDocErr: any) {
        console.warn('Failed to retrieve user profile from server (offline/unreachable):', getDocErr);
        offlineFallback = true;
      }

      if (offlineFallback || !profileSnap || !profileSnap.exists()) {
        // Retrieve from local storage cache if available
        const cached = localStorage.getItem('rang_real_auth_cache');
        if (cached) {
          try {
            const cachedUser = JSON.parse(cached);
            if (cachedUser && cachedUser.uid === firebaseUser.uid) {
              currentUserProfile = cachedUser;
              return cachedUser;
            }
          } catch (pe) {}
        }

        const isSuper = firebaseUser.email === superAdminEmail;
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Atelier Keeper',
          email: firebaseUser.email || '',
          role: isSuper ? 'superAdmin' : 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
        };
        if (!offlineFallback) {
          try {
            await setDoc(doc(db, 'users', firebaseUser.uid), profile);
          } catch (setDocErr) {
            console.warn('Failed to save profile during signup/login:', setDocErr);
          }
        }
        currentUserProfile = profile;
        localStorage.setItem('rang_real_auth_cache', JSON.stringify(profile));
        return profile;
      }

      const pData = profileSnap.data() as UserProfile;
      if (pData.status === 'suspended') {
        await signOut(auth);
        throw new Error('Access denied: Your account has been suspended by the administrator.');
      }

      currentUserProfile = pData;
      localStorage.setItem('rang_real_auth_cache', JSON.stringify(pData));
      return pData;
    } catch (err: any) {
      console.warn('Authentication check rejected:', err);
      throw new Error(err.message || 'Authentication credentials incorrect.');
    }
  },

  register: async (name: string, email: string, password: string): Promise<UserProfile> => {
    try {
      const cred = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(cred.user, { displayName: name });

      const role = email.toLowerCase() === 'rongo5707@gmail.com' ? 'superAdmin' : 'customer';
      const profile: UserProfile = {
        uid: cred.user.uid,
        name,
        email: email.toLowerCase(),
        role: role as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
      };
      await setDoc(doc(db, 'users', cred.user.uid), profile);

      // Save User Registration notification
      try {
        await addDoc(collection(db, 'notifications'), {
          notificationId: 'notif_' + Date.now(),
          title: 'Registered New Keeper',
          message: `${name} (${email}) has registered.`,
          role: 'admin',
          read: false,
          createdAt: new Date().toISOString()
        });
      } catch (ex) {}

      currentUserProfile = profile;
      localStorage.setItem('rang_real_auth_cache', JSON.stringify(profile));
      return profile;
    } catch (err: any) {
      console.error('Registration dispatch rejected:', err);
      throw new Error(err.message || 'Registration coordinates failed.');
    }
  },

  logout: async (): Promise<void> => {
    try {
      await signOut(auth);
      currentUserProfile = null;
      localStorage.removeItem('rang_real_auth_cache');
      localStorage.removeItem('rang_auth_current_uid');
    } catch (err) {
      console.error('Logout request failed:', err);
    }
  },

  loginWithGoogle: async (): Promise<UserProfile> => {
    try {
      const provider = new GoogleAuthProvider();
      const cred = await signInWithPopup(auth, provider);
      const email = cred.user.email || '';
      
      const pDoc = await getDoc(doc(db, 'users', cred.user.uid));
      if (pDoc.exists()) {
        const u = pDoc.data() as UserProfile;
        if (u.status === 'suspended') {
          await signOut(auth);
          throw new Error('Access denied: Your account has been suspended by the administrator.');
        }
        currentUserProfile = u;
        localStorage.setItem('rang_real_auth_cache', JSON.stringify(u));
        return u;
      }

      const role = email.toLowerCase() === 'rongo5707@gmail.com' ? 'superAdmin' : 'customer';
      const profile: UserProfile = {
        uid: cred.user.uid,
        name: cred.user.displayName || 'Google Keeper',
        email: email,
        role: role as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
      };
      await setDoc(doc(db, 'users', cred.user.uid), profile);

      currentUserProfile = profile;
      localStorage.setItem('rang_real_auth_cache', JSON.stringify(profile));
      return profile;
    } catch (err: any) {
      if (err && (err.code === 'auth/unauthorized-domain' || (err.message && err.message.includes('auth/unauthorized-domain')))) {
        console.warn('Google Auth login unauthorized domain (handled environment constraint):', err);
        throw new Error(
          `Unauthorized Domain: Google Sign-In is not configured for "${window.location.hostname}" in your Firebase Console.\n\n` +
          `To authorize this domain:\n` +
          `1. Go to Firebase Console > Authentication > Settings > Authorized domains.\n` +
          `2. Add "${window.location.hostname}" to the list.\n\n` +
          `Meanwhile, you can use the preset Demo/Mock accounts below to access full app functionality instantly.`
        );
      }
      console.error('Google Auth login failed:', err);
      throw new Error(err.message || 'Google Auth coordinate check failed.');
    }
  },

  forgotPassword: async (email: string): Promise<string> => {
    try {
      await sendPasswordResetEmail(auth, email);
      return `A password reset link is sent to ${email}. Check inbox.`;
    } catch (err: any) {
      console.error('Forgot password failed:', err);
      throw new Error(err.message || 'Password reset dispatcher failed.');
    }
  }
};

export const firestore = {
  onProductsSnapshot: (callback: (products: Product[]) => void) => {
    return onSnapshot(collection(db, 'products'), (snap) => {
      const list: Product[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.title || data.name || '',
          banglaName: data.banglaName || data.title || '',
          category: data.category || 'sarees',
          price: Number(data.price || 0),
          image: data.mainImage || data.image || '',
          images: data.galleryImages || data.images || [],
          description: data.description || '',
          banglaDescription: data.banglaDescription || data.description || '',
          materials: data.materials || [],
          care: data.care || [],
          shipping: data.shipping || 'Regular shipping',
          bestSeller: data.featured || data.bestSeller || false,
          newArrival: data.newArrival || false,
          collectionId: data.collection || data.collectionId || 'matir-trishna',
          story: data.story || '',
          offerPercentage: Number(data.offerPercentage || 0),
          stock: Number(data.stock ?? 1)
        });
      });
      callback(list);
    });
  },

  onCollectionsSnapshot: (callback: (collections: Collection[]) => void) => {
    return onSnapshot(collection(db, 'collections'), (snap) => {
      const list: Collection[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.title || data.name || '',
          banglaName: data.banglaName || data.title || '',
          subtitle: data.subtitle || '',
          description: data.description || '',
          quote: data.quote || '',
          image: data.bannerImageUrl || data.image || '',
          curator: data.curator || 'Curator'
        });
      });
      callback(list);
    });
  },

  // PRODUCTS CRUD
  getProducts: (): Product[] => {
    return cachedProducts.length > 0 ? cachedProducts : initialProducts;
  },
  saveProduct: async (product: Product): Promise<void> => {
    const id = product.id || 'prod_' + Date.now();
    const docData = {
      ...product,
      id,
      productId: id,
      title: product.name,
      mainImage: product.image,
      galleryImages: product.images || [product.image],
      featured: product.bestSeller || false,
      shortDescription: product.description.slice(0, 150),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'products', id), docData);
      
      // Stock checkout warning system notifications
      if (product.stock === 0) {
        try {
          await addDoc(collection(db, 'notifications'), {
            notificationId: 'notif_' + Date.now(),
            title: 'Product Out Of Stock',
            message: `${product.name} is now out of stock!`,
            role: 'admin',
            read: false,
            createdAt: new Date().toISOString()
          });
        } catch (ex) {}
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `products/${id}`);
    }
  },
  deleteProduct: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'products', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  },

  // COLLECTIONS CRUD
  getCollections: (): Collection[] => {
    return cachedCollections.length > 0 ? cachedCollections : initialCollections;
  },
  saveCollection: async (collectionItem: Collection): Promise<void> => {
    const id = collectionItem.id || 'col_' + Date.now();
    const docData = {
      ...collectionItem,
      id,
      title: collectionItem.name,
      slug: id,
      bannerImageUrl: collectionItem.image,
      featured: true
    };
    try {
      await setDoc(doc(db, 'collections', id), docData);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `collections/${id}`);
    }
  },
  deleteCollection: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'collections', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `collections/${id}`);
    }
  },

  // ORDERS INFRASTRUCTURE
  getOrders: (): AdminOrder[] => {
    return cachedOrders;
  },
  updateOrderStatus: async (orderId: string, status: AdminOrder['status']): Promise<void> => {
    try {
      await updateDoc(doc(db, 'orders', orderId), { status });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `orders/${orderId}`);
    }
  },
  createOrder: async (order: Omit<AdminOrder, 'id' | 'createdAt'>): Promise<AdminOrder> => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = `RNG-2026-${randomNum}`;
    const newOrder: AdminOrder = {
      ...order,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'orders', newId), newOrder);

      // Trigger order and payment notifications standard alerts
      try {
        await addDoc(collection(db, 'notifications'), {
          notificationId: 'notif_' + Date.now(),
          title: 'New Order Received',
          message: `Order ${newId} (৳${order.totalAmount}) created by ${order.customerName}.`,
          role: 'admin',
          read: false,
          createdAt: new Date().toISOString()
        });
      } catch (ex) {}

      return newOrder;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `orders/${newId}`);
      throw err;
    }
  },

  // USER CRM DIRECTORY
  getUsers: (): UserProfile[] => {
    return cachedUsers.length > 0 ? cachedUsers : initialUsers;
  },
  updateUserProfile: async (uid: string, fields: Partial<UserProfile>): Promise<void> => {
    try {
      await updateDoc(doc(db, 'users', uid), { 
        ...fields, 
        updatedAt: new Date().toISOString() 
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `users/${uid}`);
    }
  },
  createUserByAdmin: async (user: Omit<UserProfile, 'uid' | 'createdAt' | 'updatedAt'>): Promise<UserProfile> => {
    const uid = 'user_' + Date.now();
    const newUser: UserProfile = {
      ...user,
      uid,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'users', uid), newUser);
      return newUser;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `users/${uid}`);
      throw err;
    }
  },
  deleteUser: async (uid: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'users', uid));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `users/${uid}`);
    }
  },

  // JOURNAL CMS
  getJournalArticles: (): JournalArticle[] => {
    return cachedPosts;
  },
  saveJournalArticle: async (article: JournalArticle): Promise<void> => {
    const id = article.id || 'article_' + Date.now();
    const docData = {
      postId: id,
      title: article.title,
      slug: article.title.toLowerCase().replace(/\s+/g, '-'),
      content: article.content,
      coverImageUrl: article.image,
      published: true,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'journalPosts', id), docData);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `journalPosts/${id}`);
    }
  },
  deleteJournalArticle: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'journalPosts', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `journalPosts/${id}`);
    }
  },

  // MEDIA ASSETS LATCH
  getMedia: (): MediaItem[] => {
    return cachedMedia.length > 0 ? cachedMedia : defaultMediaList;
  },
  addMediaItem: async (name: string, url: string, folder: MediaItem['folder'], sizeBytes: number, type: string): Promise<MediaItem> => {
    const id = 'med_' + Date.now();
    const sizeStr = (sizeBytes / (1024 * 1024)).toFixed(1) + ' MB';
    const newItem: MediaItem = {
      id,
      name,
      url,
      size: sizeStr,
      type,
      folder,
      createdAt: new Date().toISOString(),
    };
    try {
      await setDoc(doc(db, 'media', id), newItem);
      return newItem;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `media/${id}`);
      throw err;
    }
  },
  deleteMediaItem: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'media', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `media/${id}`);
    }
  },

  // GLOBAL BRAND SETTINGS CMS
  getSettings: (): SiteSettings => {
    return cachedSettings;
  },
  saveSettings: async (settings: SiteSettings): Promise<void> => {
    try {
      await setDoc(doc(db, 'siteSettings', 'general'), settings);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'siteSettings/general');
    }
  },

  // CUSTOMER CONTACT INQUIRIES
  getMessages: (): ContactMessage[] => {
    return cachedMessages;
  },
  addMessage: async (message: Omit<ContactMessage, 'id' | 'createdAt' | 'replied'>): Promise<ContactMessage> => {
    const id = 'msg_' + Date.now();
    const newMsg: ContactMessage = {
      ...message,
      id,
      createdAt: new Date().toISOString(),
      replied: false,
    };
    try {
      await setDoc(doc(db, 'messages', id), newMsg);
      return newMsg;
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `messages/${id}`);
      throw err;
    }
  },
  replyToMessage: async (id: string): Promise<void> => {
    try {
      await updateDoc(doc(db, 'messages', id), { replied: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `messages/${id}`);
    }
  },
  deleteMessage: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'messages', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `messages/${id}`);
    }
  },

  // FAREWELL FOOTER CMS PANE
  getFooterSettings: (): FooterSettings => {
    return cachedFooterSettings;
  },
  saveFooterSettings: async (footer: FooterSettings): Promise<void> => {
    try {
      await setDoc(doc(db, 'siteSettings', 'footer'), footer);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'siteSettings/footer');
    }
  },

  // DISCOUNTS TOKEN REGULATION
  getCoupons: (): Coupon[] => {
    return cachedCoupons;
  },
  saveCoupon: async (coupon: Coupon): Promise<void> => {
    try {
      await setDoc(doc(db, 'coupons', coupon.code), coupon);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `coupons/${coupon.code}`);
    }
  },
  deleteCoupon: async (code: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'coupons', code));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `coupons/${code}`);
    }
  },

  // INTERACTIVE GEOMETRIES PUZZLES
  getPuzzlePieces: (): PuzzlePieces => {
    return cachedPuzzlePieces;
  },
  savePuzzlePieces: async (pieces: PuzzlePieces): Promise<void> => {
    try {
      await setDoc(doc(db, 'siteSettings', 'puzzle'), pieces);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'siteSettings/puzzle');
    }
  },

  // ABOUT STORY CHRONICLES
  getAboutSettings: (): AboutSettings => {
    return cachedAboutSettings;
  },
  saveAboutSettings: async (about: AboutSettings): Promise<void> => {
    try {
      await setDoc(doc(db, 'siteSettings', 'about'), about);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'siteSettings/about');
    }
  },

  // MANUAL PAYMENT SYSTEM
  getPaymentSettings: (): PaymentSettings => {
    return cachedPaymentSettings;
  },
  savePaymentSettings: async (settings: PaymentSettings): Promise<void> => {
    try {
      await setDoc(doc(db, 'siteSettings', 'paymentSettings'), settings);
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, 'siteSettings/paymentSettings');
    }
  },
  getPaymentVerifications: (): PaymentVerification[] => {
    return cachedPaymentVerifications;
  },
  getNotifications: (): InAppNotification[] => {
    return cachedInAppNotifications;
  },
  markNotificationRead: async (notifId: string): Promise<void> => {
    try {
      await updateDoc(doc(db, 'notifications', notifId), { read: true });
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `notifications/${notifId}`);
    }
  },
  submitPaymentVerification: async (verification: Omit<PaymentVerification, 'verificationId' | 'status' | 'submittedAt'>): Promise<void> => {
    // 1. Double check for Transaction ID duplication across all submissions
    const duplicate = cachedPaymentVerifications.find(
      (v) => v.transactionId.toUpperCase() === verification.transactionId.toUpperCase()
    );
    if (duplicate) {
      throw new Error(`Duplicate entry failure: Transaction ID "${verification.transactionId}" has already been submitted for verification.`);
    }

    const verificationId = 'ver_' + Date.now();
    const finalVerification: PaymentVerification = {
      ...verification,
      verificationId,
      status: 'verification_pending',
      submittedAt: new Date().toISOString()
    };

    try {
      // 2. Write to paymentVerification collection
      await setDoc(doc(db, 'paymentVerification', verificationId), finalVerification);

      // 3. Update Order Payment Status & Order Status
      await updateDoc(doc(db, 'orders', verification.orderId), {
        status: 'verification_pending',
        bkashNumber: cachedPaymentSettings.bkashNumber,
        bkashTransactionId: verification.transactionId
      });

      // 4. Create in-app system notification for admins
      const notificationId = 'notif_' + Date.now();
      const adminNotif: InAppNotification = {
        notificationId,
        userId: 'admin',
        role: 'admin',
        title: '🔒 Payment Verification Requested',
        message: `Customer manual payment submission for Order ${verification.orderId}. TxnID: ${verification.transactionId}. Amount: ৳${verification.amount}.`,
        read: false,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'notifications', notificationId), adminNotif);
    } catch (err) {
      handleFirestoreError(err, OperationType.CREATE, `paymentVerification/${verificationId}`);
    }
  },
  verifyPayment: async (verificationId: string, status: 'payment_verified' | 'payment_rejected', rejectionReason?: string, verifiedBy?: string): Promise<void> => {
    try {
      const verRef = doc(db, 'paymentVerification', verificationId);
      const verObj = cachedPaymentVerifications.find(v => v.verificationId === verificationId);
      if (!verObj) {
        throw new Error(`Verification entry not found for ID: ${verificationId}`);
      }

      // Update verification doc
      await updateDoc(verRef, {
        status,
        rejectionReason: rejectionReason || '',
        verifiedAt: new Date().toISOString(),
        verifiedBy: verifiedBy || 'superAdmin'
      });

      // Update the Order status in orders collection
      const orderRef = doc(db, 'orders', verObj.orderId);
      await updateDoc(orderRef, {
        status: status === 'payment_verified' ? 'payment_verified' : 'payment_rejected'
      });

      // Create clear in-app customer notification
      const notificationId = 'notif_' + Date.now();
      const customerNotif: InAppNotification = {
        notificationId,
        userId: verObj.senderNumber, // we can notify this sender or resolve customerId
        role: 'customer',
        title: status === 'payment_verified' ? '✅ Payment Verified' : '❌ Payment Rejected',
        message: status === 'payment_verified' 
          ? `Your traditional payment for Order ${verObj.orderId} (TxnID: ${verObj.transactionId}) of ৳${verObj.amount} has been approved. Your heritage item is moving to the processing atelier.`
          : `Your payment was rejected. Reason: ${rejectionReason || 'Details not matched.'}. Please submit valid transaction details or contact support.`,
        read: false,
        createdAt: new Date().toISOString()
      };
      await setDoc(doc(db, 'notifications', notificationId), customerNotif);
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `paymentVerification/${verificationId}`);
    }
  }
};
