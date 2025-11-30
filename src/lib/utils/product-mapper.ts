import { Product, StoreProductDB } from '@/types/product';

/**
 * Generates random dummy data for fields not in the database
 */
function generateDummyData(productId: string) {
  // Use product ID as seed for consistent random values
  const seed = parseInt(productId.substring(0, 8), 16);

  return {
    rating: 3 + (seed % 3), // Rating between 3-5 stars
    reviews: 50 + (seed % 200), // Reviews between 50-250
    deliveryDays: 2 + (seed % 6), // Delivery 2-7 days
    hasPromoCode: seed % 3 === 0, // ~33% chance of promo code
    promoCode: seed % 3 === 0 ? `SAVE${10 + (seed % 20)}` : undefined,
  };
}

/**
 * Generates a slug from product name if slug is missing
 */
function generateSlug(name: string, id: string): string {
  const baseSlug = name
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^\w\s-]/g, '') // Remove special chars
    .replace(/\s+/g, '-') // Replace spaces with hyphens
    .replace(/-+/g, '-') // Replace multiple hyphens with single
    .trim();

  // Add a short ID suffix to ensure uniqueness
  const shortId = id.substring(0, 8);
  return `${baseSlug}-${shortId}`;
}

/**
 * Transforms database product to UI product format
 * IMPORTANT: No discounts are shown - discountedPrice always equals price
 */
export function mapStoreProductToProduct(dbProduct: StoreProductDB): Product {
  const dummyData = generateDummyData(dbProduct.id);

  // Use online_price as the main price, NO DISCOUNTS
  const price = dbProduct.online_price || dbProduct.list_price || 0;

  // ALWAYS use database slug if it exists, otherwise generate one
  // Database slugs take priority to ensure URL consistency
  const slug = dbProduct.slug || generateSlug(dbProduct.name || 'producto', dbProduct.id);

  console.log('[Product Mapper]', {
    dbProductId: dbProduct.id,
    dbSlug: dbProduct.slug,
    finalSlug: slug,
    name: dbProduct.name
  });

  return {
    id: parseInt(dbProduct.id_engine || dbProduct.id.substring(0, 8), 16) % 1000000,
    dbId: dbProduct.id, // Store original database UUID
    title: dbProduct.name || 'Producto sin nombre',
    price: price,
    discountedPrice: price, // NEVER show discounts - always same as price
    reviews: dummyData.reviews,
    rating: dummyData.rating,
    isAvailable: dbProduct.is_available ?? true,
    stockQuantity: dbProduct.stock_quantity ?? undefined,
    link: dbProduct.link ?? undefined,
    slug: slug,
    ean: dbProduct.ean ?? undefined,
    deliveryDays: dummyData.deliveryDays,
    hasPromoCode: dummyData.hasPromoCode,
    promoCode: dummyData.promoCode,
    imgs: {
      thumbnails: dbProduct.image_url ? [dbProduct.image_url] : ['/images/products/default.png'],
      previews: dbProduct.image_url ? [dbProduct.image_url] : ['/images/products/default.png'],
    },
  };
}

/**
 * Transforms an array of database products to UI format
 */
export function mapStoreProductsToProducts(dbProducts: StoreProductDB[]): Product[] {
  return dbProducts
    .filter(p => p.is_available !== false) // Only show available products
    .map(mapStoreProductToProduct);
}

