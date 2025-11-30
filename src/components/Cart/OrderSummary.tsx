import { selectTotalPrice } from "@/redux/features/cart-slice";
import { useAppSelector } from "@/redux/store";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

interface OrderSummaryProps {
  appliedCoupon?: string | null;
}

const OrderSummary = ({ appliedCoupon }: OrderSummaryProps) => {
  const cartItems = useAppSelector((state) => state.cartReducer.items);
  const totalPrice = useSelector(selectTotalPrice);
  const [negotiatedItems, setNegotiatedItems] = useState<any[]>([]);
  const [giftedItems, setGiftedItems] = useState<any[]>([]);

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
    window.addEventListener('storage', loadNegotiated);
    return () => window.removeEventListener('storage', loadNegotiated);
  }, []);

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

  const couponDiscount = appliedCoupon ? 15.00 : 0;
  const finalTotal = Math.max(0, totalPrice - couponDiscount);

  return (
    <div className="lg:max-w-[455px] w-full">
      {/* <!-- order list box --> */}
      <div className="bg-white shadow-1 rounded-[10px]">
        <div className="border-b border-gray-3 py-5 px-4 sm:px-8.5">
          <h3 className="font-medium text-xl text-dark">Order Summary</h3>
        </div>

        <div className="pt-2.5 pb-8.5 px-4 sm:px-8.5">
          {/* <!-- title --> */}
          <div className="flex items-center justify-between py-5 border-b border-gray-3">
            <div>
              <h4 className="font-medium text-dark">Product</h4>
            </div>
            <div>
              <h4 className="font-medium text-dark text-right">Subtotal</h4>
            </div>
          </div>

          {/* <!-- product item --> */}
          {cartItems.map((item, key) => (
            <div key={key} className="flex items-center justify-between py-5 border-b border-gray-3">
              <div>
                <p className="text-dark">{item.title}</p>
              </div>
              <div>
                <p className="text-dark text-right">
                  S/ {(item.discountedPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          {negotiatedItems.map((item, key) => (
            <div key={`neg-${key}`} className="flex items-center justify-between py-5 border-b border-gray-3 bg-yellow-50/50">
              <div>
                <p className="text-yellow-700 font-medium">🎁 {item.title}</p>
              </div>
              <div>
                <p className="text-yellow-700 font-medium text-right">
                  S/ {(item.discountedPrice * item.quantity).toFixed(2)}
                </p>
              </div>
            </div>
          ))}

          {giftedItems.map((item, key) => (
            <div key={`gift-${key}`} className="flex items-center justify-between py-5 border-b border-gray-3 bg-green-50/50">
              <div>
                <p className="text-green-700 font-medium flex items-center gap-1">
                  <span className="animate-pulse">🎁</span>
                  {item.title} (Regalo)
                </p>
              </div>
              <div>
                <p className="text-green-700 font-bold text-right">
                  ¡GRATIS!
                </p>
              </div>
            </div>
          ))}

          {/* <!-- subtotal --> */}
          <div className="flex items-center justify-between pt-5 border-b border-gray-3 pb-5">
            <div>
              <p className="text-dark">Subtotal</p>
            </div>
            <div>
              <p className="text-dark text-right">
                S/ {totalPrice.toFixed(2)}
              </p>
            </div>
          </div>

          {/* <!-- coupon discount --> */}
          {appliedCoupon && (
            <div className="flex items-center justify-between py-5 border-b border-gray-3 bg-green-50 relative overflow-hidden animate-[slideIn_0.5s_ease-out]">
              <div className="absolute top-1 left-2 text-sm animate-pulse">✨</div>
              <div className="absolute top-1 right-2 text-sm animate-pulse delay-300">💫</div>
              <div>
                <p className="text-green-700 font-medium flex items-center gap-2">
                  <span className="animate-bounce">🎟️</span>
                  Cupón "{appliedCoupon}"
                  <span className="animate-pulse">✨</span>
                </p>
              </div>
              <div>
                <p className="text-green-700 font-bold text-right flex items-center gap-1">
                  <span className="animate-pulse">💰</span>
                  - S/ {couponDiscount.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* <!-- total --> */}
          <div className="flex items-center justify-between pt-5">
            <div>
              <p className="font-medium text-xl text-dark">Total</p>
            </div>
            <div>
              <p className="font-medium text-xl text-dark text-right">
                S/ {finalTotal.toFixed(2)}
              </p>
            </div>
          </div>

          {/* <!-- checkout button --> */}
          <button
            type="submit"
            className="w-full flex justify-center font-medium text-white bg-dark py-3 px-6 rounded-md ease-out duration-200 hover:bg-dark/80 mt-7.5"
          >
            Process to Checkout
          </button>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
