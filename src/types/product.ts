// Enhanced product type based on store_product schema
export type Product = {
  title: string;
  reviews: number;
  price: number;
  discountedPrice: number; // Keep for compatibility but should equal price (no discounts)
  id: number;
  dbId?: string; // Original database UUID for queries
  imgs?: {
    thumbnails: string[];
    previews: string[];
  };
  // Additional fields
  rating?: number; // 1-5 star rating
  isAvailable?: boolean;
  stockQuantity?: number;
  link?: string;
  slug?: string;
  ean?: string;
  // Dummy fields for features not in DB
  deliveryDays?: number; // Random 2-7 days
  hasPromoCode?: boolean;
  promoCode?: string;
};

// Database product type (from store_product table)
export type StoreProductDB = {
  id: string;
  canonical_id: string | null;
  identity_hash: string;
  store_id: string;
  id_engine: string | null;
  name: string | null;
  slug: string | null;
  ean: string | null;
  online_price: number | null;
  list_price: number | null;
  is_available: boolean | null;
  stock_quantity: number | null;
  link: string | null;
  add_to_cart_link: string | null;
  image_url: string | null;
  brand_image_url: string | null;
  brand_id: string | null;
  last_scraped_at: string | null;
  created_at: string;
  updated_at: string;
};
