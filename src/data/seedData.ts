import {
  Product,
  CategoryItem,
  Banner,
  ProductReview,
  Order,
  OfflineSale,
  Expense,
  AdminSettings,
  InventoryMovement,
  AppNotification
} from '../types';

export const INITIAL_CATEGORIES: CategoryItem[] = [
  {
    id: 'cat-1',
    name: 'Dvoykalar',
    iconName: 'Layers',
    imageUrl: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=400&q=80',
    itemCount: 18,
    gender: 'barchasi',
    isActive: true
  },
  {
    id: 'cat-2',
    name: 'Kurtkalar',
    iconName: 'Shield',
    imageUrl: 'https://images.unsplash.com/photo-1577975882846-431adc8c2009?auto=format&fit=crop&w=400&q=80',
    itemCount: 12,
    gender: 'barchasi',
    isActive: true
  },
  {
    id: 'cat-3',
    name: 'Ko‘ylaklar',
    iconName: 'HeartHandshake',
    imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=400&q=80',
    itemCount: 24,
    gender: 'qiz',
    isActive: true
  },
  {
    id: 'cat-4',
    name: 'Futbolkalar',
    iconName: 'Shirt',
    imageUrl: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=400&q=80',
    itemCount: 32,
    gender: 'barchasi',
    isActive: true
  },
  {
    id: 'cat-5',
    name: 'Shimlar',
    iconName: 'Columns2',
    imageUrl: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&w=400&q=80',
    itemCount: 19,
    gender: 'barchasi',
    isActive: true
  },
  {
    id: 'cat-6',
    name: 'Sport kiyimlari',
    iconName: 'Activity',
    imageUrl: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=400&q=80',
    itemCount: 15,
    gender: 'barchasi',
    isActive: true
  },
  {
    id: 'cat-7',
    name: 'Kostyumlar',
    iconName: 'Award',
    imageUrl: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=400&q=80',
    itemCount: 10,
    gender: 'ogil',
    isActive: true
  },
  {
    id: 'cat-8',
    name: 'Qishki kiyimlar',
    iconName: 'Snowflake',
    imageUrl: 'https://images.unsplash.com/photo-1517677208171-0bc6725a3e60?auto=format&fit=crop&w=400&q=80',
    itemCount: 14,
    gender: 'barchasi',
    isActive: true
  },
  {
    id: 'cat-9',
    name: 'Yozgi kiyimlar',
    iconName: 'Sun',
    imageUrl: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=400&q=80',
    itemCount: 28,
    gender: 'barchasi',
    isActive: true
  },
  {
    id: 'cat-10',
    name: 'Poyabzallar',
    iconName: 'Footprints',
    imageUrl: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=400&q=80',
    itemCount: 16,
    gender: 'barchasi',
    isActive: true
  },
  {
    id: 'cat-11',
    name: 'Aksessuarlar',
    iconName: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=400&q=80',
    itemCount: 20,
    gender: 'barchasi',
    isActive: true
  }
];

export const INITIAL_BANNERS: Banner[] = [
  {
    id: 'ban-main',
    title: 'Mittivoy Bolalar Kiyimlari',
    subtitle: '1 yoshdan 15 yoshgacha bo‘lgan bolajonlar uchun eng yaxshi tanlov! Kichiklar uchun — katta orzular!',
    tag: 'YANGI TO‘PLAM 2026',
    imageUrl: '/assets/aistudio/file_00000000fd48820cb51afb6b30d35335_1e8cfe0a.png',
    linkCategory: 'Dvoykalar',
    isActive: true,
    order: 1
  },
  {
    id: 'ban-2',
    title: 'Super Chegirmalar — 40% gacha',
    subtitle: 'Qizaloqlar uchun nafis ko‘ylak va sport to‘plamlari',
    tag: 'CHEGIRMA',
    imageUrl: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=1000&q=80',
    linkCategory: 'Ko‘ylaklar',
    isActive: true,
    order: 2
  },
  {
    id: 'ban-3',
    title: 'O‘g‘il Bolalar uchun Kurtka & Nimchalar',
    subtitle: 'Shamol va yomg‘ir o‘tkazmaydigan yumshoq astarli',
    tag: 'TREND',
    imageUrl: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=1000&q=80',
    linkCategory: 'Kurtkalar',
    isActive: true,
    order: 3
  }
];

