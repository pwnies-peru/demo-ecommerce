'use client';

import { useProducts } from '@/app/context/ProductsContext';
import { useEffect, useState } from 'react';
import { AgentNotification } from './AgentNotification';
import { MagicGlow } from './MagicGlow';
import { NegotiationWindow } from './NegotiationWindow';

export function AIFlowTrigger() {
  const [showGlow, setShowGlow] = useState(false);
  const [showAgent, setShowAgent] = useState(false);
  const [showNegotiation, setShowNegotiation] = useState(false);
  const [triggerCount, setTriggerCount] = useState(0);
  const [showCartCoupon, setShowCartCoupon] = useState(false);
  const [cartCouponCode, setCartCouponCode] = useState('');
  
  const { products } = useProducts();

  // Generate random coupon code
  const generateCoupon = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 5; i++) {
      code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === 'g' || e.key === 'G') {
        console.log('G key pressed! Products available:', products.length);
        setTriggerCount(prev => prev + 1);
        setShowGlow(true);
        setShowAgent(true);
        
        // Hide glow after 1.5 seconds
        const glowTimer = setTimeout(() => {
          setShowGlow(false);
        }, 1500);
        
        return () => clearTimeout(glowTimer);
      }
      
      if (e.key === 'c' || e.key === 'C') {
        console.log('C key pressed! Clearing localStorage...');
        // Clear negotiated items
        localStorage.removeItem('negotiatedItems');
        // Trigger storage event to update all components
        window.dispatchEvent(new Event('storage'));
        console.log('✅ localStorage cleared!');
      }
      
      if (e.key === 'h' || e.key === 'H') {
        console.log('H key pressed! Triggering cart coupon offer...');
        const newCoupon = generateCoupon();
        setCartCouponCode(newCoupon);
        setShowCartCoupon(true);
        setShowGlow(true);
        
        // Hide glow after 1.5 seconds
        setTimeout(() => {
          setShowGlow(false);
        }, 1500);
        
        // Store coupon in sessionStorage (for sharing with Cart component)
        sessionStorage.setItem('cartCouponCode', newCoupon);
        sessionStorage.setItem('showCartCoupon', 'true');
        sessionStorage.removeItem('couponTimer'); // No timer for 'h'
        
        console.log('✅ Cart coupon generated:', newCoupon);
      }
      
      if (e.key === 'j' || e.key === 'J') {
        console.log('J key pressed! Triggering cart coupon offer with timer...');
        const newCoupon = generateCoupon();
        setCartCouponCode(newCoupon);
        setShowCartCoupon(true);
        setShowGlow(true);
        
        // Hide glow after 1.5 seconds
        setTimeout(() => {
          setShowGlow(false);
        }, 1500);
        
        // Store coupon with timer (10 minutes = 600 seconds)
        const expiresAt = Date.now() + (10 * 60 * 1000);
        sessionStorage.setItem('cartCouponCode', newCoupon);
        sessionStorage.setItem('showCartCoupon', 'true');
        sessionStorage.setItem('couponTimer', expiresAt.toString());
        
        console.log('✅ Cart coupon with timer generated:', newCoupon);
      }
      
      if (e.key === 'k' || e.key === 'K') {
        console.log('K key pressed! Triggering gifted product offer...');
        
        if (products.length === 0) {
          console.warn('No products available for gift offer');
          return;
        }
        
        // Select a random product
        const randomProduct = products[Math.floor(Math.random() * products.length)];
        
        setShowGlow(true);
        
        // Hide glow after 1.5 seconds
        setTimeout(() => {
          setShowGlow(false);
        }, 1500);
        
        // Store gift offer with timer (10 minutes)
        const expiresAt = Date.now() + (10 * 60 * 1000);
        sessionStorage.setItem('giftProduct', JSON.stringify(randomProduct));
        sessionStorage.setItem('showGiftOffer', 'true');
        sessionStorage.setItem('giftTimer', expiresAt.toString());
        
        console.log('✅ Gift product offer generated:', randomProduct.title);
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [products]);

  const handleOpenNegotiation = () => {
    setShowNegotiation(true);
  };

  const handleCloseNegotiation = () => {
    setShowNegotiation(false);
  };

  return (
    <>
      {showGlow && <MagicGlow isActive={showGlow} key={`glow-${triggerCount}`} />}
      <AgentNotification 
        isActive={showAgent} 
        onOpenNegotiation={handleOpenNegotiation}
        hideIcon={showNegotiation}
        key={`agent-${triggerCount}`} 
      />
      <NegotiationWindow
        isOpen={showNegotiation}
        onClose={handleCloseNegotiation}
        products={products}
      />
    </>
  );
}

// Export state for use in Cart component
export function useCartCouponOffer() {
  const [showOffer, setShowOffer] = useState(false);
  const [couponCode, setCouponCode] = useState('');

  useEffect(() => {
    // Check sessionStorage on mount
    const stored = sessionStorage.getItem('showCartCoupon');
    const code = sessionStorage.getItem('cartCouponCode');
    if (stored === 'true' && code) {
      setShowOffer(true);
      setCouponCode(code);
    }

    // Listen for storage events
    const handleStorage = () => {
      const stored = sessionStorage.getItem('showCartCoupon');
      const code = sessionStorage.getItem('cartCouponCode');
      if (stored === 'true' && code) {
        setShowOffer(true);
        setCouponCode(code);
      }
    };

    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  return { showOffer, couponCode };
}

