import { Product, Collection, JournalArticle, Testimonial } from './types';

// Import our generated assets safely
import heroSareeImg from './assets/images/hero_saree_editorial_1781014487343.png';
import handmadeJewelryImg from './assets/images/handmade_jewelry_1781014504077.png';
import homeDecorClayImg from './assets/images/home_decor_clay_1781014520276.png';
import paintingProcessImg from './assets/images/craft_painting_process_1781014539374.png';
import banglesStackImg from './assets/images/bangles_stack_1781014560409.png';

export const collections: Collection[] = [
  {
    id: 'matir-trishna',
    name: 'Matir Trishna',
    banglaName: 'মাটির তৃষ্ণা',
    subtitle: 'Thirst of Clay',
    description: 'An exploration of earth and fire. Each piece in this collection is sculpted from pure local clay, hand-burnished, and high-fired to achieve deep, rich terracotta tones that echo ancient Bengal riverbanks.',
    quote: '“There is an entire civilization spoken silently in the form of baked clay.”',
    image: homeDecorClayImg,
    curator: 'Sajid Rahman'
  },
  {
    id: 'nokshi-shadh',
    name: 'Nokshi Shadh',
    banglaName: 'নকশী সাধ',
    subtitle: 'Embroidery of Desire',
    description: 'A poetic celebration of the loom and brush. Fine muslin and high-grade silk sarees individually hand-painted with fine squirrel-hair brushes or detailed with needlecraft, featuring motifs inspired by classic alpine leaves.',
    quote: '“Six yards of absolute poetry, painted leaf by leaf with local natural dyes.”',
    image: heroSareeImg,
    curator: 'Anila Kabir'
  },
  {
    id: 'bela-boshonto',
    name: 'Bela Boshonto',
    banglaName: 'বেলা বসন্ত',
    subtitle: 'The Spring Ephemerals',
    description: 'A delicate curation of luxury personal accessories and bangles. Combining hand-blown translucent glass with clay-spun beads, this collection represents the colors of the shifting seasons in Bengal.',
    quote: '“Music in the form of glass and metal-clay, chiming soft cultural tales.”',
    image: banglesStackImg,
    curator: 'Zainab Hossain'
  }
];