export const INITIAL_PRODUCTS: Product[] = [
  {
    id: 'prod-1',
    code: 'MT-1041',
    name: 'Yumshoq Paxtali Bahorgi Dvoyka To‘plami',
    description: 'Bolalar terisiga xush yoquvchi 100% tabiiy paxta matosidan tikilgan qulay svitshot va shim dvoykasi. Qomatni siqmaydi, yuvilganda rangi o‘chmaydi.',
    category: 'Dvoykalar',
    gender: 'uniseks',
    ageGroup: '1-3',
    costPrice: 95000,
    sellingPrice: 175000,
    discountPrice: 149000,
    mainImage: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1519689680058-324335c77eba?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewCount: 38,
    fabric: '100% Organik Paxta (Turkiya)',
    isNewArrival: true,
    isBestseller: true,
    isRecommended: true,
    createdAt: '2026-03-01',
    variants: [
      { id: 'v1-1', color: 'Osmonrang', colorHex: '#7dd3fc', size: '80 (1 yosh)', stock: 8, soldCount: 14 },
      { id: 'v1-2', color: 'Osmonrang', colorHex: '#7dd3fc', size: '92 (2 yosh)', stock: 6, soldCount: 20 },
      { id: 'v1-3', color: 'Och Pushti', colorHex: '#f472b6', size: '80 (1 yosh)', stock: 5, soldCount: 9 },
      { id: 'v1-4', color: 'Och Pushti', colorHex: '#f472b6', size: '98 (3 yosh)', stock: 3, soldCount: 18 }
    ]
  },
  {
    id: 'prod-2',
    code: 'MT-1042',
    name: 'Nafis Gullik Qizaloqlar Ko‘ylagi',
    description: 'Bahoriy nafis guldor gullar bilan bezatilgan bayramona va kundalik paxtali ko‘ylak. Ichki tomoni yumshoq paxta astarli.',
    category: 'Ko‘ylaklar',
    gender: 'qiz',
    ageGroup: '4-6',
    costPrice: 110000,
    sellingPrice: 195000,
    discountPrice: 165000,
    mainImage: 'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1622290291468-a28f7a7dc6a8?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1518831959646-742c3a14ebf7?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 24,
    fabric: '95% Paxta, 5% Elastan',
    isNewArrival: true,
    isBestseller: false,
    isRecommended: true,
    createdAt: '2026-03-05',
    variants: [
      { id: 'v2-1', color: 'Pushti Krem', colorHex: '#fbcfe8', size: '104 (4 yosh)', stock: 7, soldCount: 8 },
      { id: 'v2-2', color: 'Pushti Krem', colorHex: '#fbcfe8', size: '110 (5 yosh)', stock: 4, soldCount: 11 },
      { id: 'v2-3', color: 'Yalpiz Rang', colorHex: '#a7f3d0', size: '116 (6 yosh)', stock: 2, soldCount: 5 }
    ]
  },
  {
    id: 'prod-3',
    code: 'MT-1043',
    name: 'Klassik Jentlmen Kostyum-Shim',
    description: 'Tantanalar, maktab tadbirlari va to‘ylar uchun o‘g‘il bolalar kostyum-shimi. Matosi dazmol talab qilmaydigan zamonaviy sifatli gazlama.',
    category: 'Kostyumlar',
    gender: 'ogil',
    ageGroup: '7-9',
    costPrice: 180000,
    sellingPrice: 320000,
    discountPrice: 289000,
    mainImage: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 5.0,
    reviewCount: 19,
    fabric: 'Klassik Kostyumbop Matosi',
    isNewArrival: false,
    isBestseller: true,
    isRecommended: true,
    createdAt: '2026-02-15',
    variants: [
      { id: 'v3-1', color: 'To‘q Ko‘k', colorHex: '#1e3a8a', size: '122 (7 yosh)', stock: 5, soldCount: 12 },
      { id: 'v3-2', color: 'To‘q Ko‘k', colorHex: '#1e3a8a', size: '128 (8 yosh)', stock: 6, soldCount: 9 },
      { id: 'v3-3', color: 'Kulrang', colorHex: '#94a3b8', size: '134 (9 yosh)', stock: 3, soldCount: 7 }
    ]
  },
  {
    id: 'prod-4',
    code: 'MT-1044',
    name: 'Shamoldan Himoyalovchi Yengil Kurtka',
    description: 'Qulay kapyushonli, zamonaviy reflektor chiziqli, suv va shamol o‘tkazmaydigan demi-sezon bolalar kurtkasi.',
    category: 'Kurtkalar',
    gender: 'uniseks',
    ageGroup: '10-12',
    costPrice: 150000,
    sellingPrice: 260000,
    discountPrice: 229000,
    mainImage: 'https://images.unsplash.com/photo-1577975882846-431adc8c2009?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1577975882846-431adc8c2009?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewCount: 31,
    fabric: 'Waterproof Membrana & Paxta Astar',
    isNewArrival: true,
    isBestseller: true,
    isRecommended: false,
    createdAt: '2026-03-10',
    variants: [
      { id: 'v4-1', color: 'Sariq Pastel', colorHex: '#fef08a', size: '140 (10 yosh)', stock: 4, soldCount: 16 },
      { id: 'v4-2', color: 'Yashil Haki', colorHex: '#4d7c0f', size: '146 (11 yosh)', stock: 7, soldCount: 10 },
      { id: 'v4-3', color: 'To‘q Ko‘k', colorHex: '#1e293b', size: '152 (12 yosh)', stock: 1, soldCount: 14 }
    ]
  },
  {
    id: 'prod-5',
    code: 'MT-1045',
    name: 'Yoshlar Sport To‘plami (Hoodie + Jogger)',
    description: 'O‘smirlar (13-15 yosh) uchun eng zamonaviy oversize uslubdagi 3 ipli qalin paxtali sport to‘plami. Mashg‘ulotlar va sayr uchun ideal.',
    category: 'Sport kiyimlari',
    gender: 'ogil',
    ageGroup: '13-15',
    costPrice: 190000,
    sellingPrice: 340000,
    discountPrice: 299000,
    mainImage: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewCount: 42,
    fabric: '3 Ipli Premium Futer (Paxta)',
    isNewArrival: false,
    isBestseller: true,
    isRecommended: true,
    createdAt: '2026-02-20',
    variants: [
      { id: 'v5-1', color: 'Qora', colorHex: '#0f172a', size: '158 (13-14 yosh)', stock: 9, soldCount: 22 },
      { id: 'v5-2', color: 'Bej / Qumrang', colorHex: '#e2d9cc', size: '164 (15 yosh)', stock: 4, soldCount: 19 }
    ]
  },
  {
    id: 'prod-6',
    code: 'MT-1046',
    name: 'Keng Qizlar Dvoykasi (Top + Keng Shim)',
    description: 'Zamonaviy qizaloqlar uchun chiroyli pastel rangli, erkin harakatlanish imkonini beruvchi shinam yozgi to‘plam.',
    category: 'Dvoykalar',
    gender: 'qiz',
    ageGroup: '10-12',
    costPrice: 120000,
    sellingPrice: 210000,
    discountPrice: 185000,
    mainImage: 'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1516627145497-ae6968895b74?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.7,
    reviewCount: 15,
    fabric: '97% Paxta, 3% Laykra',
    isNewArrival: true,
    isBestseller: false,
    isRecommended: true,
    createdAt: '2026-03-12',
    variants: [
      { id: 'v6-1', color: 'Lavanda', colorHex: '#e9d5ff', size: '140 (10 yosh)', stock: 6, soldCount: 6 },
      { id: 'v6-2', color: 'Och Pushti', colorHex: '#fbcfe8', size: '146 (11-12 yosh)', stock: 3, soldCount: 9 }
    ]
  },
  {
    id: 'prod-7',
    code: 'MT-1047',
    name: 'Paxtali Yozgi Futbolka va Shortik To‘plami',
    description: 'Chaqaloqlar va 1-3 yosh bolalar uchun eng qulay yozgi kiyim. Nafas oluvchi paxta, qorin qismida qisib qo‘ymaydigan yumshoq rezina.',
    category: 'Yozgi kiyimlar',
    gender: 'uniseks',
    ageGroup: '1-3',
    costPrice: 65000,
    sellingPrice: 125000,
    discountPrice: 99000,
    mainImage: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.9,
    reviewCount: 53,
    fabric: '100% Yupqa Paxta Kulirka',
    isNewArrival: false,
    isBestseller: true,
    isRecommended: true,
    createdAt: '2026-02-10',
    variants: [
      { id: 'v7-1', color: 'Moviy', colorHex: '#93c5fd', size: '86 (1-2 yosh)', stock: 12, soldCount: 30 },
      { id: 'v7-2', color: 'Oq', colorHex: '#ffffff', size: '92 (2-3 yosh)', stock: 8, soldCount: 25 }
    ]
  },
  {
    id: 'prod-8',
    code: 'MT-1048',
    name: 'Bolalar Qulay Ortopedik Krossovkasi',
    description: 'Yengil taglik, bolaning tovonini mustahkam ushlovchi qulay orqa qism va qulay yopishqoq tasma (lipuchka). Sayr va sport uchun qulay.',
    category: 'Poyabzallar',
    gender: 'uniseks',
    ageGroup: '4-6',
    costPrice: 110000,
    sellingPrice: 199000,
    discountPrice: 179000,
    mainImage: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1560769629-975ec94e6a86?auto=format&fit=crop&w=800&q=80'
    ],
    rating: 4.8,
    reviewCount: 27,
    fabric: 'Eko-charim & Nafas oluvchi to‘r',
    isNewArrival: true,
    isBestseller: false,
    isRecommended: true,
    createdAt: '2026-03-08',
    variants: [
      { id: 'v8-1', color: 'Oq / Moviy', colorHex: '#e0f2fe', size: '26 (16.5 sm)', stock: 5, soldCount: 11 },
      { id: 'v8-2', color: 'Oq / Pushti', colorHex: '#fce7f3', size: '28 (17.5 sm)', stock: 4, soldCount: 8 },
      { id: 'v8-3', color: 'Kulrang', colorHex: '#e2e8f0', size: '30 (18.5 sm)', stock: 2, soldCount: 14 }
    ]
  }
];

