/**
 * Supabase Database Queries
 * 
 * This file contains reusable query functions for fetching data from Supabase.
 * These can be used in both Server and Client Components.
 */

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

export interface Store {
  id: string
  name: string
  slug: string | null
  created_at: string
  updated_at: string
}

export interface Brand {
  id: string
  name: string
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

// Legacy types (kept for backwards compatibility)
export interface Product {
  id: string
  name: string
  description?: string
  price: number
  compare_price?: number
  category?: string
  brand?: string
  tags?: string[]
  images?: string[]
  stock?: number
  rating?: number
  reviews_count?: number
  is_featured?: boolean
  is_new_arrival?: boolean
  is_best_seller?: boolean
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  slug: string
  description?: string
  image?: string
  created_at: string
}

export interface BlogPost {
  id: string
  title: string
  slug: string
  excerpt?: string
  content?: string
  author?: string
  author_avatar?: string
  image?: string
  tags?: string[]
  published_at?: string
  created_at: string
  updated_at: string
}

/**
 * Server-side query functions
 * Use these in Server Components, Server Actions, and Route Handlers
 */
export const serverQueries = {
  // Store Categories
  async getStoreCategories(storeId: string = DEMO_STORE_ID) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('store_category')
      .select('*')
      .eq('store_id', storeId)
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as StoreCategory[]
  },

  // Store Products
  async getStoreProducts(storeId: string = DEMO_STORE_ID) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('store_product')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as StoreProduct[]
  },

  async getStoreProductsByCategory(categoryId: string, storeId: string = DEMO_STORE_ID) {
    const { createClient } = await import('@/lib/supabase/server')
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
  },

  // Brands
  async getAllBrands() {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('brand')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Brand[]
  },

  // Legacy Products (kept for backwards compatibility)
  async getAllProducts() {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Product[]
  },

  async getFeaturedProducts() {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Product[]
  },

  async getNewArrivals(limit = 12) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_new_arrival', true)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data as Product[]
  },

  async getBestSellers(limit = 6) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_best_seller', true)
      .order('created_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data as Product[]
  },

  async getProductById(id: string) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Product
  },

  async getProductsByCategory(category: string) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('category', category)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Product[]
  },

  // Categories
  async getAllCategories() {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Category[]
  },

  // Blog Posts
  async getAllBlogPosts() {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })
    
    if (error) throw error
    return data as BlogPost[]
  },

  async getBlogPostBySlug(slug: string) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data as BlogPost
  },

  async getRecentBlogPosts(limit = 3) {
    const { createClient } = await import('@/lib/supabase/server')
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })
      .limit(limit)
    
    if (error) throw error
    return data as BlogPost[]
  },
}

/**
 * Client-side query functions
 * Use these in Client Components
 */
export const clientQueries = {
  // Store Categories
  async getStoreCategories(storeId: string = DEMO_STORE_ID) {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('store_category')
      .select('*')
      .eq('store_id', storeId)
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as StoreCategory[]
  },

  // Store Products
  async getStoreProducts(storeId: string = DEMO_STORE_ID) {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('store_product')
      .select('*')
      .eq('store_id', storeId)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as StoreProduct[]
  },

  async getStoreProductsByCategory(categoryId: string, storeId: string = DEMO_STORE_ID) {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
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
  },

  // Brands
  async getAllBrands() {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('brand')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Brand[]
  },

  // Legacy Products (kept for backwards compatibility)
  async getAllProducts() {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Product[]
  },

  async searchProducts(searchTerm: string) {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Product[]
  },

  async getProductById(id: string) {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Product
  },

  // Categories
  async getAllCategories() {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Category[]
  },

  // Blog Posts
  async getAllBlogPosts() {
    const { createClient } = await import('@/lib/supabase/client')
    const supabase = createClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })
    
    if (error) throw error
    return data as BlogPost[]
  },
}
