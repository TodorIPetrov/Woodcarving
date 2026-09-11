import React from 'react';

export default function PreviewCatalogue() {
  // Generate 76 mock products based on the downloaded images
  const products = Array.from({ length: 76 }, (_, i) => ({
    id: `prod_${i + 1}`,
    name: `Дърворезба - Модел ${i + 1}`,
    price: Math.floor(Math.random() * 300) + 100, // Random price between 100 and 400
    image: `/products/product_${i + 1}.jpg`,
    description: "Уникална ръчна изработка от масивно дърво."
  }));

  return (
    <div className="max-w-7xl mx-auto px-4 py-16">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl text-custom-forest mb-4">Локален Преглед на всички 76 продукта</h1>
        <p className="text-custom-muted">Това е временна страница, за да разгледате всички изтеглени снимки като продукти.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
            <div className="h-64 bg-custom-parchment flex items-center justify-center border-b border-gray-50 relative overflow-hidden">
              {/* Using standard img for preview simplicity to avoid Next.js domain config issues */}
              <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-6 flex flex-col flex-grow text-center">
              <h4 className="font-bold text-custom-charcoal text-sm mb-2">{product.name}</h4>
              <p className="text-xs text-custom-muted mb-4 flex-grow line-clamp-3">{product.description}</p>
              <p className="text-custom-gold font-bold mb-4">€{product.price}</p>
              <button className="block w-full py-2 bg-custom-forest hover:bg-custom-forest/90 text-white text-xs font-bold tracking-wider uppercase transition-colors rounded">
                Виж Детайли
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
