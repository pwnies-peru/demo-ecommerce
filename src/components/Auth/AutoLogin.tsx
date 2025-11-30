'use client'

import { ensureDemoUserLoggedIn } from '@/lib/supabase/auto-login'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

/**
 * This component automatically logs in the demo user on app initialization
 * Place this in your root layout to ensure user is always logged in
 */
export function AutoLogin({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)
  const router = useRouter()

  useEffect(() => {
    const performAutoLogin = async () => {
      try {
        const result = await ensureDemoUserLoggedIn()

        if (result.success) {
          if (result.autoLoggedIn) {
            console.log('✓ Auto-logged in as demo user')
          } else if (result.alreadyLoggedIn) {
            console.log('✓ Demo user already logged in')
          }
          setReady(true)
          router.refresh()
        } else {
          console.error('Auto-login failed:', result.error)
          // Still show app even if login fails (for development)
          setReady(true)
        }
      } catch (err) {
        console.error('Auto-login exception:', err)
        setReady(true)
      }
    }

    performAutoLogin()
  }, [router])

  // Show loading state while auto-login is in progress
  if (!ready) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="text-center">
          <div className="inline-block h-12 w-12 animate-spin rounded-full border-4 border-solid border-blue border-r-transparent mb-4"></div>
          <h3 className="font-semibold text-xl text-dark mb-2">
            Preparando todo para ti...
          </h3>
          <p className="text-dark-4">Ya casi listo!</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

