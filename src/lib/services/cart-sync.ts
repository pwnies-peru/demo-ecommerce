/**
 * Cart Synchronization Service
 * Syncs Redux cart state with Supabase database
 */

import {
  addToCart as dbAddToCart,
  clearCart as dbClearCart,
  removeFromCart as dbRemoveFromCart,
  updateCartItemQuantity as dbUpdateQuantity,
  getCartItems
} from '@/lib/supabase/cart-queries';
import { loadCartFromDB, setSyncing } from '@/redux/features/cart-slice';
import { AppDispatch } from '@/redux/store';

/**
 * Load cart from database and populate Redux
 */
export async function loadCartFromDatabase(dispatch: AppDispatch) {
  try {
    dispatch(setSyncing(true));

    const dbCartItems = await getCartItems();

    // Map database cart items to Redux cart format
    const cartItems = dbCartItems.map((item) => {
      const product = item.store_product;
      const price = product.online_price || product.list_price || 0;

      return {
        id: parseInt(item.store_product_id.substring(0, 8), 16) % 1000000,
        dbId: item.store_product_id,
        title: product.name || 'Producto sin nombre',
        price: price,
        discountedPrice: price,
        quantity: item.quantity,
        imgs: {
          thumbnails: product.image_url ? [product.image_url] : ['/images/products/default.png'],
          previews: product.image_url ? [product.image_url] : ['/images/products/default.png'],
        },
      };
    });

    dispatch(loadCartFromDB(cartItems));
    console.log('[Cart Sync] Loaded', cartItems.length, 'items from database');
  } catch (error) {
    console.error('[Cart Sync] Error loading cart:', error);
  } finally {
    dispatch(setSyncing(false));
  }
}

/**
 * Sync add to cart with database
 */
export async function syncAddToCart(productDbId: string, quantity: number = 1) {
  try {
    await dbAddToCart(productDbId, quantity);
    console.log('[Cart Sync] Added to database:', productDbId, 'qty:', quantity);
  } catch (error) {
    console.error('[Cart Sync] Error adding to cart:', error);
    throw error;
  }
}

/**
 * Sync update quantity with database
 */
export async function syncUpdateQuantity(productDbId: string, quantity: number) {
  try {
    await dbUpdateQuantity(productDbId, quantity);
    console.log('[Cart Sync] Updated quantity in database:', productDbId, 'qty:', quantity);
  } catch (error) {
    console.error('[Cart Sync] Error updating quantity:', error);
    throw error;
  }
}

/**
 * Sync remove from cart with database
 */
export async function syncRemoveFromCart(productDbId: string) {
  try {
    await dbRemoveFromCart(productDbId);
    console.log('[Cart Sync] Removed from database:', productDbId);
  } catch (error) {
    console.error('[Cart Sync] Error removing from cart:', error);
    throw error;
  }
}

/**
 * Sync clear cart with database
 */
export async function syncClearCart() {
  try {
    await dbClearCart();
    console.log('[Cart Sync] Cleared cart in database');
  } catch (error) {
    console.error('[Cart Sync] Error clearing cart:', error);
    throw error;
  }
}

