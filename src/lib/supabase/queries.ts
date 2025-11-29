/**
 * Supabase Database Queries
 * 
 * This file contains reusable query functions for fetching data from Supabase.
 * These can be used in both Server and Client Components.
 */

import { createClient as createServerClient } from '@/lib/supabase/server'
import { createClient as createBrowserClient } from '@/lib/supabase/client'

// Types (you can expand these based on your database schema)
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
  // Products
  async getAllProducts() {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Product[]
  },

  async getFeaturedProducts() {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Product[]
  },

  async getNewArrivals(limit = 12) {
    const supabase = await createServerClient()
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
    const supabase = await createServerClient()
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
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()
    
    if (error) throw error
    return data as Product
  },

  async getProductsByCategory(category: string) {
    const supabase = await createServerClient()
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
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Category[]
  },

  // Blog Posts
  async getAllBlogPosts() {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })
    
    if (error) throw error
    return data as BlogPost[]
  },

  async getBlogPostBySlug(slug: string) {
    const supabase = await createServerClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .eq('slug', slug)
      .single()
    
    if (error) throw error
    return data as BlogPost
  },

  async getRecentBlogPosts(limit = 3) {
    const supabase = await createServerClient()
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
  // Products
  async getAllProducts() {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Product[]
  },

  async searchProducts(searchTerm: string) {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${searchTerm}%`)
      .order('created_at', { ascending: false })
    
    if (error) throw error
    return data as Product[]
  },

  async getProductById(id: string) {
    const supabase = createBrowserClient()
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
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name', { ascending: true })
    
    if (error) throw error
    return data as Category[]
  },

  // Blog Posts
  async getAllBlogPosts() {
    const supabase = createBrowserClient()
    const { data, error } = await supabase
      .from('blog_posts')
      .select('*')
      .order('published_at', { ascending: false })
    
    if (error) throw error
    return data as BlogPost[]
  },
}

