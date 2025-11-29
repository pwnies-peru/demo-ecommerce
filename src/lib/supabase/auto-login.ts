'use server'

import { createClient } from './server'
import { DEMO_USER } from './demo-user'

/**
 * Ensures the demo user is always logged in
 * This runs automatically and creates/refreshes the session
 */
export async function ensureDemoUserLoggedIn() {
  const supabase = await createClient()

  try {
    // Check if already logged in
    const { data: { user } } = await supabase.auth.getUser()
    
    if (user && user.id === DEMO_USER.id) {
      // Already logged in as demo user
      return { success: true, user, alreadyLoggedIn: true }
    }

    // If logged in as different user or not logged in, sign in as demo
    if (user) {
      await supabase.auth.signOut()
    }

    // Auto-login with demo credentials
    const { data, error } = await supabase.auth.signInWithPassword({
      email: DEMO_USER.email,
      password: DEMO_USER.password,
    })

    if (error) {
      console.error('Auto-login error:', error)
      return { error: error.message, success: false }
    }

    return { success: true, user: data.user, autoLoggedIn: true }
  } catch (error) {
    console.error('Auto-login exception:', error)
    return { error: 'Failed to auto-login', success: false }
  }
}

/**
 * Get current user (always returns demo user for this app)
 */
export async function getCurrentUser() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  
  // If no user, auto-login
  if (!user) {
    const result = await ensureDemoUserLoggedIn()
    return { user: result.user || null }
  }
  
  return { user }
}

