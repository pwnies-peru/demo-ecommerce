'use client';

import { useState } from "react";

interface DiscountProps {
  onApplyCoupon: (code: string) => void;
  appliedCoupon: string | null;
}

const Discount = ({ onApplyCoupon, appliedCoupon }: DiscountProps) => {
  const [couponCode, setCouponCode] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode.trim()) {
      setMessage('Por favor ingresa un código de cupón');
      setTimeout(() => setMessage(''), 3000);
      return;
    }

    // Any coupon gives 15 PEN discount
    onApplyCoupon(couponCode.trim().toUpperCase());
    setMessage('✓ Cupón aplicado correctamente!');
    setTimeout(() => setMessage(''), 3000);
  };

  return (
    <div className="lg:max-w-[670px] w-full">
      <form onSubmit={handleSubmit}>
        {/* <!-- coupon box --> */}
        <div className="bg-white rounded-[10px]">
          <div className="border-b border-gray-3 py-5 px-4 sm:px-5.5">
            <h3 className="font-medium text-dark">¿Tienes un código de descuento?</h3>
          </div>

          <div className="py-8 px-4 sm:px-8.5">
            <div className="flex flex-wrap gap-4 xl:gap-5.5">
              <div className="max-w-[426px] w-full">
                <input
                  type="text"
                  name="coupon"
                  id="coupon"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  placeholder="Ingresa tu código de cupón"
                  disabled={!!appliedCoupon}
                  className="rounded-md border border-gray-3 bg-gray-1 placeholder:text-dark-5 w-full py-2.5 px-5 outline-none duration-200 focus:border-transparent focus:shadow-input focus:ring-2 focus:ring-blue/20 disabled:opacity-50 disabled:cursor-not-allowed"
                />
              </div>

              <button
                type="submit"
                disabled={!!appliedCoupon}
                className="inline-flex font-medium text-white bg-blue py-3 px-8 rounded-md ease-out duration-200 hover:bg-blue-dark disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {appliedCoupon ? 'Cupón Aplicado' : 'Aplicar Código'}
              </button>
            </div>
            
            {message && (
              <p className={`mt-3 text-sm ${message.includes('✓') ? 'text-green-600' : 'text-red'}`}>
                {message}
              </p>
            )}
            
            {appliedCoupon && (
              <div className="mt-4 bg-green-50 border border-green-300 rounded-md p-3 relative overflow-hidden animate-[slideIn_0.5s_ease-out]">
                <div className="absolute top-1 left-2 text-sm animate-pulse">✨</div>
                <div className="absolute top-1 right-2 text-sm animate-pulse delay-300">✨</div>
                <p className="text-sm text-green-700 font-medium flex items-center gap-2">
                  <span className="animate-bounce">✓</span>
                  Cupón "{appliedCoupon}" aplicado
                  <span className="animate-pulse">🎟️</span>
                  - Descuento: S/ 15.00
                  <span className="animate-pulse delay-300">💰</span>
                </p>
              </div>
            )}
          </div>
        </div>
      </form>
    </div>
  );
};

export default Discount;
