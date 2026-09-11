"use client";

import { useState, useMemo, useEffect } from "react";
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
  in_stock?: string;
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
  filter_availability?: string;
  filter_all?: string;
  filter_in_stock?: string;
  filter_made_to_order?: string;
  occasion_title?: string;
  occasion_all?: string;
  occasion_new_home?: string;
  occasion_jubilee?: string;
  occasion_name_day?: string;
}

export default function CatalogueClient({ 
  products, 
  dict, 
  lang,
  initialCategory = "all"
}: { 
  products: Product[]; 
  dict: CatalogueDict; 
  lang: string;
  initialCategory?: string;
}) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState(initialCategory);
  const [availability, setAvailability] = useState<"all" | "in_stock" | "made_to_order">("all");
  const [occasion, setOccasion] = useState<"all" | "new_home" | "jubilee" | "name_day">("all");
  const [sortBy, setSortBy] = useState("newest");

  // Read category from URL parameter on initial mount if available
  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const catParam = params.get("category");
      if (catParam) {
        setCategory(catParam);
      }
    }
  }, []);

  const categories = [
    { key: "all", label: dict.all_categories },
    { key: "Icons", label: dict.category_icons },
    { key: "Reliefs", label: dict.category_reliefs },
    { key: "Panels", label: dict.category_panels },
    { key: "Custom", label: dict.category_custom },
  ];

  const occasions = [
    { key: "all", label: dict.occasion_all || "Всички поводи" },
    { key: "new_home", label: dict.occasion_new_home || "За нов дом" },
    { key: "jubilee", label: dict.occasion_jubilee || "За юбилей / рожден ден" },
    { key: "name_day", label: dict.occasion_name_day || "За имен ден" },
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

    // Filter by availability
    if (availability === "in_stock") {
      result = result.filter((p) => !p.isMadeToOrder);
    } else if (availability === "made_to_order") {
      result = result.filter((p) => p.isMadeToOrder);
    }

    // Filter by occasion
    if (occasion !== "all") {
      if (occasion === "new_home") {
        result = result.filter((p) => {
          const text = (p.name + " " + p.description + " " + (p.category || "")).toLowerCase();
          return text.includes("вечеря") || text.includes("икона") || text.includes("богородица") || text.includes("дом") || text.includes("плакет") || text.includes("панел");
        });
      } else if (occasion === "jubilee") {
        result = result.filter((p) => {
          const text = (p.name + " " + p.description + " " + (p.category || "")).toLowerCase();
          return text.includes("георги") || text.includes("димитър") || text.includes("николай") || text.includes("релеф") || text.includes("вечеря") || text.includes("плакет");
        });
      } else if (occasion === "name_day") {
        result = result.filter((p) => {
          const text = (p.name + " " + p.description + " " + (p.category || "")).toLowerCase();
          return text.includes("св.") || text.includes("икона") || text.includes("георги") || text.includes("димитър") || text.includes("николай") || text.includes("мина") || text.includes("йоан") || text.includes("петка") || text.includes("богородица");
        });
      }
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
        // Preserves database default
        break;
    }

    return result;
  }, [products, search, category, availability, occasion, sortBy]);

  return (
    <>
      {/* Search and Sort Controls */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="relative flex-grow">
          <svg
            className="absolute left-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-custom-muted"
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
            className="w-full pl-11 pr-4 py-3 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-custom-gold focus:ring-1 focus:ring-custom-gold transition-colors text-sm"
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
      <div className="flex flex-wrap gap-2 mb-4">
        {categories.map((cat) => (
          <button
            key={cat.key}
            onClick={() => setCategory(cat.key)}
            className={`px-4 py-2 rounded-full text-xs md:text-sm font-semibold transition-all duration-200 cursor-pointer ${
              category === cat.key
                ? "bg-custom-forest text-white shadow-md"
                : "bg-white text-custom-charcoal/70 border border-gray-200 hover:border-custom-gold hover:text-custom-gold"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Secondary Filters: Availability & Occasion */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-3 bg-white/70 backdrop-blur-sm rounded-xl border border-gray-100 text-xs">
        {/* Availability Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-custom-charcoal uppercase tracking-wider text-[11px]">
            {dict.filter_availability || "Наличност:"}
          </span>
          <button
            type="button"
            onClick={() => setAvailability("all")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              availability === "all"
                ? "bg-custom-forest text-white"
                : "bg-gray-100 hover:bg-gray-200 text-custom-charcoal/80"
            }`}
          >
            {dict.filter_all || "Всички"}
          </button>
          <button
            type="button"
            onClick={() => setAvailability("in_stock")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 cursor-pointer ${
              availability === "in_stock"
                ? "bg-emerald-700 text-white"
                : "bg-emerald-50 text-emerald-800 hover:bg-emerald-100 border border-emerald-200"
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            {dict.filter_in_stock || "В наличност (до 24ч)"}
          </button>
          <button
            type="button"
            onClick={() => setAvailability("made_to_order")}
            className={`px-3 py-1.5 rounded-md font-semibold transition-colors cursor-pointer ${
              availability === "made_to_order"
                ? "bg-amber-700 text-white"
                : "bg-amber-50 text-amber-800 hover:bg-amber-100 border border-amber-200"
            }`}
          >
            {dict.filter_made_to_order || "По поръчка"}
          </button>
        </div>

        {/* Occasion Filter */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-bold text-custom-charcoal uppercase tracking-wider text-[11px]">
            {dict.occasion_title || "Повод:"}
          </span>
          {occasions.map((occ) => (
            <button
              key={occ.key}
              type="button"
              onClick={() => setOccasion(occ.key as any)}
              className={`px-2.5 py-1.5 rounded-md font-medium transition-colors cursor-pointer ${
                occasion === occ.key
                  ? "bg-custom-gold text-white font-bold"
                  : "bg-gray-100 hover:bg-gray-200 text-custom-charcoal/70"
              }`}
            >
              {occ.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product count and active filters indicator */}
      <div className="flex justify-between items-center mb-6 text-xs text-custom-muted px-1">
        <span>
          Показани <strong className="text-custom-forest">{filteredProducts.length}</strong> от {products.length} творби
        </span>
        {(search || category !== "all" || availability !== "all" || occasion !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setAvailability("all");
              setOccasion("all");
            }}
            className="text-custom-forest hover:text-custom-gold underline font-semibold cursor-pointer"
          >
            Изчисти филтрите
          </button>
        )}
      </div>

      {/* Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 text-custom-muted bg-white rounded-xl border border-gray-100 p-8">
          <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <p className="text-lg mb-4">{dict.no_results}</p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setCategory("all");
              setAvailability("all");
              setOccasion("all");
            }}
            className="px-6 py-2.5 bg-custom-forest text-white text-xs font-bold uppercase tracking-wider rounded hover:bg-custom-forest/90 transition-colors"
          >
            Покажи всички продукти
          </button>
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
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full group cursor-pointer hover:-translate-y-1"
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

                  {p.isMadeToOrder ? (
                    <div className="absolute top-3 right-3 bg-white/95 backdrop-blur text-amber-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-amber-200 uppercase tracking-wider">
                      {dict.made_to_order}
                    </div>
                  ) : (
                    <div className="absolute top-3 right-3 bg-emerald-50 text-emerald-800 text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm border border-emerald-200 uppercase tracking-wider">
                      {dict.in_stock || "В наличност"}
                    </div>
                  )}
                </div>

                <div className="p-6 flex flex-col flex-grow text-center">
                  <h3 className="font-bold text-custom-charcoal text-base mb-2 group-hover:text-custom-gold transition-colors">
                    {p.name}
                  </h3>
                  <p className="text-xs text-custom-muted mb-4 flex-grow line-clamp-3">
                    {p.description}
                  </p>
                  <div className="mt-auto">
                    <p className="text-custom-gold font-bold text-xl mb-4">
                      €{p.price.toFixed(2)}
                    </p>
                    <div className="block w-full py-2.5 bg-custom-forest hover:bg-custom-forest/90 text-white font-bold text-xs tracking-widest uppercase transition-colors rounded shadow-sm">
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
