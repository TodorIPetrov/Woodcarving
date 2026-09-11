"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image?: string;
  images?: string[];
  category?: string;
  isMadeToOrder?: boolean;
}

interface CatalogueDict {
  made_to_order: string;
  view: string;
  search_placeholder: string;
  sort_by: string;
  sort_price_asc: string;
  sort_price_desc: string;
  sort_newest: string;
  all_categories: string;
  no_results: string;
  category_icons: string;
  category_reliefs: string;
  category_panels: string;
  category_custom: string;
}

export default function CatalogueClient({ 
  products, 
  dict, 
  lang 
}: { 
  products: Product[]; 
  dict: CatalogueDict; 
  lang: string;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  const categories = [
    { key: "all", label: dict.all_categories },
    { key: "Icons", label: dict.category_icons },
    { key: "Reliefs", label: dict.category_reliefs },
    { key: "Panels", label: dict.category_panels },
    { key: "Custom", label: dict.category_custom },
  ];

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Filter by search
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q)
      );
    }

    // Filter by category
    if (category !== "all") {
      result = result.filter((p) => p.category === category);
    }

    // Sort
    switch (sortBy) {
      case "price_asc":
        result.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        result.sort((a, b) => b.price - a.price);
        break;
      case "newest":
      default:
        // Already sorted by createdAt desc from server
        break;
    }

    return result;
  }, [products, search, category, sortBy]);

  return (
    <>
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-grow">
          <svg
            className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-custom-muted"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={dict.search_placeholder}
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-custom-gold focus:ring-1 focus:ring-custom-gold transition-colors"
          />
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="px-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-custom-gold text-sm text-custom-charcoal cursor-pointer"
        >
          <option value="newest">{dict.sort_newest}</option>
          <option value="price_asc">{dict.sort_price_asc}</option>
          <option value="price_desc">{dict.sort_price_desc}</option>
        </select>
      </div>

      {/* Category Tabs */}
      <div className="flex flex-wrap gap-2 mb-10">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`px-5 py-2 rounded-full text-sm font-semibold transition-all duration-200 ${
              category === cat.key
                ? "bg-custom-forest text-white shadow-md"
                : "bg-white text-custom-charcoal/70 border border-gray-200 hover:border-custom-gold hover:text-custom-gold"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-custom-muted">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg">{dict.no_results}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {filteredProducts.map((p) => {
            const imageSrc =
              p.images && p.images.length > 0 ? p.images[0] : p.image;

            return (
              <Link
                href={`/${lang}/products/${p.id}`}
                key={p.id}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full group cursor-pointer"
              >
                <div className="relative h-64 bg-custom-parchment flex items-center justify-center border-b border-gray-50 overflow-hidden">
                  {imageSrc ? (
                    <Image
                      src={imageSrc}
                      alt={p.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                      sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    />
                  ) : (
                    <div className="w-full h-full border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs bg-custom-parchment text-center p-2">
                      {p.name}
                    </div>
                  )}

                  {p.isMadeToOrder && (
                    <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-amber-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-amber-100 uppercase tracking-wider">
                      {dict.made_to_order}
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow text-center">
                  <h4 className="font-bold text-custom-charcoal text-lg mb-2 group-hover:text-custom-gold transition-colors">
                    {p.name}
                  </h4>
                  <p className="text-sm text-custom-muted mb-6 flex-grow line-clamp-3">
                    {p.description}
                  </p>
                  <div className="mt-auto">
                    <p className="text-custom-gold font-bold text-xl mb-4">
                      €{p.price.toFixed(2)}
                    </p>
                    <div className="block w-full py-3 bg-custom-forest hover:bg-custom-forest/90 text-white font-bold tracking-widest uppercase transition-colors rounded shadow-md">
                      {dict.view}
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </>
  );
}
