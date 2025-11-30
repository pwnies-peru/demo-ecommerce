'use client';

import { removeItemFromCart, selectRegularItems, selectTotalPrice, updateCartItemQuantity } from '@/redux/features/cart-slice';
import { AppDispatch, useAppSelector } from '@/redux/store';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

const PermanentCartSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const regularItems = useAppSelector(selectRegularItems);
  const totalPrice = useSelector(selectTotalPrice);
  const [negotiatedItems, setNegotiatedItems] = useState<any[]>([]);
  const [giftedItems, setGiftedItems] = useState<any[]>([]);

  // Load negotiated items from localStorage
  useEffect(() => {
    const loadNegotiated = () => {
      try {
        const stored = localStorage.getItem('negotiatedItems');
        setNegotiatedItems(stored ? JSON.parse(stored) : []);
      } catch {
        setNegotiatedItems([]);
      }
    };

    loadNegotiated();
    // Listen for storage changes
    window.addEventListener('storage', loadNegotiated);
    return () => window.removeEventListener('storage', loadNegotiated);
  }, []);

  // Load gifted items from localStorage
  useEffect(() => {
    const loadGifted = () => {
      try {
        const stored = localStorage.getItem('giftedItems');
        setGiftedItems(stored ? JSON.parse(stored) : []);
      } catch {
        setGiftedItems([]);
      }
    };

    loadGifted();
    window.addEventListener('storage', loadGifted);
    return () => window.removeEventListener('storage', loadGifted);
  }, []);

  const handleQuantityChange = async (item: any, newQuantity: number) => {
    if (newQuantity === 0) {
      // Remove from Redux
      dispatch(removeItemFromCart(item.id));

      // Remove from database
      if (item.dbId) {
        try {
          const { syncRemoveFromCart } = await import('@/lib/services/cart-sync');
          await syncRemoveFromCart(item.dbId);
        } catch (error) {
          console.error('Failed to sync cart removal with database:', error);
        }
      }
    } else {
      // Update quantity in Redux
      dispatch(updateCartItemQuantity({ id: item.id, quantity: newQuantity }));

      // Update quantity in database
      if (item.dbId) {
        try {
          const { syncUpdateQuantity } = await import('@/lib/services/cart-sync');
          await syncUpdateQuantity(item.dbId, newQuantity);
        } catch (error) {
          console.error('Failed to sync quantity update with database:', error);
        }
      }
    }
  };

  const removeNegotiatedItem = (itemId: number) => {
    try {
      const stored = localStorage.getItem('negotiatedItems');
      const items = stored ? JSON.parse(stored) : [];
      const filtered = items.filter((item: any) => item.id !== itemId);
      localStorage.setItem('negotiatedItems', JSON.stringify(filtered));
      setNegotiatedItems(filtered);
      
      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Failed to remove negotiated item:', error);
    }
  };

  return (
    <div className="fixed right-0 top-0 h-screen w-[200px] bg-white border-l border-gray-3 shadow-sm z-99999 flex flex-col">
      {/* Total & Checkout - At Top */}
      <div className="p-3 border-b border-gray-3 bg-gray-1">
        <p className="text-xs text-center text-dark-4">Total</p>
        <p className="text-sm font-bold text-center mb-2">S/ {totalPrice.toFixed(2)}</p>
        <Link href="/checkout" className="block w-full text-xs text-center bg-dark text-white py-2 rounded hover:bg-dark/80">
          Pagar
        </Link>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        {regularItems.length === 0 && negotiatedItems.length === 0 && giftedItems.length === 0 ? (
          <p className="text-xs text-center text-gray-500 mt-4">Vacío</p>
        ) : (
          <div className="space-y-3">
            {/* Regular Items */}
            {regularItems.map((item) => (
              <div
                key={item.id}
                className="flex flex-col items-center gap-2 p-2 bg-gray-1 rounded"
              >
                <Image
                  src={item.imgs?.thumbnails[0] || '/images/products/default.png'}
                  alt={item.title}
                  width={120}
                  height={120}
                  className="rounded object-cover"
                />
                <p className="text-xs font-medium text-center">
                  S/ {item.discountedPrice.toFixed(2)}
                </p>
                <select
                  value={item.quantity}
                  onChange={(e) => handleQuantityChange(item, parseInt(e.target.value))}
                  className="w-full text-xs border border-gray-3 rounded px-1 py-1"
                >
                  <option value={0}>0</option>
                  {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => (
                    <option key={num} value={num}>
                      {num}
                    </option>
                  ))}
                </select>
              </div>
            ))}

            {/* Negotiated Items Section */}
            {negotiatedItems.length > 0 && (
              <>
                <div className="border-t border-blue/30 pt-3 mt-3 relative">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-2">
                    <span className="text-[10px] font-medium text-blue">✨ Ofertas Especiales ✨</span>
                  </div>
                </div>
                {negotiatedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-center gap-2 p-2 bg-gradient-to-br from-yellow-50 to-white rounded relative overflow-hidden animate-shimmer"
                  >
                    {/* Sparkle effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-slide" />

                    <div className="absolute -top-1 -right-1 bg-yellow-400 text-dark text-[10px] px-2 py-0.5 rounded font-bold z-10">
                      -{item.negotiatedDiscount}%
                    </div>
                    <div className="absolute top-1 left-1 text-yellow-400 text-xs animate-pulse">
                      ✨
                    </div>
                    <Image
                      src={item.imgs?.thumbnails[0] || '/images/products/default.png'}
                      alt={item.title}
                      width={120}
                      height={120}
                      className="rounded object-cover relative z-10"
                    />
                    <p className="text-xs font-bold text-center text-yellow-700 relative z-10">
                      S/ {item.discountedPrice.toFixed(2)}
                      <span className="block text-[10px] text-blue">🎁 Negociado</span>
                    </p>
                    <div className="w-full text-xs bg-white rounded px-1 py-1 text-center font-medium text-dark relative z-10">
                      Cant: {item.quantity}
                    </div>
                  </div>
                ))}

                <style jsx>{`
                  @keyframes shimmer {
                    0%, 100% { opacity: 0.8; }
                    50% { opacity: 1; }
                  }
                  @keyframes slide {
                    0% { transform: translateX(-100%); }
                    100% { transform: translateX(100%); }
                  }
                  .animate-shimmer {
                    animation: shimmer 2s ease-in-out infinite;
                  }
                  .animate-slide {
                    animation: slide 3s linear infinite;
                  }
                `}</style>
              </>
            )}

            {/* Gifted Items Section */}
            {giftedItems.length > 0 && (
              <>
                <div className="border-t border-green-400/30 pt-3 mt-3 relative">
                  <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 bg-white px-2">
                    <span className="text-[10px] font-medium text-green-600">🎁 Regalos 🎁</span>
                  </div>
                </div>
                {giftedItems.map((item) => (
                  <div
                    key={item.id}
                    className="flex flex-col items-center gap-2 p-2 bg-gradient-to-br from-green-50 to-white rounded relative overflow-hidden animate-shimmer-green"
                  >
                    {/* Sparkle effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent animate-slide" />

                    <div className="absolute -top-1 -right-1 bg-green-500 text-white text-[10px] px-2 py-0.5 rounded font-bold z-10">
                      GRATIS
                    </div>
                    <div className="absolute top-1 left-1 text-green-500 text-xs animate-pulse">
                      🎁
                    </div>
                    <Image
                      src={item.imgs?.thumbnails[0] || '/images/products/default.png'}
                      alt={item.title}
                      width={120}
                      height={120}
                      className="rounded object-cover relative z-10"
                    />
                    <p className="text-xs font-bold text-center text-green-700 relative z-10">
                      ¡REGALO!
                      <span className="block text-[10px] text-green-600">🎉 Obsequio</span>
                    </p>
                    <div className="w-full text-xs bg-white rounded px-1 py-1 text-center font-medium text-dark relative z-10">
                      Cant: {item.quantity}
                    </div>
                  </div>
                ))}

                <style jsx>{`
                  @keyframes shimmer-green {
                    0%, 100% { opacity: 0.85; }
                    50% { opacity: 1; }
                  }
                  .animate-shimmer-green {
                    animation: shimmer-green 2s ease-in-out infinite;
                  }
                `}</style>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PermanentCartSidebar;

