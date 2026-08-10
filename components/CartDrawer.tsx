"use client";

import { useCart } from "./CartContext";
import { useState } from "react";

export default function CartDrawer() {
  const { isCartOpen, setIsCartOpen, items, removeItem, totalAmount } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ items }),
      });
      const data = await response.json();
      
      if (!response.ok) {
        alert(data.error || 'Failed to checkout');
        return;
      }

      if (data.url) {
        window.location.href = data.url; // Redirect to Stripe
      } else {
        alert('Checkout successful (Test mode without Stripe)');
      }
    } catch (error) {
      console.error(error);
      alert('Error during checkout');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={() => setIsCartOpen(false)}
      ></div>

      {/* Drawer */}
      <div className="relative w-full max-w-md bg-custom-parchment h-full shadow-2xl flex flex-col animate-slide-in">
        <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-white">
          <h2 className="font-serif text-2xl text-custom-forest">Your Cart</h2>
          <button onClick={() => setIsCartOpen(false)} className="text-gray-400 hover:text-black">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {items.length === 0 ? (
            <p className="text-center text-custom-muted mt-10">Your cart is empty.</p>
          ) : (
            items.map((item) => (
              <div key={item.id} className="flex gap-4 bg-white p-4 rounded border border-gray-100 shadow-sm">
                <div className="w-20 h-20 bg-gray-100 rounded overflow-hidden flex-shrink-0 flex items-center justify-center text-xs text-gray-400 border border-gray-200">
                  Img
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-sm text-custom-charcoal">{item.name}</h3>
                    {item.personalization && (
                      <p className="text-xs text-custom-muted italic mt-1">Engraving: {item.personalization}</p>
                    )}
                  </div>
                  <div className="flex justify-between items-center mt-2">
                    <span className="font-bold text-custom-gold">{item.price.toFixed(2)} BGN</span>
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="text-xs text-red-400 hover:text-red-600 underline"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {items.length > 0 && (
          <div className="p-6 bg-white border-t border-gray-200">
            <div className="flex justify-between mb-4 font-bold text-lg">
              <span>Total:</span>
              <span className="text-custom-gold">{totalAmount.toFixed(2)} BGN</span>
            </div>
            <button 
              onClick={handleCheckout}
              disabled={isCheckingOut}
              className="w-full py-4 bg-custom-forest hover:bg-custom-forest/90 text-white font-bold uppercase tracking-widest rounded disabled:opacity-50"
            >
              {isCheckingOut ? 'Processing...' : 'Checkout Now'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
