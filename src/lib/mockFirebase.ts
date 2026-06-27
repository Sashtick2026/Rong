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

import { Product, Collection, JournalArticle, Testimonial, CommunitySnap } from '../types';
import { products as initialProducts, collections as initialCollections, journalArticles as initialPosts, testimonials as initialReviews } from '../data';
import firebaseConfig from '../../firebase-applet-config.json';

// ==========================================
// FIREBASE CONFIGURATION & INITIALIZATION
// ==========================================

const app = initializeApp(firebaseConfig);
export const db = (firebaseConfig as any).firestoreDatabaseId 
  ? getFirestore(app, (firebaseConfig as any).firestoreDatabaseId)
  : getFirestore(app);
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
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'verification_pending' | 'payment_verified' | 'payment_rejected';
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
  sliderProductIds?: string[];
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
    name: 'Kazi Rongo Super',
    email: 'superadmin@rongo.com',
    role: 'superAdmin',
    createdAt: '2026-01-10T12:00:00Z',
    updatedAt: '2026-06-10T03:00:00Z',
    profileImage: 'https://i.ibb.co/mV2JMRFb/Pngtree-default-male-avatar-5939655.png',
    status: 'active',
    phone: '+880 1712 345678',
    address: 'Gulshan-2, Dhaka',
  },
  {
    uid: 'user_admin_1',
    name: 'Adiba Rahman',
    email: 'admin@rongo.com',
    role: 'admin',
    createdAt: '2026-02-15T09:30:00Z',
    updatedAt: '2026-06-08T11:20:00Z',
    profileImage: 'https://i.ibb.co/mV2JMRFb/Pngtree-default-male-avatar-5939655.png',
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
    profileImage: 'https://i.ibb.co/mV2JMRFb/Pngtree-default-male-avatar-5939655.png',
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
  siteName: 'রঙ (Rongo) Heritage',
  logoText: 'রঙ',
  phone: '+880 2 8812345',
  email: 'dialog@rongoheritage.com',
  address: 'Gulshan-2, Road 44, Building 5A, Dhaka 1212, Bangladesh',
  facebook: 'https://facebook.com/rongo.heritage',
  instagram: 'https://instagram.com/rongo.heritage',
  youtube: 'https://youtube.com/c/rongoheritage',
  seoTitle: 'রঙ (Rongo) Heritage — Handmade Lifestyle & Heritage Curation of Bengal',
  seoDescription: 'Discover limited premium Rajshahi silks, traditional terracotta collar jewelry, unrefined brass objects, and hand-painted sarees with roots in Bangladesh at রঙ (Rongo) Heritage.',
  shippingCost: 25,
  freeShippingThreshold: 500,
  heroTitleLine1: 'Archived Loom.',
  heroTitleLine2: 'Slow Crafted.',
  heroDescription: 'Operating as a visual culture register, রঙ archives the handloom rhythms of Bangladesh. Combining slow, kiln-fired riverbed soil and botanically dyed yarns, each curated piece stands as an authentic monument to ancient aesthetic geometries.',
  bkashNumber: '01712-345678',
  logoUrl: 'https://i.ibb.co/YFW3wDm4/20260610-013250.jpg',
  philosophyPretitle: '02 // Brand Philosophy',
  philosophyTitle1: 'We celebrate the beauty of',
  philosophyTitle2: 'handmade traditions and',
  philosophyTitle3: 'sustainable living.',
  philosophyDescription: 'For generations, the weavers and ceramists of Bengal have practiced a silent communion with local soil and fibers. We cultivate these slower paces, ensuring every artifact of "হাতে তৈরি" (handmade) beauty represents a curated archive of Bangladeshi identity.',
  philosophyCardTitle: 'মাটির তৃষ্ণা',
  philosophyCardSubtitle: 'Thirst of Clay Series // Fired 1000°C',
  workflowPretitle: '03 // The Integration of Harvest',
  workflowTitle: "The Flow of Brand's Work",
  workflowSubtitle: 'Harmonizing Soil, Loom & Pigment',
  sliderProductIds: ['saree-nilufer', 'jewelry-poromatshya', 'pot-kolsi-luxury', 'bangles-mukta', 'saree-boshonto']
};

