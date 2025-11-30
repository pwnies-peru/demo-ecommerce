/**
 * Shopping Cart Database Queries
 * Syncs cart with Supabase database
 */

import { DEMO_USER_ID } from '@/lib/constants/demo-user';
import { DEMO_STORE_ID } from '@/lib/constants/store';
import { createClient } from '@/lib/supabase/client';

export interface CartItemDB {
  id: string;
  user_id: string;
  store_id: string;
  store_product_id: string;
  quantity: number;
  created_at: string;
  updated_at: string;
}

export interface CartItemWithProduct extends CartItemDB {
  store_product: {
    id: string;
    name: string | null;
    slug: string | null;
    online_price: number | null;
    list_price: number | null;
    image_url: string | null;
    is_available: boolean | null;
  };
}

/**
 * Get all cart items for the demo user
 */
export async function getCartItems(userId: string = DEMO_USER_ID) {
  const supabase = createClient();
  
  const { data, error } = await supabase
    .from('shopping_cart_item')
    .select(`
      *,
      store_product:store_product_id (
        id,
        name,
        slug,
        online_price,
        list_price,
        image_url,
        is_available
      )
    `)
    .eq('user_id', userId)
    .order('created_at', { ascending: false });
  
  if (error) {
    console.error('Error fetching cart items:', error);
    throw error;
  }
  
  return data as CartItemWithProduct[];
}

/**
 * Add item to cart or update quantity if exists
 * Uses database function for atomic upsert operation
 */
export async function addToCart(
  productId: string,
  quantity: number = 1,
  userId: string = DEMO_USER_ID,
  storeId: string = DEMO_STORE_ID
) {
  const supabase = createClient();
  
  // Use database function for atomic upsert
  const { data, error } = await supabase
    .rpc('upsert_cart_item', {
      p_user_id: userId,
      p_store_id: storeId,
      p_store_product_id: productId,
      p_quantity_to_add: quantity,
    });
  
  if (error) {
    console.error('Error adding to cart:', error);
    throw error;
  }
  
  // RPC returns an array, get the first item and map column names
  const rawData = Array.isArray(data) ? data[0] : data;
  
  if (!rawData) {
    throw new Error('No data returned from upsert_cart_item');
  }
  
  // Map the returned column names to our interface
  return {
    id: rawData.cart_id,
    user_id: rawData.cart_user_id,
    store_id: rawData.cart_store_id,
    store_product_id: rawData.cart_store_product_id,
    quantity: rawData.cart_quantity,
    created_at: rawData.cart_created_at,
    updated_at: rawData.cart_updated_at,
  } as CartItemDB;
}

/**
 * Update cart item quantity (set to specific value, not add)
 * Uses database function for atomic operation
 */
export async function updateCartItemQuantity(
  productId: string,
  quantity: number,
  userId: string = DEMO_USER_ID
) {
  const supabase = createClient();
  
  // Use database function for atomic update/delete
  const { error } = await supabase
    .rpc('set_cart_item_quantity', {
      p_user_id: userId,
      p_store_product_id: productId,
      p_quantity: quantity,
    });
  
  if (error) {
    console.error('Error updating cart quantity:', error);
    throw error;
  }
  
  // Return a success indicator
  return {
    id: '',
    user_id: userId,
    store_id: '',
    store_product_id: productId,
    quantity: quantity,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  } as CartItemDB;
}

/**
 * Remove item from cart
 */
export async function removeFromCart(
  productId: string,
  userId: string = DEMO_USER_ID
) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('shopping_cart_item')
    .delete()
    .eq('user_id', userId)
    .eq('store_product_id', productId);
  
  if (error) {
    console.error('Error removing from cart:', error);
    throw error;
  }
  
  return true;
}

/**
 * Clear all cart items for user
 */
export async function clearCart(userId: string = DEMO_USER_ID) {
  const supabase = createClient();
  
  const { error } = await supabase
    .from('shopping_cart_item')
    .delete()
    .eq('user_id', userId);
  
  if (error) {
    console.error('Error clearing cart:', error);
    throw error;
  }
  
  return true;
}

