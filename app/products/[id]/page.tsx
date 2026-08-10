"use client";

import { useState } from "react";
import PersonalizationModule from "@/components/PersonalizationModule";
import ImageZoom from "@/components/ImageZoom";
import { useCart } from "@/components/CartContext";
import Head from "next/head";

export default function ProductPage({ params }: { params: { id: string } }) {
  const product = {
    id: params.id,
    name: "Orthodox Icon Relief - St. George",
    price: 250.00,
    description: "A meticulously hand-carved wooden relief depicting St. George. Crafted from premium walnut wood, finished with natural oils for lasting durability and a rich aesthetic.",
    image: "/images/st-george-icon.jpg", // Placeholder for high-res zoomable image
    isMadeToOrder: true,
    leadTime: "2-3 weeks"
  };

  const { addItem } = useCart();
  const [totalPrice, setTotalPrice] = useState(product.price);
  const [engraving, setEngraving] = useState("");

  const handlePersonalizationUpdate = (price: number, text: string) => {
    setTotalPrice(price);
    setEngraving(text);
  };

  const handleAddToCart = () => {
    addItem({
      productId: product.id,
      name: product.name,
      price: totalPrice,
      quantity: 1,
      image: product.image,
      personalization: engraving || undefined
    });
  };

  return (
    <>
      {/* Dynamic JSON-LD for VisualArtwork */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VisualArtwork",
            "name": product.name,
            "image": "https://example.com" + product.image,
            "description": product.description,
            "artMedium": "Wood",
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "BGN",
              "availability": product.isMadeToOrder ? "https://schema.org/PreOrder" : "https://schema.org/InStock"
            }
          })
        }}
      />

      <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Image Gallery with Native Zoom */}
        <ImageZoom src={product.image} alt={product.name} />

        {/* Product Details */}
        <div className="flex flex-col justify-center">
          <h1 className="font-serif text-3xl md:text-5xl text-custom-forest font-bold mb-4">{product.name}</h1>
          
          <div className="flex items-center gap-4 mb-6">
            <p className="text-2xl text-custom-gold font-semibold">{product.price.toFixed(2)} BGN</p>
            {product.isMadeToOrder && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                Made to Order (Takes {product.leadTime})
              </span>
            )}
          </div>

          <p className="text-custom-charcoal/80 mb-8 leading-relaxed">
            {product.description}
          </p>

          <PersonalizationModule 
            basePrice={product.price} 
            surcharge={20.00} 
            onUpdate={handlePersonalizationUpdate} 
          />

          {/* Sticky Add to Cart for mobile, static for desktop */}
          <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-gray-200 md:static md:bg-transparent md:border-none md:p-0 md:mt-10 z-40">
            <div className="flex items-center justify-between md:block max-w-7xl mx-auto">
              <div className="md:hidden">
                <span className="block text-sm text-custom-muted">Total</span>
                <span className="block text-xl font-bold text-custom-gold">{totalPrice.toFixed(2)} BGN</span>
              </div>
              <button 
                onClick={handleAddToCart}
                className="w-1/2 md:w-full py-4 bg-custom-forest hover:opacity-90 text-white font-bold tracking-widest uppercase rounded shadow-lg shadow-custom-forest/20 transition-all transform active:scale-95"
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
