'use client';

import { loadCartFromDatabase } from '@/lib/services/cart-sync';
import { AppDispatch } from '@/redux/store';
import { useEffect } from 'react';
import { useDispatch } from 'react-redux';

/**
 * Component to load cart from database on mount
 * Should be placed in the root layout after authentication
 */
export function CartLoader() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    // Load cart from database when component mounts
    loadCartFromDatabase(dispatch);
  }, [dispatch]);

  return null; // This component doesn't render anything
}