export const INITIAL_REVIEWS: ProductReview[] = [
  {
    id: 'rev-1',
    productId: 'prod-1',
    userName: 'Dilnoza Karimova',
    userPhoneMasked: '+998 90 *** ** 41',
    rating: 5,
    comment: 'Mittivoy do‘konidan ikkinchi marta olyapman. Matosi juda yumshoq, paxtasi toza ekan. O‘g‘lim 2 yoshda, 92 o‘lchami aynan tushdi!',
    date: '2026-03-15',
    isVerifiedPurchase: true,
    approved: true
  },
  {
    id: 'rev-2',
    productId: 'prod-1',
    userName: 'Shahnoza Alimova',
    userPhoneMasked: '+998 93 *** ** 88',
    rating: 5,
    comment: 'Rangi xuddi rasmdagidek osmonrang! Yetkazib berish juda tez bo‘ldi, rahmat sizlarga.',
    date: '2026-03-18',
    isVerifiedPurchase: true,
    approved: true
  },
  {
    id: 'rev-3',
    productId: 'prod-2',
    userName: 'Malika Ergasheva',
    userPhoneMasked: '+998 97 *** ** 20',
    rating: 5,
    comment: 'Qizim ko‘ylakni yechmay kiyib yuribdi! Tikilishi juda toza, ipi chiqib qolmagan. Tavsiya qilaman.',
    date: '2026-03-21',
    isVerifiedPurchase: true,
    approved: true
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ord-101',
    orderNumber: 'MT-2026-1049',
    customerName: 'Zarina Rahimova',
    customerPhone: '+998 90 123 45 67',
    region: 'Toshkent shahri',
    district: 'Yunusobod tumani',
    address: 'Amir Temur ko‘chasi, 45-uy, 12-xonadon',
    notes: 'Iltimos, soat 14:00 dan keyin yetkazib bering.',
    items: [
      {
        productId: 'prod-1',
        productName: 'Yumshoq Paxtali Bahorgi Dvoyka To‘plami',
        productCode: 'MT-1041',
        image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
        color: 'Osmonrang',
        size: '92 (2 yosh)',
        quantity: 1,
        unitPrice: 149000,
        totalPrice: 149000,
        costPrice: 95000
      },
      {
        productId: 'prod-7',
        productName: 'Paxtali Yozgi Futbolka va Shortik To‘plami',
        productCode: 'MT-1047',
        image: 'https://images.unsplash.com/photo-1514090458221-65bb69cf63e6?auto=format&fit=crop&w=800&q=80',
        color: 'Moviy',
        size: '92 (2-3 yosh)',
        quantity: 1,
        unitPrice: 99000,
        totalPrice: 99000,
        costPrice: 65000
      }
    ],
    subtotal: 248000,
    deliveryFee: 25000,
    discount: 0,
    totalAmount: 273000,
    totalCost: 160000,
    status: 'To‘lov tekshirilmoqda',
    paymentMethod: 'Click',
    paymentStatus: 'Tekshirilmoqda',
    paymentTransactionId: 'CLK-99812401',
    paymentReceiptUrl: 'https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?auto=format&fit=crop&w=600&q=80',
    paymentNote: 'Click orqali to‘landi, chek yuklandi',
    createdAt: '2026-03-24 10:30',
    updatedAt: '2026-03-24 10:32',
    isOnline: true
  },
  {
    id: 'ord-102',
    orderNumber: 'MT-2026-1048',
    customerName: 'Otabek Mirzayev',
    customerPhone: '+998 94 987 65 43',
    region: 'Samarqand viloyati',
    district: 'Samarqand shahri',
    address: 'Buyuk Ipak Yo‘li, 12-uy',
    items: [
      {
        productId: 'prod-3',
        productName: 'Klassik Jentlmen Kostyum-Shim',
        productCode: 'MT-1043',
        image: 'https://images.unsplash.com/photo-1503919545889-aef636e10ad4?auto=format&fit=crop&w=800&q=80',
        color: 'To‘q Ko‘k',
        size: '128 (8 yosh)',
        quantity: 1,
        unitPrice: 289000,
        totalPrice: 289000,
        costPrice: 180000
      }
    ],
    subtotal: 289000,
    deliveryFee: 30000,
    discount: 0,
    totalAmount: 319000,
    totalCost: 180000,
    status: 'Tayyorlanmoqda',
    paymentMethod: 'Paynet',
    paymentStatus: 'Tasdiqlandi',
    paymentTransactionId: 'PNT-381042',
    createdAt: '2026-03-23 16:45',
    updatedAt: '2026-03-23 17:00',
    isOnline: true
  }
];

