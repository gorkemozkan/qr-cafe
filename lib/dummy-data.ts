import { Tables } from "@/types/db";

// Dummy data for cafes
export const dummyCafes: Tables<"cafes">[] = [
  {
    id: 1,
    slug: "coffee-haven",
    description: "A cozy coffee shop serving artisanal coffee and fresh pastries",
    logo_url: "https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=200&h=200&fit=crop",
    currency: "USD",
    is_active: true,
    user_id: "user-1",
    created_at: "2024-01-15T10:00:00Z",
  },
  {
    id: 2,
    slug: "tea-garden",
    description: "Specialty tea house with a wide selection of premium teas",
    logo_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=200&h=200&fit=crop",
    currency: "EUR",
    is_active: true,
    user_id: "user-2",
    created_at: "2024-01-20T14:30:00Z",
  },
  {
    id: 3,
    slug: "bakery-corner",
    description: "Fresh baked goods and specialty breads made daily",
    logo_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=200&h=200&fit=crop",
    currency: "TRY",
    is_active: true,
    user_id: "user-3",
    created_at: "2024-02-01T09:15:00Z",
  },
  {
    id: 4,
    slug: "juice-bar",
    description: "Healthy smoothies and fresh fruit juices",
    logo_url: "https://images.unsplash.com/photo-1621506289937-a8e4df240d0b?w=200&h=200&fit=crop",
    currency: "USD",
    is_active: false,
    user_id: "user-4",
    created_at: "2024-02-10T11:45:00Z",
  },
];

// Dummy data for categories
export const dummyCategories: Tables<"categories">[] = [
  // Coffee Haven categories
  {
    id: 1,
    cafe_id: 1,
    name: "Hot Coffee",
    description: "Traditional hot coffee beverages",
    sort_order: 1,
    is_active: true,
    user_id: "user-1",
    created_at: "2024-01-15T10:05:00Z",
  },
  {
    id: 2,
    cafe_id: 1,
    name: "Cold Coffee",
    description: "Iced and cold brew coffee drinks",
    sort_order: 2,
    is_active: true,
    user_id: "user-1",
    created_at: "2024-01-15T10:05:00Z",
  },
  {
    id: 3,
    cafe_id: 1,
    name: "Pastries",
    description: "Fresh baked pastries and desserts",
    sort_order: 3,
    is_active: true,
    user_id: "user-1",
    created_at: "2024-01-15T10:05:00Z",
  },

  // Tea Garden categories
  {
    id: 4,
    cafe_id: 2,
    name: "Black Tea",
    description: "Premium black tea varieties",
    sort_order: 1,
    is_active: true,
    user_id: "user-2",
    created_at: "2024-01-20T14:35:00Z",
  },
  {
    id: 5,
    cafe_id: 2,
    name: "Green Tea",
    description: "Fresh green tea selections",
    sort_order: 2,
    is_active: true,
    user_id: "user-2",
    created_at: "2024-01-20T14:35:00Z",
  },
  {
    id: 6,
    cafe_id: 2,
    name: "Herbal Tea",
    description: "Caffeine-free herbal infusions",
    sort_order: 3,
    is_active: true,
    user_id: "user-2",
    created_at: "2024-01-20T14:35:00Z",
  },

  // Bakery Corner categories
  {
    id: 7,
    cafe_id: 3,
    name: "Bread",
    description: "Artisan breads and rolls",
    sort_order: 1,
    is_active: true,
    user_id: "user-3",
    created_at: "2024-02-01T09:20:00Z",
  },
  {
    id: 8,
    cafe_id: 3,
    name: "Cakes",
    description: "Celebration cakes and cupcakes",
    sort_order: 2,
    is_active: true,
    user_id: "user-3",
    created_at: "2024-02-01T09:20:00Z",
  },
  {
    id: 9,
    cafe_id: 3,
    name: "Cookies",
    description: "Homemade cookies and biscuits",
    sort_order: 3,
    is_active: true,
    user_id: "user-3",
    created_at: "2024-02-01T09:20:00Z",
  },
];