const defaultAboutSettings: AboutSettings = {
  pretitle: "The Inception of Rongo",
  titleLine1: "Where Soil Meets",
  titleLine2: "the Silent Brush",
  quote: "“Rongo (রঙ) is not merely a label of accessories; it is a dedicated journal celebrating the organic longevity of Bangladeshi culture and craftsmanship.”",
  image: "https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800&auto=format&fit=crop",
  badge: "ESTD. 2026 / DHAKA",
  manifestoTitle: "Our Manifesto",
  manifestoPara1: "In an age governed by automated assembly lines and synthetic, fast-decaying products, Rongo was founded with a conviction: to create objects that contain soul, breath, and historical weight. Our materials are born from fertile silt beds, hand-spun fibers, and unrefined minerals.",
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
  footerMessage: '“রঙ (Rongo) is not merely a label of accessories; it is a dedicated journal celebrating the organic longevity of Bangladeshi culture and craftsmanship.”',
  logoUrl: 'https://i.ibb.co/YFW3wDm4/20260610-013250.jpg',
  newsletterTitle: 'Sign up for our Heritage Dispatch',
  newsletterDescription: 'Receive seasonal journals, weaver schedules, limited-edition announcements and handcrafted tales of Bengal.',
  email: 'dialog@rongoheritage.com',
  phone: '+880 2 8812345',
  address: 'Gulshan-2, Road 44, Building 5A, Dhaka 1212, Bangladesh',
  socialLinks: {
    facebook: 'https://facebook.com/rongo.heritage',
    instagram: 'https://instagram.com/rongo.heritage',
    pinterest: 'https://pinterest.com/rongoheritage',
    youtube: 'https://youtube.com/c/rongoheritage',
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
  { code: 'RONGO10', discountPercent: 10, active: true }
];

const defaultPuzzlePieces: PuzzlePieces = {
  piece1Url: 'https://i.ibb.co/ZpjZfBwV/lucid-origin-Ultra-detailed-museum-quality-photography-of-traditional-Bangladeshi-clay-toy-do-0.jpg',
  piece2Url: 'https://i.ibb.co/20XHgmjR/lucid-origin-Luxury-editorial-flat-lay-of-authentic-Bangladeshi-handcrafted-products-displaye-0.jpg',
  piece3Url: 'https://i.ibb.co/j9wtJhbR/lucid-origin-Close-up-luxury-product-photography-of-traditional-Bangladeshi-handcrafted-bangl-0.jpg',
  piece4Url: 'https://i.ibb.co/Gf03kD2S/lucid-origin-Authentic-Bangladeshi-handcrafted-clay-hari-patil-pottery-collection-displayed-i-0.jpg'
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

let cachedProducts: Product[] = JSON.parse(localStorage.getItem('rongo_real_products') || '[]');
let cachedCollections: Collection[] = JSON.parse(localStorage.getItem('rongo_real_collections') || '[]');
let cachedOrders: AdminOrder[] = JSON.parse(localStorage.getItem('rongo_real_orders') || '[]');
let cachedUsers: UserProfile[] = JSON.parse(localStorage.getItem('rongo_real_users') || '[]');
let cachedPosts: JournalArticle[] = JSON.parse(localStorage.getItem('rongo_real_posts') || '[]');
let cachedMedia: MediaItem[] = JSON.parse(localStorage.getItem('rongo_real_media') || '[]');
let cachedSettings: SiteSettings = JSON.parse(localStorage.getItem('rongo_real_settings') || 'null') || defaultSettings;
let cachedFooterSettings: FooterSettings = JSON.parse(localStorage.getItem('rongo_real_footer') || 'null') || defaultFooterSettings;
let cachedCoupons: Coupon[] = JSON.parse(localStorage.getItem('rongo_real_coupons') || '[]');
let cachedPuzzlePieces: PuzzlePieces = JSON.parse(localStorage.getItem('rongo_real_puzzle') || 'null') || defaultPuzzlePieces;
let cachedAboutSettings: AboutSettings = JSON.parse(localStorage.getItem('rongo_real_about') || 'null') || defaultAboutSettings;
let cachedMessages: ContactMessage[] = JSON.parse(localStorage.getItem('rongo_real_messages') || '[]');
let cachedReviews: Testimonial[] = JSON.parse(localStorage.getItem('rongo_real_reviews') || '[]');
let cachedCommunitySnaps: CommunitySnap[] = JSON.parse(localStorage.getItem('rongo_real_community_snaps') || '[]');

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

// Helper to recursively strip any undefined properties to prevent Firestore serialization crashes
export function cleanUndefined<T>(obj: T): T {
  if (obj === null || typeof obj !== 'object') {
    return obj;
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanUndefined(item)) as any;
  }
  const cleaned: any = {};
  for (const key of Object.keys(obj)) {
    const val = (obj as any)[key];
    if (val !== undefined) {
      cleaned[key] = cleanUndefined(val);
    }
  }
  return cleaned as T;
}

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
      
      // 1. (Products and Collections are NOT seeded automatically per User request to use database-only data)

      // 3. Seed site settings configurations
      try {
        await setDoc(doc(db, 'siteSettings', 'general'), cleanUndefined({
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
        }));

        await setDoc(doc(db, 'siteSettings', 'footer'), cleanUndefined(defaultFooterSettings));
        await setDoc(doc(db, 'siteSettings', 'about'), cleanUndefined(defaultAboutSettings));
        await setDoc(doc(db, 'siteSettings', 'puzzle'), cleanUndefined(defaultPuzzlePieces));
        await setDoc(doc(db, 'siteSettings', 'paymentSettings'), cleanUndefined(defaultPaymentSettings));
        console.log('Successfully seeded site settings.');
      } catch (err) {
        console.warn('Failed seeding site settings:', err);
      }

      // 4. Seed journalPosts
      try {
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
          await setDoc(doc(db, 'journalPosts', post.id), cleanUndefined(docData));
        }
        console.log('Successfully seeded journal posts.');
      } catch (err) {
        console.warn('Failed seeding journal posts:', err);
      }

      // 5. Seed coupons
      try {
        for (const coupon of defaultCoupons) {
          await setDoc(doc(db, 'coupons', coupon.code), cleanUndefined(coupon));
        }
        console.log('Successfully seeded coupons.');
      } catch (err) {
        console.warn('Failed seeding coupons:', err);
      }

      // 6. Seed initial user profiles
      try {
        for (const u of initialUsers) {
          await setDoc(doc(db, 'users', u.uid), cleanUndefined({
            ...u,
            role: u.uid === 'user_super_admin' ? 'superAdmin' : u.role
          }));
        }
        console.log('Successfully seeded default user profiles.');
      } catch (err) {
        console.warn('Failed seeding user profiles:', err);
      }

      // 7. Seed initial media entries
      try {
        for (const m of defaultMediaList) {
          await setDoc(doc(db, 'media', m.id), cleanUndefined(m));
        }
        console.log('Successfully seeded media library assets.');
      } catch (err) {
        console.warn('Failed seeding media assets:', err);
      }

      // 8. Seed initial contact messages
      try {
        for (const msg of initialMessages) {
          await setDoc(doc(db, 'messages', msg.id), cleanUndefined(msg));
        }
        console.log('Successfully seeded starting contact messages.');
      } catch (err) {
        console.warn('Failed seeding contact messages:', err);
      }

      // 9. Seed initial orders list
      try {
        for (const ord of initialOrders) {
          await setDoc(doc(db, 'orders', ord.id), cleanUndefined({
            ...ord,
            status: 'processing'
          }));
        }
        console.log('Successfully seeded orders list.');
      } catch (err) {
        console.warn('Failed seeding orders list:', err);
      }

      // 10. Seed initial reviews (Voice of the Keepers)
      try {
        for (const test of initialReviews) {
          await setDoc(doc(db, 'reviews', test.id), cleanUndefined({
            id: test.id,
            name: test.name,
            role: test.role,
            quote: test.quote,
            location: test.location,
            approved: true,
            createdAt: new Date().toISOString()
          }));
        }
        console.log('Successfully seeded reviews.');
      } catch (reviewsErr) {
        console.warn('Deferred seeding of some reviews (may already exist or restricted):', reviewsErr);
      }

      // 11. Seed initial community snapshots (Alter Community Snapshot)
      try {
        const defaultSnaps = [
          { id: 'snap_1', title: 'Sonargaon Loom', location: 'Atelier', img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800', approved: true, createdAt: new Date().toISOString(), submittedBy: 'System' },
          { id: 'snap_2', title: 'Clay Firing Set', location: 'Studio', img: 'https://images.unsplash.com/photo-1565192647048-f997ded879f0?auto=format&fit=crop&q=80&w=800', approved: true, createdAt: new Date().toISOString(), submittedBy: 'System' },
          { id: 'snap_3', title: 'Exhibiting Muslin', location: 'Curation', img: 'https://images.unsplash.com/photo-1601887389937-0b02c26b6c3c?auto=format&fit=crop&q=80&w=800', approved: true, createdAt: new Date().toISOString(), submittedBy: 'System' },
          { id: 'snap_4', title: 'Glass chiming pack', location: 'Dhaka', img: 'https://images.unsplash.com/photo-1513519245088-0e12902e5a38?auto=format&fit=crop&q=80&w=800', approved: true, createdAt: new Date().toISOString(), submittedBy: 'System' }
        ];
        for (const snap of defaultSnaps) {
          await setDoc(doc(db, 'communitySnaps', snap.id), cleanUndefined(snap));
        }
        console.log('Successfully seeded community snaps.');
      } catch (snapsErr) {
        console.warn('Deferred seeding of some community snaps (may already exist or restricted):', snapsErr);
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

async function ensureReviewsAndSnapsAreSeeded() {
  // Mock seeding removed so only real customers reviews and snapshots can be featured once live
  console.log('Skipping default seeding for reviews and community snaps.');
}

// Start database seeding checkers
seedDatabaseIfNeeded();
ensureReviewsAndSnapsAreSeeded();

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
    localStorage.setItem('rongo_real_products', JSON.stringify(list));
  }, (err) => console.warn('Products sync deferred:', err.message));

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
    localStorage.setItem('rongo_real_collections', JSON.stringify(list));
  }, (err) => console.warn('Collections sync deferred:', err.message));

  // Orders Sync
  onSnapshot(collection(db, 'orders'), (snap) => {
    const list: AdminOrder[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as AdminOrder);
    });
    // Sort newest orders first
    list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    cachedOrders = list;
    localStorage.setItem('rongo_real_orders', JSON.stringify(list));
  }, (err) => console.warn('Orders sync deferred:', err.message));

  // Users Directory Sync
  onSnapshot(collection(db, 'users'), (snap) => {
    const list: UserProfile[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as UserProfile);
    });
    cachedUsers = list;
    localStorage.setItem('rongo_real_users', JSON.stringify(list));
  }, (err) => console.warn('Users directory sync deferred:', err.message));

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
    localStorage.setItem('rongo_real_posts', JSON.stringify(list));
  }, (err) => console.warn('Journal sync deferred:', err.message));

  // Media Library Sync
  onSnapshot(collection(db, 'media'), (snap) => {
    const list: MediaItem[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as MediaItem);
    });
    cachedMedia = list;
    localStorage.setItem('rongo_real_media', JSON.stringify(list));
  }, (err) => console.warn('Media directory sync deferred:', err.message));

  // SiteSettings Sync
  onSnapshot(collection(db, 'siteSettings'), (snap) => {
    snap.forEach((snapDoc) => {
      const data = snapDoc.data();
      if (snapDoc.id === 'general') {
        cachedSettings = { ...defaultSettings, ...data };
        localStorage.setItem('rongo_real_settings', JSON.stringify(cachedSettings));
      } else if (snapDoc.id === 'footer') {
        cachedFooterSettings = { ...defaultFooterSettings, ...data };
        localStorage.setItem('rongo_real_footer', JSON.stringify(cachedFooterSettings));
      } else if (snapDoc.id === 'about') {
        cachedAboutSettings = { ...defaultAboutSettings, ...data };
        localStorage.setItem('rongo_real_about', JSON.stringify(cachedAboutSettings));
      } else if (snapDoc.id === 'puzzle') {
        cachedPuzzlePieces = { ...defaultPuzzlePieces, ...data };
        localStorage.setItem('rongo_real_puzzle', JSON.stringify(cachedPuzzlePieces));
      } else if (snapDoc.id === 'paymentSettings') {
        cachedPaymentSettings = { ...defaultPaymentSettings, ...data } as PaymentSettings;
        localStorage.setItem('rong_real_payment_settings', JSON.stringify(cachedPaymentSettings));
      }
    });
  }, (err) => console.warn('Site settings sync deferred:', err.message));

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
  }, (err) => console.warn('Payment verification sync deferred:', err.message));

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
  }, (err) => console.warn('System notifications sync deferred:', err.message));

  // Coupons Sync
  onSnapshot(collection(db, 'coupons'), (snap) => {
    const list: Coupon[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as Coupon);
    });
    cachedCoupons = list;
    localStorage.setItem('rongo_real_coupons', JSON.stringify(list));
  }, (err) => console.warn('Coupons sync deferred:', err.message));

  // Messages Sync
  onSnapshot(collection(db, 'messages'), (snap) => {
    const list: ContactMessage[] = [];
    snap.forEach((docSnap) => {
      list.push(docSnap.data() as ContactMessage);
    });
    cachedMessages = list;
    localStorage.setItem('rongo_real_messages', JSON.stringify(list));
  }, (err) => console.warn('Admin messages sync deferred:', err.message));

  // Reviews Sync
  onSnapshot(collection(db, 'reviews'), (snap) => {
    const list: Testimonial[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        name: data.name || '',
        role: data.role || 'Keeper',
        quote: data.quote || '',
        location: data.location || '',
        approved: data.approved !== false,
        createdAt: data.createdAt || new Date().toISOString()
      });
    });
    cachedReviews = list;
    localStorage.setItem('rongo_real_reviews', JSON.stringify(list));
  }, (err) => console.warn('Reviews sync deferred:', err.message));

  // CommunitySnaps Sync
  onSnapshot(collection(db, 'communitySnaps'), (snap) => {
    const list: CommunitySnap[] = [];
    snap.forEach((docSnap) => {
      const data = docSnap.data();
      list.push({
        id: docSnap.id,
        title: data.title || '',
        location: data.location || '',
        img: data.img || '',
        approved: data.approved !== false,
        createdAt: data.createdAt || new Date().toISOString(),
        submittedBy: data.submittedBy || ''
      });
    });
    cachedCommunitySnaps = list;
    localStorage.setItem('rongo_real_community_snaps', JSON.stringify(list));
  }, (err) => console.warn('CommunitySnaps sync deferred:', err.message));
};

