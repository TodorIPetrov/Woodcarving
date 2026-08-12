"use client";

import { useState } from "react";
import ProductUploadForm from "./ProductUploadForm";

export default function AdminTabs({ ordersContent }: { ordersContent: React.ReactNode }) {
  const [activeTab, setActiveTab] = useState<"orders" | "products">("orders");

  return (
    <div>
      <div className="flex border-b border-gray-200 mb-8">
        <button
          onClick={() => setActiveTab("orders")}
          className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors outline-none ${
            activeTab === "orders"
              ? "border-custom-gold text-custom-gold"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Поръчки (Orders)
        </button>
        <button
          onClick={() => setActiveTab("products")}
          className={`py-2 px-4 border-b-2 font-medium text-sm transition-colors outline-none ${
            activeTab === "products"
              ? "border-custom-gold text-custom-gold"
              : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
          }`}
        >
          Продукти (Products)
        </button>
      </div>

      <div className="mt-4">
        {activeTab === "orders" ? ordersContent : <ProductUploadForm />}
      </div>
    </div>
  );
}
