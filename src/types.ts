export interface Product {
  id: string;
  name: string;
  banglaName: string;
  category: 'sarees' | 'jewelry' | 'accessories' | 'homeDecor' | 'gifts' | 'bangles';
  price: number;
  image: string;
  images?: string[]; // Multiple photos if needed
  description: string;
  banglaDescription: string;
  materials: string[];
  care: string[];
  shipping: string;
  bestSeller?: boolean;
  newArrival?: boolean;
  collectionId: string;
  story: string; // The storytelling paragraph for this heritage product
  offerPercentage?: number; // Discount offer on product by percentage
  stock?: number; // Available quantity
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

export interface Collection {
  id: string;
  name: string;
  banglaName: string;
  subtitle: string;
  description: string;
  quote: string;
  image: string;
  curator: string;
}

export interface JournalArticle {
  id: string;
  title: string;
  banglaTitle: string;
  date: string;
  category: string;
  readTime: string;
  excerpt: string;
  content: string[]; // Paragraphs
  image: string;
  author: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
  selectedColor?: string;
  selectedSize?: string;
}

export interface Testimonial {
  id: string;
  name: string;
  role: string;
  quote: string;
  location: string;
  approved?: boolean;
  createdAt?: string;
}

export interface CommunitySnap {
  id: string;
  title: string;
  location: string;
  img: string;
  approved: boolean;
  createdAt?: string;
  submittedBy?: string;
}
