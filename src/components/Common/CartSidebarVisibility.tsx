'use client';

import { usePathname } from 'next/navigation';
import PermanentCartSidebar from './PermanentCartSidebar';

export function CartSidebarVisibility() {
  const pathname = usePathname();
  const isCartPage = pathname === '/cart';

  // Don't show sidebar on cart page
  if (isCartPage) return null;

  return <PermanentCartSidebar />;
}

