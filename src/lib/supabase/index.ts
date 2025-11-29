/**
 * Supabase Client Utilities
 * 
 * This module exports Supabase client creators for different Next.js contexts:
 * - client: For Client Components (browser)
 * - server: For Server Components, Server Actions, and Route Handlers
 * - middleware: For Next.js Middleware
 * 
 * Usage:
 * 
 * In Client Components:
 * ```tsx
 * 'use client'
 * import { createClient } from '@/lib/supabase/client'
 * const supabase = createClient()
 * ```
 * 
 * In Server Components:
 * ```tsx
 * import { createClient } from '@/lib/supabase/server'
 * const supabase = await createClient()
 * ```
 * 
 * In Middleware:
 * ```tsx
 * import { updateSession } from '@/lib/supabase/middleware'
 * export async function middleware(request: NextRequest) {
 *   return await updateSession(request)
 * }
 * ```
 */

export * as clientSupabase from './client'
export * as serverSupabase from './server'
export * as middlewareSupabase from './middleware'