export const INITIAL_OFFLINE_SALES: OfflineSale[] = [
  {
    id: 'pos-1',
    receiptNumber: 'CHK-POS-0081',
    cashierName: 'Feruza (Kassir 1)',
    items: [
      {
        productId: 'prod-1',
        productName: 'Yumshoq Paxtali Bahorgi Dvoyka To‘plami',
        productCode: 'MT-1041',
        image: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?auto=format&fit=crop&w=800&q=80',
        color: 'Osmonrang',
        size: '80 (1 yosh)',
        quantity: 1,
        unitPrice: 149000,
        totalPrice: 149000,
        costPrice: 95000
      }
    ],
    subtotal: 149000,
    discount: 0,
    totalAmount: 149000,
    totalCost: 95000,
    paymentMethod: 'Click',
    customerName: 'Do‘konga tashrif buyuruvchi',
    createdAt: '2026-03-24 11:15',
    synced: true
  }
];

export const INITIAL_EXPENSES: Expense[] = [
  {
    id: 'exp-1',
    title: 'Turkiyadan yangi dvoykalar partiyasi xaridi',
    amount: 8500000,
    date: '2026-03-01',
    category: 'Mahsulot xaridi',
    note: '100 dona dvoyka va kurtkalar'
  },
  {
    id: 'exp-2',
    title: 'Do‘kon ijarasi (Mart oyi)',
    amount: 4000000,
    date: '2026-03-05',
    category: 'Ijara',
    note: 'Shahar markazidagi do‘kon'
  },
  {
    id: 'exp-3',
    title: 'Sotuvchi va kuryer maoshi',
    amount: 3500000,
    date: '2026-03-10',
    category: 'Ish haqi',
    note: 'Mart oyi uchun oylik ish haqi'
  },
  {
    id: 'exp-4',
    title: 'Instagram va Telegram target reklamasi',
    amount: 1200000,
    date: '2026-03-12',
    category: 'Reklama',
    note: 'Bahorgi to‘plam promo kampaniyasi'
  }
];