// Dummy data for products
export const dummyProducts: Tables<"products">[] = [
  // Coffee Haven - Hot Coffee
  {
    id: 1,
    cafe_id: 1,
    category_id: 1,
    name: "Espresso",
    description: "Single shot of premium espresso",
    price: 3.5,
    image_url: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-1",
    created_at: "2024-01-15T10:10:00Z",
  },
  {
    id: 2,
    cafe_id: 1,
    category_id: 1,
    name: "Cappuccino",
    description: "Espresso with steamed milk and foam",
    price: 4.5,
    image_url: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-1",
    created_at: "2024-01-15T10:10:00Z",
  },
  {
    id: 3,
    cafe_id: 1,
    category_id: 1,
    name: "Latte",
    description: "Espresso with steamed milk",
    price: 4.0,
    image_url: "https://images.unsplash.com/photo-1561049492-5071f92b27b0?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-1",
    created_at: "2024-01-15T10:10:00Z",
  },

  // Coffee Haven - Cold Coffee
  {
    id: 4,
    cafe_id: 1,
    category_id: 2,
    name: "Iced Latte",
    description: "Espresso with cold milk over ice",
    price: 4.5,
    image_url: "https://images.unsplash.com/photo-1461023058943-07fcbe16d735?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-1",
    created_at: "2024-01-15T10:15:00Z",
  },
  {
    id: 5,
    cafe_id: 1,
    category_id: 2,
    name: "Cold Brew",
    description: "Smooth cold brewed coffee",
    price: 4.0,
    image_url: "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-1",
    created_at: "2024-01-15T10:15:00Z",
  },

  // Coffee Haven - Pastries
  {
    id: 6,
    cafe_id: 1,
    category_id: 3,
    name: "Croissant",
    description: "Buttery French croissant",
    price: 3.5,
    image_url: "https://images.unsplash.com/photo-1555507036-ab1f40388011?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-1",
    created_at: "2024-01-15T10:20:00Z",
  },
  {
    id: 7,
    cafe_id: 1,
    category_id: 3,
    name: "Chocolate Muffin",
    description: "Rich chocolate muffin with chocolate chips",
    price: 3.0,
    image_url: "https://images.unsplash.com/photo-1607958996338-310d8c5e8b0f?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-1",
    created_at: "2024-01-15T10:20:00Z",
  },

  // Tea Garden - Black Tea
  {
    id: 8,
    cafe_id: 2,
    category_id: 4,
    name: "Earl Grey",
    description: "Classic Earl Grey with bergamot",
    price: 4.0,
    image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-2",
    created_at: "2024-01-20T14:40:00Z",
  },
  {
    id: 9,
    cafe_id: 2,
    category_id: 4,
    name: "English Breakfast",
    description: "Strong black tea blend",
    price: 3.5,
    image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-2",
    created_at: "2024-01-20T14:40:00Z",
  },

  // Tea Garden - Green Tea
  {
    id: 10,
    cafe_id: 2,
    category_id: 5,
    name: "Sencha",
    description: "Traditional Japanese green tea",
    price: 4.5,
    image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-2",
    created_at: "2024-01-20T14:45:00Z",
  },

  // Tea Garden - Herbal Tea
  {
    id: 11,
    cafe_id: 2,
    category_id: 6,
    name: "Chamomile",
    description: "Calming chamomile infusion",
    price: 3.5,
    image_url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-2",
    created_at: "2024-01-20T14:50:00Z",
  },

  // Bakery Corner - Bread
  {
    id: 12,
    cafe_id: 3,
    category_id: 7,
    name: "Sourdough",
    description: "Traditional sourdough bread",
    price: 6.0,
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-3",
    created_at: "2024-02-01T09:25:00Z",
  },
  {
    id: 13,
    cafe_id: 3,
    category_id: 7,
    name: "Baguette",
    description: "French baguette",
    price: 3.5,
    image_url: "https://images.unsplash.com/photo-1509440159596-0249088772ff?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-3",
    created_at: "2024-02-01T09:25:00Z",
  },

  // Bakery Corner - Cakes
  {
    id: 14,
    cafe_id: 3,
    category_id: 8,
    name: "Chocolate Cake",
    description: "Rich chocolate layer cake",
    price: 8.0,
    image_url: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-3",
    created_at: "2024-02-01T09:30:00Z",
  },

  // Bakery Corner - Cookies
  {
    id: 15,
    cafe_id: 3,
    category_id: 9,
    name: "Chocolate Chip Cookie",
    description: "Classic chocolate chip cookie",
    price: 2.5,
    image_url: "https://images.unsplash.com/photo-1607958996338-310d8c5e8b0f?w=300&h=300&fit=crop",
    is_available: true,
    user_id: "user-3",
    created_at: "2024-02-01T09:35:00Z",
  },
];

// Helper function to get cafe by slug
export function getCafeBySlug(slug: string): Tables<"cafes"> | undefined {
  return dummyCafes.find((cafe) => cafe.slug === slug);
}

// Helper function to get categories by cafe ID
export function getCategoriesByCafeId(cafeId: number): Tables<"categories">[] {
  return dummyCategories.filter((category) => category.cafe_id === cafeId);
}

// Helper function to get products by category ID
export function getProductsByCategoryId(categoryId: number): Tables<"products">[] {
  return dummyProducts.filter((product) => product.category_id === categoryId);
}

// Helper function to get products by cafe ID
export function getProductsByCafeId(cafeId: number): Tables<"products">[] {
  return dummyProducts.filter((product) => product.cafe_id === cafeId);
}

// Helper function to get cafe with all its data
export function getCafeWithData(cafeId: number) {
  const cafe = dummyCafes.find((c) => c.id === cafeId);
  if (!cafe) return null;

  const categories = getCategoriesByCafeId(cafeId);
  const products = getProductsByCafeId(cafeId);

  return {
    ...cafe,
    categories: categories.map((category) => ({
      ...category,
      products: getProductsByCategoryId(category.id),
    })),
  };
}