export const products: Product[] = [
  {
    id: 'saree-nilufer',
    name: 'The Nilufer Silk Saree',
    banglaName: 'নীলুফার রেশম শাড়ি',
    category: 'sarees',
    price: 380,
    image: heroSareeImg,
    images: [heroSareeImg, paintingProcessImg],
    description: 'A masterpiece of wearable art. This premium pure silk saree is meticulously painted by hand over a span of fourteen days. The design features a delicate choreography of lotus leaves and organic lines in terracotta and olive tones.',
    banglaDescription: 'একটি পরিধানযোগ্য শিল্পকর্ম। এই প্রিমিয়াম পিওর সিল্ক শাড়িটি চৌদ্দ দিনে অত্যন্ত যত্ন নিয়ে আঁকা হয়েছে। নকশায় আছে পদ্মপাতা ও পদ্মের ডালপালার এক অনুপম বুনন।',
    materials: ['100% Organically sourced Rajshahi Silk', 'Natural plant-based pigments', 'Unrefined gold paint detailing'],
    care: ['Dry clean only', 'Keep wrapped in soft cotton fabric to preserve natural dyes', 'Iron on reverse with low/neutral heat'],
    shipping: 'Ships in 5-7 business days in our signature wood-grain handmade box.',
    bestSeller: true,
    newArrival: false,
    collectionId: 'nokshi-shadh',
    story: 'Long before a paintbrush touches the silk, the weavers spend hours setting the warp and weft. Every leaf-motif represents a deep connection to the floating rivers of Sonargaon.'
  },
  {
    id: 'jewelry-poromatshya',
    name: 'Poromatshya Terracotta Collar',
    banglaName: 'পড়োমৎস্য মৃণ্ময় কন্ঠহার',
    category: 'jewelry',
    price: 110,
    image: handmadeJewelryImg,
    images: [handmadeJewelryImg, banglesStackImg],
    description: 'A sculptural choker necklace crafted with hand-fired terracotta fish amulets and aged brass findings. The pendant depicts stylized Bengal river fish, symbolizing abundance and fluidity.',
    banglaDescription: 'পোড়ামাটির ছোট ছোট মাছের নকশার সাথে মিশে আছে প্রাচীন পিতল। এই ভাস্কর্যধর্মী কন্ঠহারটি প্রাচীন নদীমাতৃক বাংলার রূপ তুলে ধরে।',
    materials: ['Riverbed fire-clay amulets', 'Aged brass collar wire', 'Hand-twisted organic jute ties'],
    care: ['Avoid direct contact with water and perfume', 'Store in a dry velvet pouch', 'Wipe gently with a microfiber cloth'],
    shipping: 'Ships in 3-4 business days. Includes hand-pressed jute storage bag.',
    bestSeller: true,
    collectionId: 'matir-trishna',
    story: 'Woven entirely by hand, this statement piece pays homage to the legendary clay seals of Mainamati, capturing the abstract balance of clay and fire.'
  },
  {
    id: 'pot-kolsi-luxury',
    name: 'Nilkontho Terracotta Vessel',
    banglaName: 'নীলকণ্ঠ জল কলস',
    category: 'homeDecor',
    price: 195,
    image: homeDecorClayImg,
    images: [homeDecorClayImg, paintingProcessImg],
    description: 'An oversized decorative earthen vessel featuring hand-applied geometric clay slips. This signature archaeological form celebrates old-world water storage structures, reimagined as minimalist luxury pottery.',
    banglaDescription: 'হাতে আঁকা জ্যামিতিক নকশায় সমৃদ্ধ প্রাচীন জল কলসির এক চমৎকার আধুনিক সংস্করণ যা ঘরের সাজসজ্জায় নিয়ে আসবে ঐতিহ্যের স্পর্শ।',
    materials: ['High-fired river clay', 'Naturally-tinted slipware detailing', 'Unfinished exterior with waterproof inner seal'],
    care: ['Wipe clean with a damp warm cloth', 'Avoid using chemical detergents', 'Purely decorative, not intended for boiling liquids'],
    shipping: 'Ships in double-cushioned wooden storage crate to ensure safe delivery.',
    newArrival: true,
    collectionId: 'matir-trishna',
    story: 'This vessel is shaped entirely by foot-powered wheels, taking multiple days to cure slowly in shade before being fired in traditional earthen trenches.'
  },
  {
    id: 'bangles-mukta',
    name: 'Shakuntala Clay & Glass Bangles',
    banglaName: 'শকুন্তলা কাচ ও মৃগনক্ষত্র চূড়',
    category: 'bangles',
    price: 65,
    image: banglesStackImg,
    images: [banglesStackImg],
    description: 'A set of twelve hand-burnished glass and baked clay bangles in deep terracotta, olive, and ochre clay shades. Selected for their complementary gentle chiming sound and delicate organic textures.',
    banglaDescription: 'পোড়ামাটি ও রঙিন কাচের বারোটি চুড়ির এক চোখজুড়ানো সেট। সুন্দর মৃদু টুংটাং শব্দের সাথে অরণ্যের ছোঁয়া।',
    materials: ['Tempered local glass', 'Burnished fine riverbed clay beads', 'Natural gold pigment highlights'],
    care: ['Handle with delicate care', 'Keep away from sharp physical impact', 'Wipe with dry flannel'],
    shipping: 'Ships in 3-5 business days. Boxed in custom organic cotton sleeves.',
    bestSeller: false,
    newArrival: true,
    collectionId: 'bela-boshonto',
    story: 'Passed through temperatures over 900 degrees Celsius, these bangles merge the fragility of glass with the durability of soil, mimicking the balance of natural life.'
  },
  {
    id: 'saree-boshonto',
    name: 'The Aranya Clay Muslin Saree',
    banglaName: 'অরণ্য মসলিন শাড়ি',
    category: 'sarees',
    price: 420,
    image: paintingProcessImg, // Show painting process as product photo preview
    images: [paintingProcessImg, heroSareeImg],
    description: 'An extremely lightweight pure cotton muslin saree hand-painted with stylized organic patterns inspired by wild leaves and native creeping vines. Drapes like soft morning mist.',
    banglaDescription: 'অতি হালকা ও নিখুঁত সুতায় বোনা ঢাকাই মসলিন শাড়ি যাতে আঁকা হয়েছে বুনো লতা ও পাতার দৃষ্টিনন্দন নকশা।',
    materials: ['100% Pure extra-long staple Thread Muslin', 'Organic mud dyes and vegetable ink paste'],
    care: ['Dry clean is highly recommended', 'Store wrapped in acid-free white paper', 'Avoid harsh washing'],
    shipping: 'Ships in 10-12 business days since each piece is tailored post-order.',
    bestSeller: false,
    newArrival: true,
    collectionId: 'nokshi-shadh',
    story: 'Woven on wood looms under high relative humidity to prevent thread breakage, this saree is a triumph of traditional textile intelligence.'
  },
  {
    id: 'jewelry-alpana',
    name: 'Alpana Filigree Pin & Ear Studs',
    banglaName: 'আলপনা ঝুমকো ও চন্দ্রহার পিন',
    category: 'jewelry',
    price: 85,
    image: handmadeJewelryImg,
    images: [handmadeJewelryImg],
    description: 'An elegant pair of brass studs and matching traditional pin inspired by Bengal ritual floor paintings (Alpana). Features delicate circular brush-stroke engravings recreated on metal with high care.',
    banglaDescription: 'ঐতিহ্যবাহী আলপনা মোটিফে তৈরি কুন্ডল সেট যা আপনার সব ধরণের শৌখিন পোষাকের সৌন্দর্য বহুগুণ বাড়িয়ে দেবে।',
    materials: ['Hand-beaten eco-brass', 'Sterling silver posts for sensitive ears', 'Antiqued matte finish'],
    care: ['In case of oxidation, polish gently with jewelry brass cream', 'Keep away from moisture'],
    shipping: 'Ships in 3-5 business days. Carefully packaged in linen pouches.',
    bestSeller: false,
    newArrival: false,
    collectionId: 'bela-boshonto',
    story: 'Alpana represents welcoming spirits and celebrating the soil cycle. We have immortalized these temporary celebratory drawings onto metal.'
  },
  {
    id: 'saree-jamdani-sun',
    name: 'The Shurjomukhi Jamdani Saree',
    banglaName: 'সূর্যমুখী জামদানি শাড়ি',
    category: 'sarees',
    price: 495,
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=800&q=80'],
    description: 'A legendary master-loom production. This extremely fine handloom Jamdani saree features elaborate sun-burst geometric layups (Shurjomukhi), painstakingly woven using supplementary weft threads over countless evenings.',
    banglaDescription: 'একটি কিংবদন্তি জামদানি শাড়ি। অত্যন্ত সূক্ষ্ম সুতায় বোনা এই শাড়িতে রয়েছে ঐতিহ্যবাহী সূর্যমুখী জ্যামিতিক নকশার নিখুঁত বুনন, যা আপনাকে দেবে অতুলনীয় আভিজাত্য।',
    materials: ['Fine-staple high-count pure cotton warp', 'Metallic zari supplemental threads', 'Organic indigo dye base'],
    care: ['Dry wash recommended to protect supplemental wefts', 'Store inside acid-free paper wrapping', 'Avoid direct sunlight for prolonged durations'],
    shipping: 'Ships in 7-10 business days accompanied by a personalized hand-signed weaver credentials tag.',
    bestSeller: true,
    newArrival: true,
    collectionId: 'nokshi-shadh',
    story: 'Jamdani weaving is recognized by UNESCO as an Intangible Cultural Heritage. It requires two weavers seated side-by-side on a wooden bench, dynamically weaving motifs without any stencil or machinery.'
  },
  {
    id: 'decor-nokshi-rug',
    name: 'Sonargaon Nakshi Kantha Tapestry',
    banglaName: 'সোনারগাঁ নকশী কাঁথা চাদর',
    category: 'homeDecor',
    price: 240,
    image: 'https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1578301978693-85fa9c0320b9?auto=format&fit=crop&w=800&q=80', 'https://images.unsplash.com/photo-1528459801416-a9e53bbf4e17?auto=format&fit=crop&w=800&q=80'],
    description: 'An expansive hand-embroidered quilted tapestry with continuous ripple-run stitches representing rainstorms and native flowers. Designed to be styled as a premium throw or draped gallery installation.',
    banglaDescription: 'একটি বড় আকৃতির নকশী কাঁথা দেয়াল সজ্জা বা চাদর। নিখুঁত সেলাইয়ের মাধ্যমে বাংলার বর্ষার মেঘমালা ও বুনো ফুলের চমৎকার গল্প ফুটিয়ে তোলা হয়েছে এতে।',
    materials: ['Five layers of soft heritage cotton fabric', 'Hand-spun organic cotton threads', 'Natural madder root pigment dyes'],
    care: ['Gently hand wash in cold water using mild detergent', 'Flat dry in shade to preserve cotton structure', 'Low steam iron if necessary'],
    shipping: 'Ships in 4-6 business days in a custom sustainable handwoven bamboo container.',
    bestSeller: false,
    newArrival: true,
    collectionId: 'nokshi-shadh',
    story: 'Nakshi Kantha traces its roots to rural Bengal women who hand-quilted old garments to tell personal stories of longing, harvest, and wild monsoon storms.'
  },
  {
    id: 'decor-brass-urn',
    name: 'Kagojipara Hammered Brass Urn',
    banglaName: 'কাগজীপাড়া পেতলের ঘট',
    category: 'homeDecor',
    price: 155,
    image: 'https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=800&q=80'],
    description: 'A traditional heavy bell-metal water vessel meticulously hand-beaten with thousands of micro-hammer strikes by artisan blacksmiths. Represents Bengali festive abundance.',
    banglaDescription: 'হাতে পেটানো ঐতিহ্যবাহী কাঁসা ও পেতলের চমৎকার ঘট। হাজারো ছোট ছোট হাতুড়ির ঘায়ে তৈরি এই পাত্রটি গৃহের সৌন্দর্য ও আভিজাত্য দ্বিগুণ বাড়িয়ে তোলে।',
    materials: ['High-density pure recycled brass bell-metal alloy', 'Traditional charcoal-fired temper finish'],
    care: ['Clean with non-abrasive soft scrubber', 'Polish once a year with traditional lemon juice and salt paste', 'Wipe dry with a linen cloth immediately after washing'],
    shipping: 'Ships in 3-5 business days. Includes safety wooden casing.',
    bestSeller: true,
    newArrival: false,
    collectionId: 'matir-trishna',
    story: 'Artisan blacksmiths in Kagojipara have preserved the metallurgical arts of metal fusion since the Pala Empire, manually forging items in small cottage workshops using clay bellows.'
  },
  {
    id: 'decor-clay-tea',
    name: 'Rayerbazar Earthen Tea Set',
    banglaName: 'রায়েরবাজার মাটির চা পাত্র সেট',
    category: 'homeDecor',
    price: 75,
    image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80',
    images: ['https://images.unsplash.com/photo-1563245372-f21724e3856d?auto=format&fit=crop&w=800&q=80'],
    description: 'An elegant organic tea ceremony set comprising one hand-thrown clay kettle and six matching unglazed cups. Features subtle hand-sculpted relief lines.',
    banglaDescription: 'রায়েরবাজারের বিখ্যাত কুমারদের হাতে গড়া চমৎকার মাটির চা সেট। পরিবেশ বান্ধব ও সম্পূর্ণ রাসায়নিকহীন পোড়ামাটির এই সেট আপনার চা পানের মুহূর্তকে করবে উৎসবমুখর।',
    materials: ['High-fired Rayerbazar alluvial soil clay', 'Completely organic unglazed earth finish'],
    care: ['Rinse gently using warm running water', 'Do not clean with harsh synthetic steel scrubbers', 'Allow to dry completely before storing'],
    shipping: 'Ships in 3-5 business days in high-impact pulp cushioning modules.',
    bestSeller: false,
    newArrival: true,
    collectionId: 'bela-boshonto',
    story: 'Rayerbazar clay-craftsmen (Palas) have served Dhaka for over three centuries, turning deep earth of the Buriganga river into household essentials.'
  }
];