setupRealtimeSync();

// ==========================================
// AUTH STATE CACHING DRIVER
// ==========================================

let currentUserProfile: UserProfile | null = JSON.parse(localStorage.getItem('rongo_real_auth_cache') || 'null');

onAuthStateChanged(auth, (firebaseUser) => {
  if (firebaseUser) {
    // 1. Immediately apply cached credentials if matches the active uid
    const cached = localStorage.getItem('rongo_real_auth_cache');
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
      const emailLower = (firebaseUser.email || '').toLowerCase();
      const isSuper = emailLower === 'rongo5707@gmail.com' || emailLower === 'superadmin@rongo.com' || emailLower === 'superadmin@rang.com' || emailLower === 'superadmin@rong.com' || emailLower === 'sashtick26@gmail.com';
      currentUserProfile = {
        uid: firebaseUser.uid,
        name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Atelier Keeper',
        email: firebaseUser.email || '',
        role: isSuper ? 'superAdmin' : 'customer',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        profileImage: 'https://i.ibb.co/mV2JMRFb/Pngtree-default-male-avatar-5939655.png',
      };
    }
    
    localStorage.setItem('rongo_real_auth_cache', JSON.stringify(currentUserProfile));
    localStorage.setItem('rongo_auth_current_uid', firebaseUser.uid);

    // Reset seed indicating parameter if isSuper is true to clear the bypass and trigger seeding with active admin auth permissions
    const emailLower = (firebaseUser.email || '').toLowerCase();
    const isSuper = emailLower === 'rongo5707@gmail.com' || emailLower === 'superadmin@rongo.com' || emailLower === 'superadmin@rang.com' || emailLower === 'superadmin@rong.com' || emailLower === 'sashtick26@gmail.com';
    if (isSuper) {
      localStorage.removeItem('rong_database_seeded_v3');
      setTimeout(() => {
        seedDatabaseIfNeeded().catch(() => {});
      }, 1000);
    }

    // 3. Perform completely asynchronous background revalidation against Firestore
    const docRef = doc(db, 'users', firebaseUser.uid);
    getDoc(docRef).then((docSnap) => {
      if (docSnap.exists()) {
        const freshProfile = docSnap.data() as UserProfile;
        currentUserProfile = freshProfile;
        localStorage.setItem('rongo_real_auth_cache', JSON.stringify(freshProfile));
        
        // update lastLogin asynchronously
        updateDoc(docRef, { lastLogin: new Date().toISOString() }).catch(() => {});
      } else {
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || firebaseUser.email?.split('@')[0] || 'Atelier Keeper',
          email: firebaseUser.email || '',
          role: isSuper ? 'superAdmin' : 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
          profileImage: 'https://i.ibb.co/mV2JMRFb/Pngtree-default-male-avatar-5939655.png',
        };
        setDoc(docRef, profile).catch(() => {});
        currentUserProfile = profile;
        localStorage.setItem('rongo_real_auth_cache', JSON.stringify(profile));
      }
    }).catch((err) => {
      console.warn('Silent profile revalidation skipped (retained cached profile):', err.message);
    });
  } else {
    currentUserProfile = null;
    localStorage.removeItem('rongo_real_auth_cache');
    localStorage.removeItem('rongo_auth_current_uid');
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
    const emailLower = email.toLowerCase();
    const superAdminEmails = [
      'rongo5707@gmail.com',
      'superadmin@rongo.com',
      'superadmin@rang.com',
      'superadmin@rong.com',
      'sashtick26@gmail.com'
    ];
    const isSuperAdminEmail = superAdminEmails.includes(emailLower);

    try {
      // Automatic super admin registration support on login
      if (isSuperAdminEmail) {
        try {
          await signInWithEmailAndPassword(auth, email, password);
        } catch (err: any) {
          if (err.code === 'auth/user-not-found' || err.code === 'auth/invalid-credential' || err.code === 'auth/invalid-email' || err.code === 'auth/wrong-password') {
            try {
              const cred = await createUserWithEmailAndPassword(auth, email, password);
              const profile: UserProfile = {
                uid: cred.user.uid,
                name: emailLower === 'sashtick26@gmail.com' ? 'Sashtick Curator' : 'Rongo Super Admin',
                email: emailLower,
                role: 'superAdmin',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                status: 'active',
                profileImage: 'https://i.ibb.co/mV2JMRFb/Pngtree-default-male-avatar-5939655.png',
              };
              await setDoc(doc(db, 'users', cred.user.uid), profile);
              currentUserProfile = profile;
              localStorage.setItem('rongo_real_auth_cache', JSON.stringify(profile));
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
        const cached = localStorage.getItem('rongo_real_auth_cache');
        if (cached) {
          try {
            const cachedUser = JSON.parse(cached);
            if (cachedUser && cachedUser.uid === firebaseUser.uid) {
              currentUserProfile = cachedUser;
              return cachedUser;
            }
          } catch (pe) {}
        }

        const emailLower = (firebaseUser.email || '').toLowerCase();
        const isSuper = emailLower === 'rongo5707@gmail.com' || emailLower === 'superadmin@rongo.com' || emailLower === 'superadmin@rang.com' || emailLower === 'superadmin@rong.com' || emailLower === 'sashtick26@gmail.com';
        const profile: UserProfile = {
          uid: firebaseUser.uid,
          name: firebaseUser.displayName || 'Atelier Keeper',
          email: firebaseUser.email || '',
          role: isSuper ? 'superAdmin' : 'customer',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          status: 'active',
          profileImage: 'https://i.ibb.co/mV2JMRFb/Pngtree-default-male-avatar-5939655.png',
        };
        if (!offlineFallback) {
          try {
            await setDoc(doc(db, 'users', firebaseUser.uid), profile);
          } catch (setDocErr) {
            console.warn('Failed to save profile during signup/login:', setDocErr);
          }
        }
        currentUserProfile = profile;
        localStorage.setItem('rongo_real_auth_cache', JSON.stringify(profile));
        return profile;
      }

      const pData = profileSnap.data() as UserProfile;
      if (pData.status === 'suspended') {
        await signOut(auth);
        throw new Error('Access denied: Your account has been suspended by the administrator.');
      }

      currentUserProfile = pData;
      localStorage.setItem('rongo_real_auth_cache', JSON.stringify(pData));
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

      const emailLower = email.toLowerCase();
      const isSuper = emailLower === 'rongo5707@gmail.com' || emailLower === 'superadmin@rongo.com' || emailLower === 'superadmin@rang.com' || emailLower === 'superadmin@rong.com' || emailLower === 'sashtick26@gmail.com';
      const role = isSuper ? 'superAdmin' : 'customer';
      const profile: UserProfile = {
        uid: cred.user.uid,
        name,
        email: email.toLowerCase(),
        role: role as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        profileImage: 'https://i.ibb.co/mV2JMRFb/Pngtree-default-male-avatar-5939655.png',
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
      localStorage.setItem('rongo_real_auth_cache', JSON.stringify(profile));
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
      localStorage.removeItem('rongo_real_auth_cache');
      localStorage.removeItem('rongo_auth_current_uid');
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
        localStorage.setItem('rongo_real_auth_cache', JSON.stringify(u));
        return u;
      }

      const emailLower = email.toLowerCase();
      const isSuper = emailLower === 'rongo5707@gmail.com' || emailLower === 'superadmin@rongo.com' || emailLower === 'superadmin@rang.com' || emailLower === 'superadmin@rong.com' || emailLower === 'sashtick26@gmail.com';
      const role = isSuper ? 'superAdmin' : 'customer';
      const profile: UserProfile = {
        uid: cred.user.uid,
        name: cred.user.displayName || 'Google Keeper',
        email: email,
        role: role as any,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'active',
        profileImage: 'https://i.ibb.co/mV2JMRFb/Pngtree-default-male-avatar-5939655.png',
      };
      await setDoc(doc(db, 'users', cred.user.uid), profile);

      currentUserProfile = profile;
      localStorage.setItem('rongo_real_auth_cache', JSON.stringify(profile));
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
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'products');
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
    }, (err) => {
      handleFirestoreError(err, OperationType.GET, 'collections');
    });
  },

  onReviewsSnapshot: (callback: (reviews: Testimonial[]) => void) => {
    return onSnapshot(collection(db, 'reviews'), (snap) => {
      const list: Testimonial[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          name: data.name || '',
          role: data.role || 'Keeper',
          quote: data.quote || '',
          location: data.location || '',
          approved: data.approved !== false,
          createdAt: data.createdAt || new Date().toISOString()
        });
      });
      callback(list);
    }, (err) => {
      console.warn('Real-Time Reviews snapshot sync deferred:', err.message);
      callback(firestore.getReviews());
    });
  },

  onCommunitySnapsSnapshot: (callback: (snaps: CommunitySnap[]) => void) => {
    return onSnapshot(collection(db, 'communitySnaps'), (snap) => {
      const list: CommunitySnap[] = [];
      snap.forEach((docSnap) => {
        const data = docSnap.data();
        list.push({
          id: docSnap.id,
          title: data.title || '',
          location: data.location || '',
          img: data.img || '',
          approved: data.approved !== false,
          createdAt: data.createdAt || new Date().toISOString(),
          submittedBy: data.submittedBy || ''
        });
      });
      callback(list);
    }, (err) => {
      console.warn('Real-Time CommunitySnaps snapshot sync deferred:', err.message);
      callback(firestore.getCommunitySnaps());
    });
  },

  // REVIEWS CRUD
  getReviews: (): Testimonial[] => {
    return cachedReviews;
  },
  saveReview: async (review: Testimonial): Promise<void> => {
    const id = review.id || 'rev_' + Date.now();
    try {
      await setDoc(doc(db, 'reviews', id), {
        ...review,
        id,
        approved: review.approved !== undefined ? review.approved : true,
        createdAt: review.createdAt || new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `reviews/${id}`);
    }
  },
  deleteReview: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'reviews', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `reviews/${id}`);
    }
  },

  // COMMUNITY SNAPS CRUD
  getCommunitySnaps: (): CommunitySnap[] => {
    return cachedCommunitySnaps;
  },
  saveCommunitySnap: async (snap: CommunitySnap): Promise<void> => {
    const id = snap.id || 'snap_' + Date.now();
    try {
      await setDoc(doc(db, 'communitySnaps', id), {
        ...snap,
        id,
        approved: snap.approved !== undefined ? snap.approved : true,
        createdAt: snap.createdAt || new Date().toISOString()
      });
    } catch (err) {
      handleFirestoreError(err, OperationType.WRITE, `communitySnaps/${id}`);
    }
  },
  deleteCommunitySnap: async (id: string): Promise<void> => {
    try {
      await deleteDoc(doc(db, 'communitySnaps', id));
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `communitySnaps/${id}`);
    }
  },

  // PRODUCTS CRUD
  getProducts: (): Product[] => {
    return cachedProducts;
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
      await setDoc(doc(db, 'products', id), cleanUndefined(docData));
      
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
      
      // Clean up sliderProductIds references from site settings if selected
      if (cachedSettings && cachedSettings.sliderProductIds) {
        if (cachedSettings.sliderProductIds.includes(id)) {
          const updatedSlideIds = cachedSettings.sliderProductIds.filter(pid => pid !== id);
          const updatedSettings = {
            ...cachedSettings,
            sliderProductIds: updatedSlideIds
          };
          try {
            await setDoc(doc(db, 'siteSettings', 'general'), updatedSettings);
          } catch (e) {
            console.warn("Could not auto-remove deleted product ID from homepage slider settings:", e);
          }
        }
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, `products/${id}`);
    }
  },

  // COLLECTIONS CRUD
  getCollections: (): Collection[] => {
    return cachedCollections;
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
      await setDoc(doc(db, 'collections', id), cleanUndefined(docData));
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
  createOrder: async (order: Omit<AdminOrder, 'id' | 'createdAt'> & { id?: string }): Promise<AdminOrder> => {
    const randomNum = Math.floor(10000 + Math.random() * 90000);
    const newId = order.id || `RNG-2026-${randomNum}`;
    const newOrder: AdminOrder = {
      ...order,
      id: newId,
      createdAt: new Date().toISOString(),
    };
    
    // Always insert/optimistically update local cache and localStorage
    if (!cachedOrders.find(o => o.id === newId)) {
      cachedOrders.unshift(newOrder);
      localStorage.setItem('rongo_real_orders', JSON.stringify(cachedOrders));
    }

    // Fire-and-forget background Firestore write to avoid blocking under offline/network constraints
    setDoc(doc(db, 'orders', newId), newOrder)
      .then(() => {
        // Trigger order and payment notifications standard alerts in the background
        addDoc(collection(db, 'notifications'), {
          notificationId: 'notif_' + Date.now(),
          title: 'New Order Received',
          message: `Order ${newId} (৳${order.totalAmount}) created by ${order.customerName}.`,
          role: 'admin',
          read: false,
          createdAt: new Date().toISOString()
        }).catch((err) => {
          console.warn('Silent non-blocking error creating notification:', err);
        });
      })
      .catch((err) => {
        console.warn('Firebase background order creation failed, relying on local cache state:', err);
      });

    return newOrder;
  },

  // USER CRM DIRECTORY
  getUsers: (): UserProfile[] => {
    return cachedUsers.length > 0 ? cachedUsers : initialUsers;
  },
  updateUserProfile: async (uid: string, fields: Partial<UserProfile>): Promise<void> => {
    try {
      // Remove undefined keys to prevent Firestore unsupported field value errors
      const sanitizedFields: any = {};
      Object.keys(fields).forEach((key) => {
        const val = (fields as any)[key];
        if (val !== undefined) {
          sanitizedFields[key] = val;
        }
      });

      await updateDoc(doc(db, 'users', uid), { 
        ...sanitizedFields, 
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
    // 1. Get explicitly loaded/cached payment verifications
    const list = [...cachedPaymentVerifications];

    // 2. Synthesize verifications from orders that have payment details but no explicit verification record
    cachedOrders.forEach((order) => {
      if (order.bkashTransactionId && !list.find((v) => v.orderId === order.id)) {
        list.push({
          verificationId: 'synth_' + order.id,
          orderId: order.id,
          transactionId: order.bkashTransactionId,
          senderNumber: order.bkashNumber || 'N/A',
          amount: order.totalAmount,
          screenshotUrl: '',
          status: order.status === 'payment_verified' 
            ? 'payment_verified' 
            : (order.status === 'payment_rejected' ? 'payment_rejected' : 'verification_pending'),
          submittedAt: order.createdAt
        });
      }
    });

    return list;
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

    // Strip any fields that are undefined to prevent Firestore validation crashes
    (Object.keys(finalVerification) as Array<keyof PaymentVerification>).forEach((key) => {
      if (finalVerification[key] === undefined) {
        delete finalVerification[key];
      }
    });

    // Always push to in-memory cache and localStorage synchronously
    cachedPaymentVerifications.unshift(finalVerification);
    localStorage.setItem('rong_real_payment_verifications', JSON.stringify(cachedPaymentVerifications));

    // Non-blocking writes in the background so the user never gets stuck under slow connection or hung promises
    setDoc(doc(db, 'paymentVerification', verificationId), finalVerification)
      .catch((err) => {
        console.warn('Non-critical: Direct paymentVerification write skipped. Falling back to order-based sync.', err);
      });

    updateDoc(doc(db, 'orders', verification.orderId), {
      status: 'verification_pending',
      bkashNumber: verification.senderNumber,
      bkashTransactionId: verification.transactionId
    }).catch((err) => {
      console.warn('Non-critical: Direct order update skipped during payment verification submission.', err);
    });

    // Try to create the admin notification in background
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
    setDoc(doc(db, 'notifications', notificationId), adminNotif)
      .catch((err) => {
        console.warn('Non-critical: System notification write skipped.', err);
      });
  },
  verifyPayment: async (verificationId: string, status: 'payment_verified' | 'payment_rejected', rejectionReason?: string, verifiedBy?: string): Promise<void> => {
    try {
      const isSynth = verificationId.startsWith('synth_');
      let orderId = '';
      let verObj: any = null;

      if (isSynth) {
        orderId = verificationId.replace('synth_', '');
        const order = cachedOrders.find(o => o.id === orderId);
        if (order) {
          verObj = {
            verificationId,
            orderId,
            transactionId: order.bkashTransactionId || 'N/A',
            senderNumber: order.bkashNumber || 'N/A',
            amount: order.totalAmount
          };
        }
      } else {
        verObj = cachedPaymentVerifications.find(v => v.verificationId === verificationId);
        if (verObj) {
          orderId = verObj.orderId;
        }
      }

      if (!verObj) {
        throw new Error(`Verification entry not found for ID: ${verificationId}`);
      }

      // Update the explicit paymentVerification doc only if it's not synthetic helper
      if (!isSynth) {
        try {
          const verRef = doc(db, 'paymentVerification', verificationId);
          await updateDoc(verRef, {
            status,
            rejectionReason: rejectionReason || '',
            verifiedAt: new Date().toISOString(),
            verifiedBy: verifiedBy || 'superAdmin'
          });
        } catch (err) {
          console.warn('Non-critical: Direct paymentVerification doc update failed inside verifyPayment.', err);
        }
      }

      // Update the Order status in orders collection (core truth!)
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, {
        status: status === 'payment_verified' ? 'payment_verified' : 'payment_rejected'
      });

      // Create clear in-app customer notification
      try {
        const notificationId = 'notif_' + Date.now();
        const customerNotif: InAppNotification = {
          notificationId,
          userId: verObj.senderNumber, 
          role: 'customer',
          title: status === 'payment_verified' ? '✅ Payment Verified' : '❌ Payment Rejected',
          message: status === 'payment_verified' 
            ? `Your traditional payment for Order ${orderId} (TxnID: ${verObj.transactionId}) of ৳${verObj.amount} has been approved. Your heritage item is moving to the processing atelier.`
            : `Your payment was rejected. Reason: ${rejectionReason || 'Details not matched.'}. Please submit valid transaction details or contact support.`,
          read: false,
          createdAt: new Date().toISOString()
        };
        await setDoc(doc(db, 'notifications', notificationId), customerNotif);
      } catch (err) {
        console.warn('Non-critical: Direct user notification write skipped.', err);
      }
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, `paymentVerification/${verificationId}`);
    }
  },
  wipeAtelierData: async (): Promise<void> => {
    // 1. Delete all products from Firestore
    try {
      const pSnap = await getDocs(collection(db, 'products'));
      for (const d of pSnap.docs) {
        try {
          await deleteDoc(doc(db, 'products', d.id));
        } catch (e) {
          console.warn('Skip delete product item', d.id, e);
        }
      }
    } catch (e) {
      console.warn('Could not clear products on server (permissions/unreachable):', e);
    }
    cachedProducts = [];
    localStorage.setItem('rongo_real_products', '[]');

    // 2. Delete all orders from Firestore
    try {
      const oSnap = await getDocs(collection(db, 'orders'));
      for (const d of oSnap.docs) {
        try {
          await deleteDoc(doc(db, 'orders', d.id));
        } catch (e) {
          console.warn('Skip delete order item', d.id, e);
        }
      }
    } catch (e) {
      console.warn('Could not clear orders on server (permissions/unreachable):', e);
    }
    cachedOrders = [];
    localStorage.setItem('rongo_real_orders', '[]');

    // 3. Delete all payment verifications from Firestore
    try {
      const pvSnap = await getDocs(collection(db, 'paymentVerification'));
      for (const d of pvSnap.docs) {
        try {
          await deleteDoc(doc(db, 'paymentVerification', d.id));
        } catch (e) {
          console.warn('Skip delete paymentVerification item', d.id, e);
        }
      }
    } catch (e) {
      console.warn('Could not clear paymentVerifications on server (permissions/unreachable):', e);
    }
    localStorage.setItem('rong_real_payment_verifications', '[]');

    // 4. Delete all notifications from Firestore
    try {
      const nSnap = await getDocs(collection(db, 'notifications'));
      for (const d of nSnap.docs) {
        try {
          await deleteDoc(doc(db, 'notifications', d.id));
        } catch (e) {
          console.warn('Skip delete notification item', d.id, e);
        }
      }
    } catch (e) {
      console.warn('Could not clear notifications on server (permissions/unreachable):', e);
    }
    localStorage.setItem('rong_real_notifications', '[]');

    // 5. Delete all messages from Firestore
    try {
      const mSnap = await getDocs(collection(db, 'messages'));
      for (const d of mSnap.docs) {
        try {
          await deleteDoc(doc(db, 'messages', d.id));
        } catch (e) {
          console.warn('Skip delete message item', d.id, e);
        }
      }
    } catch (e) {
      console.warn('Could not clear messages on server (permissions/unreachable):', e);
    }
    localStorage.setItem('rongo_real_messages', '[]');

    // Prevent automatic background re-seeding on next reload so it remains pristine empty
    localStorage.setItem('rong_database_seeded_v3', 'true');
  },
  seedDemoProductsAndOrders: async (): Promise<void> => {
    try {
      // Clear key to allow the standard collection loader to reinitialize
      localStorage.removeItem('rong_database_seeded_v3');
    } catch (err) {
      console.error('Re-seed failed:', err);
      throw err;
    }
  }
};
