"use client";

import { useState } from "react";

interface PersonalizationProps {
  basePrice: number;
  surcharge: number;
  onUpdate: (total: number, text: string) => void;
}

export default function PersonalizationModule({ basePrice, surcharge, onUpdate }: PersonalizationProps) {
  const [isPersonalized, setIsPersonalized] = useState(false);
  const [text, setText] = useState("");

  const handleToggle = (checked: boolean) => {
    setIsPersonalized(checked);
    onUpdate(checked ? basePrice + surcharge : basePrice, checked ? text : "");
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setText(val);
    onUpdate(basePrice + surcharge, val);
  };

  return (
    <div className="mt-6 p-6 bg-white border border-gray-200 shadow-sm rounded-xl">
      <label className="flex items-center space-x-3 cursor-pointer mb-4">
        <input 
          type="checkbox" 
          className="form-checkbox h-5 w-5 text-custom-forest rounded border-gray-300 bg-white focus:ring-custom-forest"
          checked={isPersonalized}
          onChange={(e) => handleToggle(e.target.checked)}
        />
        <span className="text-lg font-medium text-custom-charcoal">Add Custom Engraving (+{surcharge.toFixed(2)} BGN)</span>
      </label>

      {isPersonalized && (
        <div className="animate-fade-in mt-4">
          <label className="block text-sm text-custom-muted mb-2">Engraving Text (Max 20 characters)</label>
          <input
            type="text"
            maxLength={20}
            value={text}
            onChange={handleTextChange}
            placeholder="e.g., John & Mary"
            className="w-full px-4 py-3 bg-custom-parchment border border-gray-200 rounded-lg text-custom-charcoal placeholder-gray-400 focus:outline-none focus:border-custom-forest focus:ring-1 focus:ring-custom-forest transition-colors"
          />
          <div className="text-right text-xs text-custom-muted mt-2">
            {text.length} / 20
          </div>
        </div>
      )}
    </div>
  );
}
