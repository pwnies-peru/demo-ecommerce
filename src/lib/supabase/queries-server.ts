/**
 * Server-side Supabase Queries
 * Use these ONLY in Server Components, Server Actions, and Route Handlers
 */

import { createClient } from '@/lib/supabase/server'
import { DEMO_STORE_ID } from '@/lib/constants/store'

// Types based on the actual database schema
export interface StoreCategory {
  id: string
  store_id: string
  id_engine: string | null
  name: string
  slug: string | null
  last_scraped_at: string | null
  needs_refresh: boolean
  created_at: string
  updated_at: string
}

export interface StoreProduct {
  id: string
  canonical_id: string | null
  identity_hash: string
  store_id: string
  id_engine: string | null
  name: string | null
  slug: string | null
  ean: string | null
  online_price: number | null
  list_price: number | null
  is_available: boolean | null
  stock_quantity: number | null
  link: string | null
  add_to_cart_link: string | null
  image_url: string | null
  brand_image_url: string | null
  brand_id: string | null
  last_scraped_at: string | null
  created_at: string
  updated_at: string
}

export interface Brand {
  id: string
  name: string
  created_at: string
  updated_at: string
}

// Store Categories
export async function getStoreCategories(storeId: string = DEMO_STORE_ID) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('store_category')
    .select('*')
    .eq('store_id', storeId)
    .order('name', { ascending: true })
  
  if (error) throw error
  return data as StoreCategory[]
}

// Store Products
export async function getStoreProducts(storeId: string = DEMO_STORE_ID) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('store_product')
    .select('*')
    .eq('store_id', storeId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as StoreProduct[]
}

export async function getStoreProductsByCategory(categoryId: string, storeId: string = DEMO_STORE_ID) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('store_product')
    .select(`
      *,
      store_product_category!inner(store_category_id)
    `)
    .eq('store_id', storeId)
    .eq('store_product_category.store_category_id', categoryId)
    .order('created_at', { ascending: false })
  
  if (error) throw error
  return data as StoreProduct[]
}

// Brands
export async function getAllBrands() {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('brand')
    .select('*')
    .order('name', { ascending: true })
  
  if (error) throw error
  return data as Brand[]
}

