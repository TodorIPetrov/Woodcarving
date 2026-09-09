"use client";

import React, { useState, useRef } from 'react';
import { Upload, Plus, Package, CheckCircle, List, Settings, Lock } from 'lucide-react';
import { addProduct } from '@/lib/actions/product';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('add');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Използваме проста хардкодната парола за момента
    if (password === 'Todor2026') {
      setIsAuthenticated(true);
      setError('');
    } else {
      setError('Грешна парола');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-custom-cream text-custom-forest rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-800 mb-2">Защитен Достъп</h1>
          <p className="text-gray-500 mb-8">Моля, въведете администраторската парола.</p>
          
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none text-center tracking-widest text-lg" 
                placeholder="••••••••"
                autoFocus
              />
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <button type="submit" className="w-full bg-custom-forest hover:bg-custom-forest/90 text-white font-bold py-3 px-4 rounded-lg transition-colors">
              Вход
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        <div className="p-6 border-b border-gray-200">
          <h1 className="text-xl font-serif font-bold text-gray-800">Kazanlak Admin</h1>
        </div>
        <nav className="flex-1 p-4 space-y-2">
          <button 
            onClick={() => setActiveTab('add')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'add' ? 'bg-custom-cream text-custom-forest' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Plus size={20} />
            <span className="font-medium">Добави Продукт</span>
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${activeTab === 'list' ? 'bg-custom-cream text-custom-forest' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <List size={20} />
            <span className="font-medium">Всички Продукти</span>
          </button>
        </nav>
        <div className="p-4 border-t border-gray-200">
          <button onClick={() => setIsAuthenticated(false)} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left text-red-600 hover:bg-red-50 transition-colors">
            <Lock size={20} />
            <span className="font-medium">Изход</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-y-auto">
        {activeTab === 'add' ? <AddProductForm /> : (
          <div className="flex flex-col items-center justify-center h-full text-gray-400">
            <Package size={48} className="mb-4 opacity-50" />
            <h2 className="text-xl">Списъкът с продукти е в разработка</h2>
          </div>
        )}
      </main>
    </div>
  );
}

function AddProductForm() {
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const formRef = useRef<HTMLFormElement>(null);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setFile(files[0]);
      setImagePreview(URL.createObjectURL(files[0]));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) {
      setMessage({ type: 'error', text: 'Моля, качете снимка!' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData(e.currentTarget);
    formData.append('image', file);

    const result = await addProduct(formData);
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message! });
      formRef.current?.reset();
      setFile(null);
      setImagePreview(null);
    } else {
      setMessage({ type: 'error', text: result.error! });
    }
    
    setIsSubmitting(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">Нов Продукт</h2>
          <p className="text-gray-500 mt-1">Добавете информация и снимка директно в сайта.</p>
        </div>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="bg-custom-forest disabled:bg-gray-400 hover:bg-custom-forest/90 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
        >
          {isSubmitting ? 'Качване...' : <><CheckCircle size={18} /> Запази Продукта</>}
        </button>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {/* Main Info */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Основна Информация</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Име на продукта (BG) *</label>
                <input required name="name_bg" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold focus:border-custom-gold outline-none" placeholder="напр. Релефна Икона - Св. Георги" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание (BG)</label>
                <textarea name="description_bg" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none" placeholder="Опишете детайлите..."></textarea>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Име на продукта (EN)</label>
                <input name="name_en" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none" placeholder="e.g. Orthodox Icon Relief" />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание (EN)</label>
                <textarea name="description_en" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none" placeholder="Describe the details..."></textarea>
              </div>
            </div>
          </div>

          {/* Media */}
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Снимка *</h3>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              {imagePreview ? (
                <div className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group bg-gray-50">
                  <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => {setImagePreview(null); setFile(null);}} className="text-white text-xs bg-red-500 px-3 py-1 rounded">Изтрий</button>
                  </div>
                </div>
              ) : (
                <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-custom-gold hover:text-custom-gold transition-colors cursor-pointer bg-gray-50 hover:bg-custom-cream">
                  <Upload size={24} className="mb-2" />
                  <span className="text-sm font-medium text-center px-2">Качи снимка<br/>(до 5MB)</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
                </label>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Детайли</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (BGN) *</label>
                <div className="relative">
                  <input required name="price" type="number" step="0.01" className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none" placeholder="0.00" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">
                    лв.
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select name="category" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none bg-white">
                  <option>Икони</option>
                  <option>Релефи</option>
                  <option>Пана</option>
                  <option>По поръчка</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Наличност</label>
                <select name="stockStatus" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none bg-white">
                  <option>В наличност</option>
                  <option>Изработва се по поръчка</option>
                  <option>Изчерпан</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Материал</label>
                <input name="material" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none" placeholder="напр. Орех" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
