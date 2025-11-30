'use client';

import { removeItemFromCart, selectTotalPrice, updateCartItemQuantity } from '@/redux/features/cart-slice';
import { AppDispatch, useAppSelector } from '@/redux/store';
import Image from 'next/image';
import Link from 'next/link';
import { useDispatch, useSelector } from 'react-redux';

const PermanentCartSidebar = () => {
  const dispatch = useDispatch<AppDispatch>();
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);

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

  return (
    <div className="fixed right-0 top-0 h-screen w-[200px] bg-white border-l border-gray-3 shadow-sm z-99999 flex flex-col">
      {/* Total & Checkout - At Top */}
      <div className="p-3 border-b border-gray-3 bg-gray-1">
        <p className="text-xs text-center text-dark-4">Total</p>
        <p className="text-sm font-bold text-center mb-2">${totalPrice.toFixed(2)}</p>
        <Link href="/checkout" className="block w-full text-xs text-center bg-blue text-white py-2 rounded hover:bg-blue-dark">
          Pagar
        </Link>
      </div>

      {/* Cart Items */}
      <div className="flex-1 overflow-y-auto no-scrollbar p-2">
        {cartItems.length === 0 ? (
          <p className="text-xs text-center text-gray-500 mt-4">Vacío</p>
        ) : (
          <div className="space-y-3">
            {cartItems.map((item) => (
              <div key={item.id} className="flex flex-col items-center gap-2 p-2 bg-gray-1 rounded">
                <Image
                  src={item.imgs?.thumbnails[0] || '/images/products/default.png'}
                  alt={item.title}
                  width={120}
                  height={120}
                  className="rounded object-cover"
                />
                <p className="text-xs font-medium text-center">${item.discountedPrice.toFixed(2)}</p>
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
          </div>
        )}
      </div>
    </div>
  );
};

export default PermanentCartSidebar;

