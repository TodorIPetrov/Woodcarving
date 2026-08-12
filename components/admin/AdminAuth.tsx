"use client";

import { useState } from "react";

export default function AdminAuth({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simple client-side protection.
    if (password === "Kazanlak2026") {
      setIsAuthenticated(true);
    } else {
      setError("Грешна парола! Моля, опитайте отново.");
      setPassword("");
    }
  };

  if (isAuthenticated) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-sm border border-gray-100">
        <h2 className="text-2xl font-serif text-custom-forest font-bold mb-6 text-center">Административен Панел</h2>
        
        {error && (
          <div className="bg-red-50 text-red-600 p-3 rounded text-sm mb-4 border border-red-100 text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Парола за достъп</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded focus:ring-custom-gold focus:border-custom-gold outline-none"
              placeholder="Въведете паролата"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-custom-forest hover:bg-custom-forest/90 text-white font-bold py-3 px-4 rounded transition-colors"
          >
            Вход
          </button>
        </form>
      </div>
    </div>
  );
}
