export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface FilterState {
  category: string;
  priceRange: [number, number];
  sortBy: string;
}

export type SortOption = "featured" | "price-low" | "price-high" | "newest" | "rating";