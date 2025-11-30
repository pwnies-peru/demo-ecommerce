'use client';

import { addItemToCart } from '@/redux/features/cart-slice';
import { AppDispatch } from '@/redux/store';
import { Product } from '@/types/product';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';

interface NegotiationWindowProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

function calculateDiscount(price: number): number {
  // Lower discount for expensive products, higher for cheap
  if (price >= 100) return Math.floor(Math.random() * 3) + 3; // 3-5%
  if (price >= 50) return Math.floor(Math.random() * 4) + 5; // 5-8%
  if (price >= 20) return Math.floor(Math.random() * 5) + 8; // 8-12%
  return Math.floor(Math.random() * 4) + 12; // 12-15%
}

interface ProductWithOffer extends Product {
  discountPercent: number;
  offerPrice: number;
}

export function NegotiationWindow({ isOpen, onClose, products }: NegotiationWindowProps) {
  const dispatch = useDispatch<AppDispatch>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [productsWithOffers, setProductsWithOffers] = useState<ProductWithOffer[]>([]);
  const [direction, setDirection] = useState<'left' | 'right' | null>(null);
  const [isAccepted, setIsAccepted] = useState(false);
  const [showMatch, setShowMatch] = useState(false);
  const [showIntro, setShowIntro] = useState(true);

  // Reset and generate new offers when window opens
  useEffect(() => {
    if (isOpen && products.length > 0) {
      // Reset to beginning
      setCurrentIndex(0);
      setDirection(null);
      setIsAccepted(false);
      setShowMatch(false);
      setShowIntro(true);
      
      // Generate new offers
      const shuffled = [...products].sort(() => Math.random() - 0.5).slice(0, 10);
      const withOffers = shuffled.map(product => {
        const discountPercent = calculateDiscount(product.price);
        const offerPrice = product.price * (1 - discountPercent / 100);
        return { ...product, discountPercent, offerPrice };
      });
      setProductsWithOffers(withOffers);
    } else if (!isOpen) {
      // Clear state when closed
      setProductsWithOffers([]);
      setCurrentIndex(0);
      setDirection(null);
      setIsAccepted(false);
      setShowMatch(false);
      setShowIntro(true);
    }
  }, [isOpen, products]);

  const handleSwipe = async (dir: 'left' | 'right') => {
    if (isAccepted) return; // Prevent multiple accepts
    
    const currentProduct = productsWithOffers[currentIndex];
    
      // If swiped right, add to cart with offer price - THIS IS THE FINAL OFFER
    if (dir === 'right' && currentProduct) {
      setIsAccepted(true);
      setShowMatch(true);
      
      // Store in negotiated items with full offer details
      const negotiatedItem = {
        ...currentProduct,
        price: currentProduct.offerPrice,
        discountedPrice: currentProduct.offerPrice,
        originalPrice: currentProduct.price, // Store original price
        quantity: 1,
        isNegotiated: true,
        negotiatedDiscount: currentProduct.discountPercent,
        offerDetails: {
          originalPrice: currentProduct.price,
          discountedPrice: currentProduct.offerPrice,
          discountPercent: currentProduct.discountPercent,
          savings: currentProduct.price - currentProduct.offerPrice,
          negotiatedAt: new Date().toISOString(),
        }
      };
      
      // Save to localStorage
      const existingNegotiated = JSON.parse(localStorage.getItem('negotiatedItems') || '[]');
      existingNegotiated.push(negotiatedItem);
      localStorage.setItem('negotiatedItems', JSON.stringify(existingNegotiated));
      
      // Trigger storage event for other components
      window.dispatchEvent(new Event('storage'));
      
      // Add to Redux cart
      dispatch(addItemToCart(negotiatedItem));
      
      // Sync with database
      if (currentProduct.dbId) {
        try {
          const { syncAddToCart } = await import('@/lib/services/cart-sync');
          await syncAddToCart(currentProduct.dbId, 1);
        } catch (error) {
          console.error('Failed to sync cart with database:', error);
        }
      }
      
      // Show seal for 2s, then animate product to cart, then close
      setTimeout(() => {
        setShowMatch(false);
        setDirection('right');
        
        // After product jumps to cart, close modal
        setTimeout(() => {
          onClose();
        }, 1200);
      }, 2000);
    } else {
      // Rejected - just move to next
      setDirection(dir);
      setTimeout(() => {
        if (currentIndex < productsWithOffers.length - 1) {
          setCurrentIndex(prev => prev + 1);
          setDirection(null);
        } else {
          onClose();
        }
      }, 400);
    }
  };

  if (!isOpen || productsWithOffers.length === 0) return null;

  const currentProduct = productsWithOffers[currentIndex];

  return (
    <div 
      className={`${isOpen ? "z-99999" : "hidden"} fixed top-0 left-0 w-full h-screen bg-dark/80 flex items-center justify-center px-4 py-8`}
    >
      {/* Negotiation Guy - Bottom Right */}
      <div className="fixed bottom-0 right-0 pointer-events-none transition-opacity duration-300">
        <Image
          src={isAccepted ? "/images/negotiation2.png" : "/images/negotiation.png"}
          alt="Negotiator"
          width={300}
          height={300}
          className="object-contain transition-all duration-300"
        />
      </div>

      {/* Intro Screen */}
      {showIntro && (
        <div className="relative w-full max-w-[600px] bg-white rounded-xl p-12 text-center">
          <div className="mb-6">
            <span className="text-6xl mb-4 inline-block animate-bounce">🎁</span>
          </div>
          <h2 className="text-4xl font-bold text-dark mb-6">
            ¡Ofertas Especiales para Ti!
          </h2>
          <p className="text-xl text-dark-4 mb-8">
            Te presentaremos {productsWithOffers.length} productos exclusivos con descuentos increíbles.
          </p>
          <div className="bg-blue/10 border-1 border-blue p-6 rounded-lg mb-8">
            <p className="text-2xl font-bold text-blue">
              Solo puedes aceptar UNA oferta
            </p>
            <p className="text-lg text-dark-4 mt-2">
              Elige sabiamente y obtén el mejor descuento
            </p>
          </div>
          <button
            onClick={() => setShowIntro(false)}
            className="bg-dark text-white px-12 py-4 rounded-md font-bold text-xl hover:bg-dark/80 transition"
          >
            Comenzar Negociación
          </button>
        </div>
      )}

      {/* Negotiation Window */}
      {!showIntro && (
        <div className="relative w-full max-w-[500px]">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute -top-12 right-0 text-white hover:text-gray-300 transition"
          >
            <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Progress */}
          <div className="mb-4 text-center text-white">
            <p className="text-sm">Producto {currentIndex + 1} de {productsWithOffers.length}</p>
          </div>

          {/* Card Stack */}
          <div className="relative h-[650px]">
            <SwipeableCard
              key={currentProduct.id}
              product={currentProduct}
              onSwipe={handleSwipe}
              direction={direction}
              isAccepted={isAccepted}
            />
          </div>

          {/* Seal of Approval */}
          {showMatch && (
            <div className="absolute inset-0 flex items-center justify-center z-50">
              <div className="relative">
                {/* Seal SVG */}
                <svg width="300" height="300" viewBox="0 0 200 200" className="animate-[spin_0.5s_ease-out]">
                  <circle cx="100" cy="100" r="90" fill="#16a34a" opacity="0.95"/>
                  <circle cx="100" cy="100" r="75" fill="none" stroke="white" strokeWidth="3"/>
                  <circle cx="100" cy="100" r="65" fill="none" stroke="white" strokeWidth="2"/>
                  {/* Star points */}
                  <path d="M 100 20 L 110 60 L 150 60 L 120 85 L 130 125 L 100 100 L 70 125 L 80 85 L 50 60 L 90 60 Z" fill="white" opacity="0.3"/>
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <div className="text-white font-bold text-2xl text-center leading-tight">
                    OFERTA<br/>ACEPTADA
                  </div>
                  <div className="text-white text-5xl mt-2">✓</div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-center gap-6 mt-6">
            <button
              onClick={() => handleSwipe('left')}
              disabled={isAccepted}
              className={`flex items-center gap-3 bg-dark text-white px-8 py-4 rounded-md font-bold text-lg transition ${
                isAccepted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-dark/90'
              }`}
            >
              <span className="text-2xl">✕</span>
              <span>Pasar</span>
            </button>
            <button
              onClick={() => handleSwipe('right')}
              disabled={isAccepted}
              className={`flex items-center gap-3 bg-dark text-white px-8 py-4 rounded-md font-bold text-lg transition ${
                isAccepted ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-dark'
              }`}
            >
              <span>Aceptar</span>
              <span className="text-2xl">✓</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function SwipeableCard({ 
  product, 
  onSwipe, 
  direction,
  isAccepted
}: { 
  product: ProductWithOffer; 
  onSwipe: (dir: 'left' | 'right') => void;
  direction: 'left' | 'right' | null;
  isAccepted: boolean;
}) {
  return (
    <motion.div
      className="absolute inset-0"
      animate={
        isAccepted && direction === 'right' ? {
          // First move to top right (cart position)
          x: 600,
          y: -300,
          scale: 0.3,
          rotate: 360,
        } : direction === 'right' ? {
          x: 800,
          y: -400,
          scale: 0.5,
          opacity: 0,
        } : direction === 'left' ? {
          x: -600,
          opacity: 0,
        } : {}
      }
      transition={{ 
        duration: isAccepted && direction === 'right' ? 1.2 : direction === 'right' ? 0.8 : 0.4,
        ease: direction === 'right' ? [0.6, 0.01, 0.05, 0.95] : 'easeInOut'
      }}
    >
      <div className="bg-white rounded-md shadow-2xl overflow-hidden h-full flex flex-col">
        {/* Product Image */}
        <div className="relative h-[350px] bg-gray-100">
          <Image
            src={product.imgs?.thumbnails[0] || '/images/products/default.png'}
            alt={product.title}
            fill
            className="object-cover"
          />
        </div>

        {/* Product Info */}
        <div className="flex-1 p-6 flex flex-col">
          <h3 className="font-bold text-xl text-[#000] mb-3 line-clamp-2">
            {product.title}
          </h3>

          {/* Prices */}
          <div className="mb-4">
            <div className="flex items-center gap-4 mb-2">
              <span className="text-5xl font-bold text-[#000]">
                S/ {product.offerPrice.toFixed(2)}
              </span>
              <span className="text-2xl text-[#000] line-through">
                S/ {product.price.toFixed(2)}
              </span>
            </div>
            <div className="bg-green-100 border-2 border-green-500 rounded-lg p-3">
              <p className="text-lg text-[#000] font-bold text-center">
                ¡Ahorras S/ {(product.price - product.offerPrice).toFixed(2)}!
              </p>
            </div>
          </div>

          {/* Discount Emphasis - Offer Badge Style */}
          <div className="mt-auto relative">
            {/* Starburst/Badge Background */}
            <div className="absolute inset-0 flex items-center justify-center opacity-20">
              <div className="w-full h-full bg-red rounded-md transform rotate-2"></div>
              <div className="absolute w-full h-full bg-red rounded-md transform -rotate-2"></div>
            </div>
            {/* Content */}
            <div className="relative bg-red border-[#fff] rounded-md p-6 text-center border-4 border-yellow-400 transform rotate-[-1deg]">
              <div className="transform rotate-[1deg]">
                <p className="text-7xl font-black text-white fg-black text-yellow-300 mb-1 tracking-tighter">
                  -{product.discountPercent}%
                </p>
                <p className="text-2xl text-white font-bold tracking-wide uppercase">
                  DE DESCUENTO
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