export const journalArticles: JournalArticle[] = [
  {
    id: 'story-of-soil',
    title: 'The Narrative of Riverbed Clay',
    banglaTitle: 'নদী ও মাটির আখ্যান',
    date: 'May 12, 2026',
    category: 'Craftsmanship',
    readTime: '6 min read',
    excerpt: 'Bengal\'s history runs deep in its soft fertile deposits. We track down how our earth vessels survive the transition from riverbeds to high-temperature ovens.',
    content: [
      'The clay deposited on the banks of the Meghna and Shitalakshya rivers is unlike any other in the world. Dense with organic silt, it possesses a plasticity that allows makers to mold shapes of astonishing delicacy without cracking. In our studio, we source this soil during low tides, filtering it through hand-woven jute screens to remove small pebbles and roots.',
      'Sajid Rahman, who has spent twenty-four years observing clay behavior, notes that clay holds memory. If you throw a pot too quickly, the clay retains the stress of the spin and will warp in the furnace. It requires a slow, ritualistic touch, keeping the wheel at a steady pace.',
      'After shaping, each item cures in a high-humidity shade chamber for ten days. Drying it too fast under the hot Bengal sun is catastrophic. The slow release of humidity ensures that when it finally meets the 1000-degree embers, it ring out with the deep metallic chime of authentic high-fired terracotta.'
    ],
    image: homeDecorClayImg,
    author: 'Sajid Rahman'
  },
  {
    id: 'poetry-of-saree',
    title: 'Wearable Murals: The Art of Fabric Painting',
    banglaTitle: 'পরিধানযোগ্য ক্যানভাসে রঙ',
    date: 'April 28, 2026',
    category: 'Design Philosophy',
    readTime: '8 min read',
    excerpt: 'Each saree is an active canvas. We step into the quiet atelier where designers spend hours breathing leafy organic patterns into sheets of delicate local silk.',
    content: [
      'A hand-painted saree is not merely clothing; it is a moving spatial installation. The fabric reacts directly to the bearer\'s breath and movement, shifting the light over hand-applied pigments. In the Rongo atelier, we treat every six yards as an unhurried, independent mural.',
      'The process begins with pre-washing the Rajshahi silk with wild soapberries (Reetha) to eliminate natural protective starches. Once stretched over a giant wooden frames, Anila Kabir maps the geometry with a erasable earth chalk. No two sarees are ever identical; each follows the natural rhythm of the brush on that specific afternoon.',
      'Our pigments are extracted from local madder root (for warm terracotta reds), absolute indigo leaves, and boiled pomegranate skins (for mute yellow-greens). By utilizing natural vegetable binders, we ensure that the colors remain breathing, aging gracefully alongside the cotton threads.'
    ],
    image: paintingProcessImg,
    author: 'Anila Kabir'
  },
  {
    id: 'alpana-symbolism',
    title: 'The Silent Code of Bengal Ritual Motifs',
    banglaTitle: 'আলপনা: রঙের আলতো ছোঁয়া',
    date: 'March 15, 2026',
    category: 'Heritage',
    readTime: '5 min read',
    excerpt: 'Behind every swirling motif of our Shakuntala bangles lies an ancient code. Discover the circular geometries that represent infinity, life, and harvest.',
    content: [
      'Alpana is a historic vernacular art form, drawn on floors during seasonal festivals using rice paste and water. It is a fleeting art, designed to wash away under the steps of guests. Yet, its visual structures carry deep mathematical and natural wisdom.',
      'The circular loops, leafy curves, and water wave patterns represent cycles of growth and celestial movements. In crafting our modern jewelry, Rongo works hard to preserve these specific strokes on permanent surfaces. We recreate the brush pressure on raw metals and clay to keep the spirit alive.',
      'By translating these dynamic ritual motifs into objects of daily luxury, we make sure that the ancient symbols of prosperity and cyclical gratitude are carried into modern lifestyles.'
    ],
    image: handmadeJewelryImg,
    author: 'Zainab Hossain'
  }
];

export const testimonials: Testimonial[] = [
  {
    id: '1',
    name: 'Farhana Ahmed',
    role: 'Art Historian & Collector',
    quote: '“Rongo has transformed how we see our cultural goods. The Nilufer saree is not just clothing; it is a preserved narrative that carries the quiet wind of the riverbeds.”',
    location: 'Dhaka'
  },
  {
    id: '2',
    name: 'Sophia Lindqvist',
    role: 'Sustainable Design Ethicist',
    quote: '“The terracotta vessels demonstrate a marvelous understanding of organic textures. The weight and raw finish are exceptional—a masterpiece of architectural pottery.”',
    location: 'Stockholm'
  },
  {
    id: '3',
    name: 'Adnan Chowdhury',
    role: 'Creative Director',
    quote: '“The attention to details is magnificent. To own a piece from the Matir Trishna collection is to own a slice of living Bengal history.”',
    location: 'Lymington, UK'
  }
];
