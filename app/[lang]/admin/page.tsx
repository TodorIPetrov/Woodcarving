"use client";

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { Upload, Plus, Package, CheckCircle, List, Lock, Trash2, Edit, ArrowLeft, Eye, EyeOff } from 'lucide-react';
import { addProduct, getProducts, deleteProduct, updateProduct } from '@/lib/actions/product';
import imageCompression from 'browser-image-compression';

export default function AdminPanel() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('add');
  const [productToEdit, setProductToEdit] = useState<any>(null);

  // Check saved session on mount
  useEffect(() => {
    try {
      // Check localStorage for 30-day session
      const saved = localStorage.getItem('admin_session');
      if (saved) {
        const session = JSON.parse(saved);
        if (session.expiry && session.expiry > Date.now()) {
          setIsAuthenticated(true);
          return;
        } else {
          localStorage.removeItem('admin_session');
        }
      }
      // Check sessionStorage
      if (sessionStorage.getItem('admin_session') === 'true') {
        setIsAuthenticated(true);
        return;
      }
    } catch (err) {
      console.error('Session check error:', err);
    }
    setIsAuthenticated(false);
  }, []);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'Todor2026') {
      setIsAuthenticated(true);
      setError('');
      if (rememberMe) {
        const expiry = Date.now() + 30 * 24 * 60 * 60 * 1000; // 30 days
        localStorage.setItem('admin_session', JSON.stringify({ expiry, auth: true }));
      } else {
        sessionStorage.setItem('admin_session', 'true');
      }
    } else {
      setError('Грешна парола');
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem('admin_session');
      sessionStorage.removeItem('admin_session');
    } catch (err) {
      console.error(err);
    }
    setIsAuthenticated(false);
    setPassword('');
  };

  const handleEditProduct = (product: any) => {
    setProductToEdit(product);
    setActiveTab('add');
  };

  // Loading state while checking session
  if (isAuthenticated === null) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-custom-gold border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-custom-cream text-custom-forest rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <Lock size={32} />
          </div>
          <h1 className="text-2xl font-serif font-bold text-gray-800 mb-2">Защитен Достъп</h1>
          <p className="text-gray-500 mb-6 text-sm">Въведете администраторската парола за достъп до ателието.</p>
          
          <form onSubmit={handleLogin} className="space-y-5">
            <div className="relative">
              <input 
                type={showPassword ? "text" : "password"} 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none text-center tracking-widest text-lg" 
                placeholder="••••••••"
                autoFocus
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 p-1"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>

            <label className="flex items-center justify-center gap-2 cursor-pointer text-xs text-gray-600 select-none">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="rounded border-gray-300 text-custom-forest focus:ring-custom-forest h-4 w-4"
              />
              <span>Запомни ме на това устройство (30 дни)</span>
            </label>

            <button type="submit" className="w-full bg-custom-forest hover:bg-custom-forest/90 text-white font-bold py-3 px-4 rounded-lg transition-colors shadow-md">
              Вход
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <Link href="/" className="inline-flex items-center gap-2 text-xs text-custom-muted hover:text-custom-forest transition-colors">
              <ArrowLeft size={14} />
              <span>Обратно към сайта</span>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      {/* Sidebar / Top Navigation on mobile */}
      <aside className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 flex flex-col md:h-screen md:sticky md:top-0 z-30">
        <div className="p-4 md:p-6 border-b border-gray-200 flex items-center justify-between">
          <h1 className="text-lg md:text-xl font-serif font-bold text-gray-800">Kazanlak Admin</h1>
          <Link href="/" className="text-xs font-semibold text-custom-forest hover:text-custom-gold transition-colors flex items-center gap-1.5 md:hidden">
            <ArrowLeft size={14} />
            <span>Сайт</span>
          </Link>
        </div>

        <nav className="flex md:flex-col p-2 md:p-4 gap-2 overflow-x-auto md:overflow-y-auto flex-1">
          <button 
            onClick={() => { setActiveTab('add'); setProductToEdit(null); }}
            className={`flex items-center justify-center md:justify-start gap-2.5 px-3 py-2.5 md:px-4 md:py-3 rounded-lg text-sm transition-colors whitespace-nowrap ${activeTab === 'add' ? 'bg-custom-cream text-custom-forest font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <Plus size={18} />
            <span>{productToEdit ? 'Редакция' : 'Добави'}</span>
          </button>
          <button 
            onClick={() => setActiveTab('list')}
            className={`flex items-center justify-center md:justify-start gap-2.5 px-3 py-2.5 md:px-4 md:py-3 rounded-lg text-sm transition-colors whitespace-nowrap ${activeTab === 'list' ? 'bg-custom-cream text-custom-forest font-bold shadow-sm' : 'text-gray-600 hover:bg-gray-100'}`}
          >
            <List size={18} />
            <span>Всички Продукти</span>
          </button>
        </nav>

        <div className="p-3 md:p-4 border-t border-gray-200 flex md:flex-col gap-2 justify-between">
          <Link href="/" className="hidden md:flex items-center gap-2 px-4 py-2 text-xs font-medium text-custom-charcoal/70 hover:text-custom-gold transition-colors">
            <ArrowLeft size={16} />
            <span>Към началната страница</span>
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center justify-center md:justify-start gap-2 px-3 py-2 md:px-4 md:py-2.5 rounded-lg text-left text-xs md:text-sm text-red-600 hover:bg-red-50 transition-colors">
            <Lock size={16} />
            <span className="font-medium">Изход</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        {activeTab === 'add' ? (
          <AddProductForm 
            key={productToEdit?.id || 'new'} 
            initialData={productToEdit} 
            onCancelEdit={() => { setProductToEdit(null); setActiveTab('list'); }} 
          />
        ) : (
          <ProductList onEdit={handleEditProduct} />
        )}
      </main>
    </div>
  );
}

function AddProductForm({ initialData, onCancelEdit }: { initialData?: any, onCancelEdit?: () => void }) {
  const [imagesPreview, setImagesPreview] = useState<string[]>(initialData?.images || (initialData?.image ? [initialData.image] : []));
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const formRef = useRef<HTMLFormElement>(null);

  const isEdit = !!initialData;

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    if (selectedFiles.length > 0) {
      setFiles(prev => [...prev, ...selectedFiles]);
      const newPreviews = selectedFiles.map(f => URL.createObjectURL(f));
      setImagesPreview(prev => [...prev, ...newPreviews]);
    }
  };

  const removeImage = (index: number) => {
    setImagesPreview(prev => prev.filter((_, i) => i !== index));
    // It's tricky to remove from File[] array if it's a mix of new and old files.
    // If index < old images count, we are removing an old image.
    // If index >= old images count, we remove from `files`.
    const oldImagesCount = imagesPreview.length - files.length;
    if (index >= oldImagesCount) {
      setFiles(prev => prev.filter((_, i) => i !== (index - oldImagesCount)));
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!isEdit && files.length === 0) {
      setMessage({ type: 'error', text: 'Моля, качете поне една снимка!' });
      return;
    }

    setIsSubmitting(true);
    setMessage({ type: '', text: '' });

    const formData = new FormData(e.currentTarget);
    
    // Compress images before upload
    const options = {
      maxSizeMB: 1,
      maxWidthOrHeight: 1920,
      useWebWorker: true
    };
    
    for (const f of files) {
      try {
        const compressedFile = await imageCompression(f, options);
        formData.append('images', compressedFile);
      } catch (error) {
        console.error("Image compression error", error);
        formData.append('images', f); // fallback to original
      }
    }
    
    // Pass existing images that were NOT deleted
    const oldImagesLeft = imagesPreview.filter(p => p.startsWith('http'));
    formData.append('existingImages', JSON.stringify(oldImagesLeft));
    
    let result;
    if (isEdit) {
      formData.append('id', initialData.id);
      result = await updateProduct(formData);
    } else {
      result = await addProduct(formData);
    }
    
    if (result.success) {
      setMessage({ type: 'success', text: result.message! });
      if (!isEdit) {
        formRef.current?.reset();
        setFiles([]);
        setImagesPreview([]);
      }
    } else {
      setMessage({ type: 'error', text: result.error! });
    }
    
    setIsSubmitting(false);
  };

  return (
    <form ref={formRef} onSubmit={handleSubmit} className="max-w-4xl mx-auto">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-800">{isEdit ? 'Редакция на Продукт' : 'Нов Продукт'}</h2>
          <p className="text-gray-500 mt-1">{isEdit ? 'Променете желаните полета и запазете.' : 'Добавете информация и снимка директно в сайта.'}</p>
        </div>
        <div className="flex gap-3">
          {isEdit && (
            <button 
              type="button" 
              onClick={onCancelEdit}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-6 py-2 rounded-lg font-medium transition-colors"
            >
              Отказ
            </button>
          )}
          <button 
            type="submit" 
            disabled={isSubmitting}
            className="bg-custom-forest disabled:bg-gray-400 hover:bg-custom-forest/90 text-white px-6 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 shadow-sm"
          >
            {isSubmitting ? 'Запазване...' : <><CheckCircle size={18} /> {isEdit ? 'Запази Промените' : 'Запази Продукта'}</>}
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`p-4 mb-6 rounded-lg ${message.type === 'success' ? 'bg-green-50 text-green-800 border border-green-200' : 'bg-red-50 text-red-800 border border-red-200'}`}>
          {message.text}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Основна Информация</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Име на продукта (BG) *</label>
                <input defaultValue={initialData?.name_bg || initialData?.name || ''} required name="name_bg" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание (BG)</label>
                <textarea defaultValue={initialData?.description_bg || initialData?.description || ''} name="description_bg" rows={4} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none"></textarea>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-gray-100 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Име на продукта (EN)</label>
                <input defaultValue={initialData?.name_en || ''} name="name_en" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Описание (EN)</label>
                <textarea defaultValue={initialData?.description_en || ''} name="description_en" rows={3} className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none"></textarea>
              </div>
            </div>
          </div>
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Снимки {isEdit ? '' : '*'}</h3>
            <div className="grid grid-cols-2 gap-4 mb-4">
              {imagesPreview.map((src, index) => (
                <div key={index} className="relative aspect-square rounded-lg border border-gray-200 overflow-hidden group bg-gray-50">
                  <img src={src} alt="Preview" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <button type="button" onClick={() => removeImage(index)} className="text-white text-xs bg-red-500 px-3 py-1 rounded">Изтрий</button>
                  </div>
                </div>
              ))}
              <label className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center text-gray-500 hover:border-custom-gold hover:text-custom-gold transition-colors cursor-pointer bg-gray-50 hover:bg-custom-cream">
                <Upload size={24} className="mb-2" />
                <span className="text-sm font-medium text-center px-2">Качи още снимки<br/>(до 5MB)</span>
                <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
          </div>
        </div>
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            <h3 className="text-lg font-semibold mb-4 text-gray-800">Детайли</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Цена (EUR) *</label>
                <div className="relative">
                  <input defaultValue={initialData?.price || ''} required name="price" type="number" step="0.01" className="w-full pl-4 pr-12 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none" placeholder="0.00" />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-gray-500">€</div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Категория</label>
                <select defaultValue={initialData?.category || 'Икони'} name="category" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none bg-white">
                  <option>Икони</option>
                  <option>Релефи</option>
                  <option>Пана</option>
                  <option>По поръчка</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Наличност</label>
                <select defaultValue={initialData?.stockStatus || 'В наличност'} name="stockStatus" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none bg-white">
                  <option>В наличност</option>
                  <option>Изработва се по поръчка</option>
                  <option>Изчерпан</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Материал</label>
                <input defaultValue={initialData?.material || ''} name="material" type="text" className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-custom-gold outline-none" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}

function ProductList({ onEdit }: { onEdit: (p: any) => void }) {
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    setLoading(true);
    const res = await getProducts();
    if (res.success) {
      setProducts(res.products || []);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: string, imageUrl: string) => {
    if (confirm('Сигурни ли сте, че искате да изтриете този продукт? Тази стъпка е необратима.')) {
      await deleteProduct(id, imageUrl);
      fetchProducts();
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Зареждане на продуктите...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Всички Продукти ({products.length})</h2>
      
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="p-4 font-semibold text-gray-600">Снимка</th>
                <th className="p-4 font-semibold text-gray-600">Име</th>
                <th className="p-4 font-semibold text-gray-600">Цена</th>
                <th className="p-4 font-semibold text-gray-600">Наличност</th>
                <th className="p-4 font-semibold text-gray-600 text-right">Действия</th>
              </tr>
            </thead>
            <tbody>
              {products.map(p => (
                <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="p-4">
                    <img src={p.image} alt="thumb" className="w-16 h-16 object-cover rounded shadow-sm border border-gray-200" />
                  </td>
                  <td className="p-4">
                    <span className="font-medium text-gray-800">{p.name_bg || p.name}</span>
                  </td>
                  <td className="p-4">
                    <span className="text-custom-gold font-bold">{Number(p.price).toFixed(2)} лв.</span>
                  </td>
                  <td className="p-4">
                    <span className="text-sm text-gray-500">{p.stockStatus}</span>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-3 justify-end">
                      <button onClick={() => onEdit(p)} className="flex items-center gap-1 text-blue-500 hover:text-blue-700 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded transition-colors text-sm font-medium">
                        <Edit size={16} /> Редакция
                      </button>
                      <button onClick={() => handleDelete(p.id, p.image)} className="flex items-center gap-1 text-red-500 hover:text-red-700 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded transition-colors text-sm font-medium">
                        <Trash2 size={16} /> Изтрий
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {products.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-8 text-center text-gray-500">Няма намерени продукти.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
