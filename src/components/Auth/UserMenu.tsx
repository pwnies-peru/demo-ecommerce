'use client'

import { useAuth } from '@/app/context/AuthContext'
import Link from 'next/link'
import { useState } from 'react'

/**
 * User menu for demo - shows user info without logout functionality
 * This is a demo app, so logout is disabled
 */
export function UserMenu() {
  const { user, loading } = useAuth()
  const [isOpen, setIsOpen] = useState(false)

  if (loading) {
    return (
      <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
    )
  }

  if (!user) {
    // This shouldn't happen in demo mode, but just in case
    return (
      <div className="flex items-center gap-2">
        <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse"></div>
        <span className="text-sm text-dark-4">Cargando...</span>
      </div>
    )
  }

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 hover:opacity-80 transition-opacity"
      >
        <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue to-blue-dark flex items-center justify-center text-white font-semibold text-sm">
          S
        </div>
        <div className="hidden xl:block text-left">
          <span className="block text-2xs text-dark-4 uppercase">
            Cuenta
          </span>
          <p className="font-medium text-custom-sm text-dark">
            Señor demo
          </p>
        </div>
        <svg
          className={`hidden xl:block w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {isOpen && (
        <>
          <div
            className="fixed inset-0 z-10"
            onClick={() => setIsOpen(false)}
          ></div>
          <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-20 overflow-hidden">
            <div className="p-4 border-b border-gray-200 bg-gradient-to-br from-blue/5 to-blue-dark/5">
              <div className="flex items-center gap-3 mb-2">
                <div className="h-10 w-10 rounded-full bg-gradient-to-br from-blue to-blue-dark flex items-center justify-center text-white font-semibold">
                  S
                </div>
                <div className="flex-1">
                  <p className="text-xs text-blue font-semibold uppercase tracking-wide">
                    Cuenta Demo
                  </p>
                  <p className="font-semibold text-dark text-sm truncate">
                    Señor demo
                  </p>
                </div>
              </div>
              {user.user_metadata?.name && (
                <p className="text-sm text-dark-4 mt-1">{user.user_metadata.name}</p>
              )}
            </div>

            <div className="py-2">
              <Link
                href="/my-account"
                className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-dark-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  <span className="text-dark">Mi Cuenta</span>
                </div>
              </Link>

              <Link
                href="/cart"
                className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-dark-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span className="text-dark">Carrito</span>
                </div>
              </Link>

              <Link
                href="/wishlist"
                className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-dark-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                  <span className="text-dark">Lista de Deseos</span>
                </div>
              </Link>

              <Link
                href="/shop-with-sidebar"
                className="block px-4 py-2.5 hover:bg-gray-50 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center gap-3">
                  <svg
                    className="w-5 h-5 text-dark-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                    />
                  </svg>
                  <span className="text-dark">Tienda</span>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
