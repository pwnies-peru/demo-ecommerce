'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

interface GiftedProductOfferProps {
  isActive: boolean;
  product: any;
  expiresAt: number | null;
  onAccept: () => void;
  onDecline: () => void;
}

export function GiftedProductOffer({ 
  isActive, 
  product, 
  expiresAt,
  onAccept,
  onDecline 
}: GiftedProductOfferProps) {
  const [timeRemaining, setTimeRemaining] = useState<number | null>(null);
  const [accepted, setAccepted] = useState(false);

  useEffect(() => {
    if (!expiresAt) {
      setTimeRemaining(null);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const remaining = Math.max(0, expiresAt - now);
      setTimeRemaining(remaining);
      
      if (remaining === 0) {
        console.log('⏰ Gift offer expired');
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    
    return () => clearInterval(interval);
  }, [expiresAt]);

  const formatTime = (ms: number) => {
    const totalSeconds = Math.floor(ms / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleAccept = () => {
    setAccepted(true);
    setTimeout(() => {
      onAccept();
    }, 1000);
  };

  if (!isActive || !product) return null;

  const isExpired = timeRemaining === 0;

  return (
    <div className="bg-gradient-to-r from-green-50 to-white border border-gray-3 rounded-[10px] p-6 mb-7.5 animate-[fadeIn_0.5s_ease-out] relative overflow-hidden">
      {/* Magic sparkles */}
      <div className="absolute top-2 left-2 text-2xl animate-pulse">✨</div>
      <div className="absolute top-2 right-2 text-2xl animate-pulse delay-300">🎁</div>
      <div className="absolute bottom-2 left-1/4 text-xl animate-pulse delay-500">💫</div>
      <div className="absolute bottom-2 right-1/4 text-xl animate-pulse delay-700">🎉</div>

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

        {/* Message and Product */}
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-xl font-bold text-dark flex items-center gap-2">
              <span className="animate-bounce">🎁</span>
              ¡Te Regalo Este Producto!
            </h3>
            {timeRemaining !== null && timeRemaining > 0 && (
              <div className="bg-red text-white px-4 py-2 rounded-md font-bold text-lg animate-pulse flex items-center gap-2">
                <span>⏰</span>
                <span>{formatTime(timeRemaining)}</span>
              </div>
            )}
            {isExpired && (
              <div className="bg-gray-400 text-white px-4 py-2 rounded-md font-bold text-lg">
                <span>⏰ Expirado</span>
              </div>
            )}
          </div>
          <p className="text-dark-4 mb-4">
            Para ayudarte a completar tu compra, te obsequio este producto totalmente gratis. ¡Aprovecha antes de que expire!
          </p>

          {/* Product Display */}
          <div className="bg-white border-2 border-green-400 rounded-md p-4 mb-4 animate-pulse-border-green">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                <Image
                  src={product.imgs?.thumbnails[0] || '/images/products/default.png'}
                  alt={product.title}
                  width={80}
                  height={80}
                  className="object-cover rounded"
                />
              </div>
              <div className="flex-1">
                <h4 className="font-bold text-dark mb-1 line-clamp-2">{product.title}</h4>
                <div className="flex items-center gap-2">
                  <span className="text-lg font-bold text-green-600">¡GRATIS!</span>
                  <span className="text-sm text-gray-500 line-through">S/ {product.price.toFixed(2)}</span>
                  <span className="bg-green-100 text-green-700 text-xs px-2 py-1 rounded-md font-bold">
                    100% DE DESCUENTO
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3">
            {!accepted && !isExpired ? (
              <>
                <button
                  onClick={handleAccept}
                  className="bg-green-600 text-white px-8 py-3 rounded-md font-bold hover:bg-green-700 transition flex items-center gap-2"
                >
                  <span className="text-xl">🎁</span>
                  <span>¡Aceptar Regalo!</span>
                  <span className="animate-bounce">✨</span>
                </button>
                <button
                  onClick={onDecline}
                  className="bg-gray-400 text-white px-6 py-3 rounded-md font-medium hover:bg-gray-500 transition"
                >
                  No, gracias
                </button>
              </>
            ) : accepted ? (
              <div className="bg-green-100 text-green-700 px-8 py-3 rounded-md font-bold flex items-center gap-2">
                <span className="animate-bounce">✓</span>
                <span>¡Regalo Aceptado!</span>
                <span className="animate-bounce">🎉</span>
              </div>
            ) : (
              <div className="bg-gray-200 text-gray-600 px-8 py-3 rounded-md font-bold">
                Oferta Expirada
              </div>
            )}
            {!accepted && !isExpired && (
              <span className="text-sm text-green-600 font-medium flex items-center gap-1">
                <span className="animate-pulse">💰</span>
                Ahorra S/ {product.price.toFixed(2)}
                <span className="animate-pulse delay-300">💰</span>
              </span>
            )}
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

        @keyframes pulse-border-green {
          0%, 100% {
            border-color: #4ade80;
            box-shadow: 0 0 0 0 rgba(74, 222, 128, 0.4);
          }
          50% {
            border-color: #22c55e;
            box-shadow: 0 0 0 4px rgba(74, 222, 128, 0.2);
          }
        }

        .animate-pulse-slow {
          animation: pulse-slow 3s ease-in-out infinite;
        }

        .animate-pulse-border-green {
          animation: pulse-border-green 2s ease-in-out infinite;
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