export const INITIAL_MOVEMENTS: InventoryMovement[] = [
  {
    id: 'mov-1',
    date: '2026-03-24 10:30',
    productCode: 'MT-1041',
    productName: 'Yumshoq Paxtali Bahorgi Dvoyka To‘plami',
    variantInfo: 'Osmonrang - 92 (2 yosh)',
    type: 'Sotuv (Onlayn)',
    quantityChange: -1,
    remainingStock: 6,
    note: 'Buyurtma #MT-2026-1049',
    performedBy: 'Tizim'
  },
  {
    id: 'mov-2',
    date: '2026-03-24 11:15',
    productCode: 'MT-1041',
    productName: 'Yumshoq Paxtali Bahorgi Dvoyka To‘plami',
    variantInfo: 'Osmonrang - 80 (1 yosh)',
    type: 'Sotuv (Oflayn)',
    quantityChange: -1,
    remainingStock: 8,
    note: 'Oflayn savdo #CHK-POS-0081',
    performedBy: 'Feruza (Kassir 1)'
  },
  {
    id: 'mov-3',
    date: '2026-03-20 09:00',
    productCode: 'MT-1044',
    productName: 'Shamoldan Himoyalovchi Yengil Kurtka',
    variantInfo: 'Yashil Haki - 146 (11 yosh)',
    type: 'Kirim',
    quantityChange: 10,
    remainingStock: 10,
    note: 'Yangi tovar kelishi',
    performedBy: 'Admin'
  }
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    title: 'MITTIVOY do‘koniga xush kelibsiz! 🎉',
    message: '1 yoshdan 15 yoshgacha bo‘lgan bolajonlar uchun eng sifatli kiyimlarni saralab oldik. Birinchi xaridingiz muborak bo‘lsin!',
    date: 'Bugun, 09:00',
    isRead: false,
    type: 'system'
  },
  {
    id: 'notif-2',
    title: 'Bahorgi aksiya boshlandi 🌸',
    message: 'Barcha qizlar ko‘ylaklariga va dvoykalariga 25% gacha maxsus chegirmalar amal qilmoqda.',
    date: 'Kecha, 14:20',
    isRead: false,
    type: 'discount'
  }
];

export const INITIAL_SETTINGS: AdminSettings = {
  storeName: 'MITTIVOY Bolalar Kiyimlari Do‘koni',
  storePhone: '+998 71 200 45 45',
  storeAddress: 'Toshkent shahri, Chilonzor tumani, Qatortol ko‘chasi, 18-uy',
  currency: 'UZS',
  lowStockThreshold: 4,
  clickMerchantId: '18420',
  clickServiceId: '32014',
  clickCardNumber: '8600 1404 2291 5521',
  paynetMerchantId: '9941',
  paynetTerminalId: 'TRM-88401',
  paynetCardNumber: '9860 3501 7712 8812',
  telegram: {
    botToken: '7192847120:AAHq_mittivoy_secure_token_sample',
    chatId: '-1002049182041',
    channelUsername: '@mittivoy_bolalar',
    notifyOnNewOrder: true,
    notifyOnPayment: true,
    notifyOnLowStock: true,
    allowInlineApproval: true
  },
  allowPushNotifications: true,
  adminPin: '2026'
};
