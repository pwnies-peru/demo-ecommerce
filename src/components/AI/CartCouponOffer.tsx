'use client';

import Image from 'next/image';
import { useState } from 'react';

interface CartCouponOfferProps {
  isActive: boolean;
  couponCode: string;
  onCopy?: () => void;
}

export function CartCouponOffer({ isActive, couponCode, onCopy }: CartCouponOfferProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(couponCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    
    // Trigger parent callback
    if (onCopy) {
      onCopy();
    }
  };

  if (!isActive) return null;

  return (
    <div className="bg-gradient-to-r from-yellow-50 to-white border border-gray-3 rounded-[10px] p-6 mb-7.5 animate-[fadeIn_0.5s_ease-out] relative overflow-hidden">
      {/* Magic sparkles */}
      <div className="absolute top-2 left-2 text-2xl animate-pulse">✨</div>
      <div className="absolute top-2 right-2 text-2xl animate-pulse delay-300">✨</div>
      <div className="absolute bottom-2 left-1/4 text-xl animate-pulse delay-500">💫</div>
      <div className="absolute bottom-2 right-1/4 text-xl animate-pulse delay-700">💫</div>
      
      <div className="flex items-center gap-6">
        {/* Blinker Guy */}
        <div className="flex-shrink-0">
          <div className="w-24 h-24 rounded-md overflow-hidden bg-white animate-pulse-slow">
            <Image
              src="/images/blink.png"
              alt="Agent"
              width={96}
              height={96}
              className="object-cover"
            />
          </div>
        </div>

        {/* Message and Coupon */}
        <div className="flex-1">
          <h3 className="text-xl font-bold text-dark mb-2 flex items-center gap-2">
            <span className="animate-bounce">✨</span>
            ¡Tu carrito lleva esperándote un tiempo!
            <span className="animate-bounce delay-200">🎁</span>
          </h3>
          <p className="text-dark-4 mb-4">
            Permíteme darte un cupón especial para animarte a completar tu compra
          </p>

          {/* Coupon Code */}
          <div className="flex items-center gap-3">
            <div className="bg-white border-2 border-yellow-400 rounded-md px-6 py-3 flex items-center gap-3 animate-pulse-border">
              <span className="text-xl">🎟️</span>
              <span className="text-2xl font-bold text-dark tracking-wider">
                {couponCode}
              </span>
              <span className="text-xl">✨</span>
            </div>
            <button
              onClick={handleCopy}
              className="bg-blue text-white px-6 py-3 rounded-md font-bold hover:bg-blue-dark transition flex items-center gap-2"
            >
              {copied ? (
                <>
                  <span className="animate-bounce">✓</span>
                  <span>Copiado</span>
                  <span className="animate-bounce">✨</span>
                </>
              ) : (
                'Copiar Cupón'
              )}
            </button>
            <span className="text-sm text-green-600 font-medium flex items-center gap-1">
              <span className="animate-pulse">💰</span>
              ¡Descuento de S/ 15!
              <span className="animate-pulse delay-300">💰</span>
            </span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            opacity: 1;
          }
          50% {
            opacity: 0.7;
          }
        }
        
        @keyframes pulse-border {
          0%, 100% {
            border-color: #fbbf24;
            box-shadow: 0 0 0 0 rgba(251, 191, 36, 0.4);
          }
          50% {
            border-color: #f59e0b;
            box-shadow: 0 0 0 4px rgba(251, 191, 36, 0.2);
          }
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }
        
        .animate-pulse-border {
          animation: pulse-border 2s ease-in-out infinite;
        }
        
        .delay-200 {
          animation-delay: 200ms;
        }
        
        .delay-300 {
          animation-delay: 300ms;
        }
        
        .delay-500 {
          animation-delay: 500ms;
        }
        
        .delay-700 {
          animation-delay: 700ms;
        }
      `}</style>
    </div>
  );
}

