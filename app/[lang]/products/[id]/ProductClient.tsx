"use client";

import { useState } from "react";
import PersonalizationModule from "@/components/PersonalizationModule";
import ImageZoom from "@/components/ImageZoom";
import { useCart } from "@/components/CartContext";

export default function ProductClient({ product, dict }: { product: any, dict: any }) {
  const { addItem } = useCart();
  const [totalPrice, setTotalPrice] = useState(Number(product?.price) || 0);
  const [engraving, setEngraving] = useState("");
  
  // Handle multiple images if product.images exists, otherwise fallback to product.image
  const images = product?.images && product.images.length > 0 ? product.images : (product?.image ? [product.image] : []);
  const [mainImage, setMainImage] = useState(images[0] || "");

  const handlePersonalizationUpdate = (price: number, text: string) => {
    setTotalPrice(price);
    setEngraving(text);
  };

  const handleAddToCart = () => {
    addItem({
      productId: product?.id || 'unknown',
      name: product?.name || 'Unknown Product',
      price: totalPrice,
      quantity: 1,
      image: mainImage,
      personalization: engraving || undefined
    });
  };

  const madeToOrderText = dict?.made_to_order_takes || "По поръчка";

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20 grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Image Gallery */}
      <div className="flex flex-col gap-4">
        {mainImage ? (
          <ImageZoom src={mainImage} alt={product?.name || 'Product Image'} />
        ) : (
          <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 rounded">
            Няма снимка
          </div>
        )}
        
        {images.length > 1 && (
          <div className="flex gap-4 overflow-x-auto pb-2">
            {images.map((img: string, idx: number) => (
              <button 
                key={idx} 
                onClick={() => setMainImage(img)}
                className={`flex-shrink-0 w-20 h-20 rounded border-2 overflow-hidden ${mainImage === img ? 'border-custom-forest' : 'border-transparent opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Product Details */}
      <div className="flex flex-col justify-center">
        <h1 className="font-serif text-3xl md:text-5xl text-custom-forest font-bold mb-4">{product?.name}</h1>
        
        <div className="flex items-center gap-4 mb-6">
          <p className="text-2xl text-custom-gold font-semibold">{totalPrice.toFixed(2)} BGN</p>
          {product?.isMadeToOrder && (
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-700 text-xs font-semibold rounded-full border border-amber-200">
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              {madeToOrderText.replace('{time}', product.leadTime || '2-3 weeks')}
            </span>
          )}
        </div>

        <p className="text-custom-charcoal/80 mb-8 leading-relaxed whitespace-pre-line">
          {product?.description}
        </p>

        <PersonalizationModule 
          basePrice={Number(product?.price) || 0} 
          surcharge={20.00} 
          onUpdate={handlePersonalizationUpdate}
          dict={dict}
        />

        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/90 backdrop-blur-lg border-t border-gray-200 md:static md:bg-transparent md:border-none md:p-0 md:mt-10 z-40">
          <div className="flex items-center justify-between md:block max-w-7xl mx-auto">
            <div className="md:hidden">
              <span className="block text-sm text-custom-muted">{dict?.total || 'Общо'}</span>
              <span className="block text-xl font-bold text-custom-gold">{totalPrice.toFixed(2)} BGN</span>
            </div>
            <button 
              onClick={handleAddToCart}
              className="w-1/2 md:w-full py-4 bg-custom-forest hover:opacity-90 text-white font-bold tracking-widest uppercase rounded shadow-lg shadow-custom-forest/20 transition-all transform active:scale-95"
            >
              {dict?.add_to_cart || 'Добави'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
