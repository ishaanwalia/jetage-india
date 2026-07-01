
export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  subcategory: string;
  price: number;
  originalPrice: number;
  badge: string;
  description: string;
  shortSpecs: string[];
  features: string[];
  specifications: Record<string, string>;
  useCases: string[];
  types: string[];
  proTips: string[];
  compatibleWith: string[];
  inBox: string[];
  warranty: string;
  images: string[];
  stock: number;
  rating: number;
  reviews: number;
  isNew: boolean;
  isBestseller: boolean;
}

export const categories = [
  { id: 'all', name: 'All Products', icon: 'LayoutGrid' },
  { id: 'inkjet-printers', name: 'Inkjet Printers', icon: 'Printer' },
  { id: 'laser-printers', name: 'Laser Printers', icon: 'Scan' },
  { id: 'color-laser', name: 'Color Laser', icon: 'Palette' },
  { id: 'accessories', name: 'Accessories', icon: 'Mouse' },
];

export const products: Product[] = [
{
    id: 'hp-z3700-mouse',
    slug: 'hp-z3700-wireless-mouse',
    name: 'HP Z3700 Wireless Mouse',
    category: 'accessories',
    subcategory: 'Mouse',
    price: 1299,
    originalPrice: 1799,
    badge: 'Best Price',
    description: 'Sleek wireless mouse with 2.4 GHz connectivity. 1200 DPI precision, 16-month battery life, and ambidextrous design. Perfect for everyday computing.',
    shortSpecs: ['Wireless 2.4 GHz', '1200 DPI', '16-Month Battery', 'Ambidextrous'],
    features: [
      '2.4 GHz wireless connectivity',
      '1200 DPI optical sensor',
      'Up to 16-month battery life',
      'Ambidextrous design',
      'Plug-and-play USB receiver',
      'Sleek and portable',
      'Compatible with all operating systems'
    ],
    specifications: {
      'Connectivity': '2.4 GHz Wireless',
      'Sensor': 'Optical, 1200 DPI',
      'Buttons': '3 (Left, Right, Scroll)',
      'Battery Life': 'Up to 16 months',
      'Battery Type': '1 x AA (included)',
      'Range': 'Up to 10 meters',
      'Dimensions': '57 x 98 x 31 mm',
      'Weight': '56 g (without battery)',
      'Color': 'Black/Silver',
      'Warranty': '1 Year'
    },
    useCases: ['Home', 'Office', 'Students', 'Travel'],
    types: ['Wireless Mouse', 'Optical', 'Portable'],
    proTips: [
      'Use high-quality AA battery for best life',
      'Store USB receiver in mouse when traveling',
      'Works on most surfaces except glass',
      'Turn off when not in use to extend battery'
    ],
    compatibleWith: ['Windows', 'macOS', 'Linux', 'Chrome OS'],
    inBox: [
      'HP Z3700 Wireless Mouse',
      'USB Nano Receiver',
      '1 x AA Battery',
      'User Documentation'
    ],
    warranty: '1 Year HP Limited Warranty.',
    images: ['/images/products/hp-z3700-mouse-1.jpg', '/images/products/hp-z3700-mouse-2.jpg'],
    stock: 50,
    rating: 4.2,
    reviews: 567,
    isNew: false,
    isBestseller: false
  },
  {
    id: 'hp-m10-mouse',
    slug: 'hp-m10-wired-mouse',
    name: 'HP M10 Wired Mouse',
    category: 'accessories',
    subcategory: 'Mouse',
    price: 399,
    originalPrice: 599,
    badge: 'Best Price',
    description: 'Affordable wired optical mouse with 1000 DPI. USB connectivity, ergonomic design, and reliable performance for everyday use.',
    shortSpecs: ['Wired USB', '1000 DPI', 'Ergonomic', 'Plug & Play'],
    features: [
      'USB wired connectivity',
      '1000 DPI optical sensor',
      'Ergonomic comfortable design',
      'Plug-and-play setup',
      '3 buttons with scroll wheel',
      'Durable build quality',
      'Compatible with all systems'
    ],
    specifications: {
      'Connectivity': 'USB 2.0 Wired',
      'Sensor': 'Optical, 1000 DPI',
      'Buttons': '3 (Left, Right, Scroll)',
      'Cable Length': '1.5 meters',
      'Dimensions': '60 x 105 x 38 mm',
      'Weight': '85 g',
      'Color': 'Black',
      'Warranty': '1 Year'
    },
    useCases: ['Home', 'Office', 'Students', 'Basic Computing'],
    types: ['Wired Mouse', 'Optical', 'Budget'],
    proTips: [
      'Most affordable HP mouse',
      'No battery needed - always ready',
      'Use mouse pad for best tracking',
      'Clean sensor regularly for accuracy'
    ],
    compatibleWith: ['Windows', 'macOS', 'Linux', 'Chrome OS'],
    inBox: [
      'HP M10 Wired Mouse',
      'User Documentation'
    ],
    warranty: '1 Year HP Limited Warranty.',
    images: ['/images/products/hp-m10-mouse-1.jpg', '/images/products/hp-m10-mouse-2.jpg'],
    stock: 100,
    rating: 4.0,
    reviews: 892,
    isNew: false,
    isBestseller: false
  },
  {
    id: 'hp-s500-mouse',
    slug: 'hp-s500-wireless-mouse',
    name: 'HP S500 Wireless Mouse',
    category: 'accessories',
    subcategory: 'Mouse',
    price: 899,
    originalPrice: 1299,
    badge: 'Popular',
    description: 'Wireless mouse with 2.4 GHz connectivity and 1600 DPI. Ergonomic design, 12-month battery life, and precise tracking for productivity.',
    shortSpecs: ['Wireless 2.4 GHz', '1600 DPI', '12-Month Battery', 'Ergonomic'],
    features: [
      '2.4 GHz wireless with USB receiver',
      '1600 DPI high-precision sensor',
      'Up to 12-month battery life',
      'Ergonomic right-hand design',
      '5 buttons including forward/backward',
      'Plug-and-play setup',
      'Compatible with all systems'
    ],
    specifications: {
      'Connectivity': '2.4 GHz Wireless',
      'Sensor': 'Optical, 1600 DPI',
      'Buttons': '5 (Left, Right, Scroll, Forward, Back)',
      'Battery Life': 'Up to 12 months',
      'Battery Type': '1 x AA (included)',
      'Range': 'Up to 10 meters',
      'Dimensions': '65 x 105 x 38 mm',
      'Weight': '75 g (without battery)',
      'Color': 'Black',
      'Warranty': '1 Year'
    },
    useCases: ['Office', 'Home', 'Students', 'Gaming Light'],
    types: ['Wireless Mouse', 'Optical', 'Ergonomic'],
    proTips: [
      'Use high-quality AA battery',
      '5 buttons for improved productivity',
      '1600 DPI for precise cursor control',
      'Store receiver in mouse bottom when traveling'
    ],
    compatibleWith: ['Windows', 'macOS', 'Linux', 'Chrome OS'],
    inBox: [
      'HP S500 Wireless Mouse',
      'USB Nano Receiver',
      '1 x AA Battery',
      'User Documentation'
    ],
    warranty: '1 Year HP Limited Warranty.',
    images: ['/images/products/hp-s500-mouse-1.jpg', '/images/products/hp-s500-mouse-2.jpg'],
    stock: 60,
    rating: 4.3,
    reviews: 445,
    isNew: false,
    isBestseller: false
  },
  {
    id: 'hp-k160-keyboard',
    slug: 'hp-k160-wired-keyboard',
    name: 'HP K160 Wired Keyboard',
    category: 'accessories',
    subcategory: 'Keyboard',
    price: 799,
    originalPrice: 1099,
    badge: 'Best Price',
    description: 'Full-size wired keyboard with number pad. Durable keys, spill-resistant design, and comfortable typing for everyday use.',
    shortSpecs: ['Wired USB', 'Full-Size', 'Spill-Resistant', 'Number Pad'],
    features: [
      'Full-size 104-key layout with number pad',
      'USB wired connectivity',
      'Spill-resistant design',
      'Durable key switches',
      'Adjustable tilt legs',
      'Plug-and-play setup',
      'Compatible with all systems'
    ],
    specifications: {
      'Connectivity': 'USB 2.0 Wired',
      'Layout': 'Full-size 104 keys',
      'Key Type': 'Membrane',
      'Cable Length': '1.5 meters',
      'Dimensions': '450 x 170 x 25 mm',
      'Weight': '550 g',
      'Color': 'Black',
      'Special Features': 'Spill-resistant, Adjustable tilt',
      'Warranty': '1 Year'
    },
    useCases: ['Office', 'Home', 'Students', 'Basic Computing'],
    types: ['Wired Keyboard', 'Full-Size', 'Membrane'],
    proTips: [
      'Most affordable HP full-size keyboard',
      'Spill-resistant for accidental liquid exposure',
      'Adjustable tilt for comfortable typing angle',
      'Clean keys regularly for best performance'
    ],
    compatibleWith: ['Windows', 'macOS', 'Linux', 'Chrome OS'],
    inBox: [
      'HP K160 Wired Keyboard',
      'User Documentation'
    ],
    warranty: '1 Year HP Limited Warranty.',
    images: ['/images/products/hp-k160-keyboard-1.jpg', '/images/products/hp-k160-keyboard-2.jpg'],
    stock: 80,
    rating: 4.1,
    reviews: 678,
    isNew: false,
    isBestseller: false
  },
  {
    id: 'hp-km260-combo',
    slug: 'hp-km260-wireless-keyboard-mouse-combo',
    name: 'HP KM260 Wireless Keyboard and Mouse Combo',
    category: 'accessories',
    subcategory: 'Combo',
    price: 1699,
    originalPrice: 2299,
    badge: 'Popular',
    description: 'Wireless keyboard and mouse combo with 2.4 GHz connectivity. Full-size keyboard with multimedia keys and ergonomic wireless mouse.',
    shortSpecs: ['Wireless 2.4 GHz', 'Full-Size Keyboard', '1200 DPI Mouse', '12-Month Battery'],
    features: [
      '2.4 GHz wireless combo with single USB receiver',
      'Full-size keyboard with 12 multimedia keys',
      'Wireless mouse with 1200 DPI',
      'Up to 12-month battery life',
      'Spill-resistant keyboard design',
      'Adjustable keyboard tilt legs',
      'Plug-and-play setup'
    ],
    specifications: {
      'Keyboard Connectivity': '2.4 GHz Wireless',
      'Mouse Connectivity': '2.4 GHz Wireless (shared receiver)',
      'Keyboard Layout': 'Full-size 104 keys + 12 multimedia',
      'Mouse Sensor': 'Optical, 1200 DPI',
      'Keyboard Battery': '2 x AAA (included)',
      'Mouse Battery': '1 x AA (included)',
      'Range': 'Up to 10 meters',
      'Keyboard Dimensions': '450 x 170 x 25 mm',
      'Mouse Dimensions': '60 x 100 x 35 mm',
      'Keyboard Weight': '500 g',
      'Mouse Weight': '70 g (without battery)',
      'Color': 'Black',
      'Warranty': '1 Year'
    },
    useCases: ['Office', 'Home', 'Students', 'Productivity'],
    types: ['Wireless Combo', 'Full-Size', 'Multimedia'],
    proTips: [
      'Single USB receiver for both devices',
      'Multimedia keys for quick access to functions',
      'Store receiver in mouse when not in use',
      'Use high-quality batteries for best life'
    ],
    compatibleWith: ['Windows', 'macOS', 'Linux', 'Chrome OS'],
    inBox: [
      'HP KM260 Wireless Keyboard',
      'HP KM260 Wireless Mouse',
      'USB Nano Receiver',
      '2 x AAA Batteries (Keyboard)',
      '1 x AA Battery (Mouse)',
      'User Documentation'
    ],
    warranty: '1 Year HP Limited Warranty.',
    images: ['/images/products/hp-km260-combo-1.jpg', '/images/products/hp-km260-combo-2.jpg'],
    stock: 45,
    rating: 4.3,
    reviews: 334,
    isNew: false,
    isBestseller: false
  },
  {
    id: 'hp-km160-combo',
    slug: 'hp-km160-wired-keyboard-mouse-combo',
    name: 'HP KM160 Wired Keyboard and Mouse Combo',
    category: 'accessories',
    subcategory: 'Combo',
    price: 999,
    originalPrice: 1399,
    badge: 'Best Price',
    description: 'Affordable wired keyboard and mouse combo. Full-size keyboard with number pad and optical mouse. Reliable performance for everyday computing.',
    shortSpecs: ['Wired USB', 'Full-Size Keyboard', '1000 DPI Mouse', 'Plug & Play'],
    features: [
      'Wired USB combo - single cable for both',
      'Full-size keyboard with number pad',
      'Optical mouse with 1000 DPI',
      'Spill-resistant keyboard',
      'Adjustable keyboard tilt',
      'Durable build quality',
      'Plug-and-play setup'
    ],
    specifications: {
      'Keyboard Connectivity': 'USB 2.0 Wired',
      'Mouse Connectivity': 'USB 2.0 Wired (shared cable)',
      'Keyboard Layout': 'Full-size 104 keys',
      'Mouse Sensor': 'Optical, 1000 DPI',
      'Cable Length': '1.5 meters',
      'Keyboard Dimensions': '445 x 165 x 25 mm',
      'Mouse Dimensions': '60 x 105 x 38 mm',
      'Keyboard Weight': '520 g',
      'Mouse Weight': '85 g',
      'Color': 'Black',
      'Warranty': '1 Year'
    },
    useCases: ['Home', 'Office', 'Students', 'Basic Computing'],
    types: ['Wired Combo', 'Full-Size', 'Budget'],
    proTips: [
      'Most affordable HP keyboard-mouse combo',
      'No batteries needed - always ready',
      'Shared cable reduces desk clutter',
      'Great for basic computing needs'
    ],
    compatibleWith: ['Windows', 'macOS', 'Linux', 'Chrome OS'],
    inBox: [
      'HP KM160 Wired Keyboard',
      'HP KM160 Wired Mouse',
      'User Documentation'
    ],
    warranty: '1 Year HP Limited Warranty.',
    images: ['/images/products/hp-km160-combo-1.jpg', '/images/products/hp-km160-combo-2.jpg'],
    stock: 75,
    rating: 4.0,
    reviews: 567,
    isNew: false,
    isBestseller: false
  },
];

export function getProductBySlug(slug: string): Product | undefined {
  return products.find(p => p.slug === slug);
}

export function getProductsByCategory(category: string): Product[] {
  if (category === 'all') return products;
  return products.filter(p => p.category === category);
}

export function getFeaturedProducts(): Product[] {
  return products.filter(p => p.isBestseller || p.isNew).slice(0, 8);
}

export function getRelatedProducts(productId: string): Product[] {
  const product = products.find(p => p.id === productId);
  if (!product) return [];
  return products
    .filter(p => p.category === product.category && p.id !== productId)
    .slice(0, 4);
}

export function searchProducts(query: string): Product[] {
  const lowerQuery = query.toLowerCase();
  return products.filter(p =>
    p.name.toLowerCase().includes(lowerQuery) ||
    p.description.toLowerCase().includes(lowerQuery) ||
    p.category.toLowerCase().includes(lowerQuery) ||
    p.subcategory.toLowerCase().includes(lowerQuery)
  );
}
