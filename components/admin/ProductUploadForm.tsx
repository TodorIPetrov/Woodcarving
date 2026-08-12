"use client";

import { useState } from "react";
import { collection, addDoc } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { db, storage } from "@/lib/firebase/client";

export default function ProductUploadForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name_bg: "",
    name_en: "",
    description_bg: "",
    description_en: "",
    price: "",
    isMadeToOrder: false,
    woodType_bg: "Орех",
    woodType_en: "Walnut",
    personalization: false,
    personalizationSurcharge: "10",
  });
  const [imageFile, setImageFile] = useState<File | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      let imageUrl = "";
      if (imageFile) {
        const storageRef = ref(storage, `products/${Date.now()}_${imageFile.name}`);
        const snapshot = await uploadBytes(storageRef, imageFile);
        imageUrl = await getDownloadURL(snapshot.ref);
      } else {
        throw new Error("Моля, изберете снимка на продукта.");
      }

      const productData = {
        name_bg: formData.name_bg,
        name_en: formData.name_en,
        description_bg: formData.description_bg,
        description_en: formData.description_en,
        price: parseFloat(formData.price),
        isMadeToOrder: formData.isMadeToOrder,
        woodType_bg: formData.woodType_bg,
        woodType_en: formData.woodType_en,
        personalization: formData.personalization,
        personalizationSurcharge: formData.personalization ? parseFloat(formData.personalizationSurcharge) : 0,
        image: imageUrl,
        createdAt: new Date().toISOString(),
      };

      await addDoc(collection(db, "products"), productData);
      
      setSuccess(true);
      setFormData({
        name_bg: "",
        name_en: "",
        description_bg: "",
        description_en: "",
        price: "",
        isMadeToOrder: false,
        woodType_bg: "Орех",
        woodType_en: "Walnut",
        personalization: false,
        personalizationSurcharge: "10",
      });
      setImageFile(null);
      (document.getElementById('image-upload') as HTMLInputElement).value = '';

    } catch (err: any) {
      console.error(err);
      setError(err.message || "Възникна грешка при качването.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-8 max-w-3xl">
      <h2 className="text-xl font-bold text-custom-forest mb-6">Качване на Нов Продукт</h2>
      
      {success && (
        <div className="bg-green-50 text-green-800 p-4 rounded-md mb-6 border border-green-200">
          Продуктът е качен успешно!
        </div>
      )}
      
      {error && (
        <div className="bg-red-50 text-red-800 p-4 rounded-md mb-6 border border-red-200">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info (BG) */}
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="font-semibold mb-4 text-gray-700 flex items-center"><span className="text-xl mr-2">🇧🇬</span> Български</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Име на продукта</label>
              <input required type="text" name="name_bg" value={formData.name_bg} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-custom-gold focus:border-custom-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Описание</label>
              <textarea required name="description_bg" value={formData.description_bg} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded focus:ring-custom-gold focus:border-custom-gold outline-none"></textarea>
            </div>
          </div>
        </div>

        {/* Basic Info (EN) */}
        <div className="bg-gray-50 p-4 rounded border border-gray-200">
          <h3 className="font-semibold mb-4 text-gray-700 flex items-center"><span className="text-xl mr-2">🇬🇧</span> English</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
              <input required type="text" name="name_en" value={formData.name_en} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-custom-gold focus:border-custom-gold outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea required name="description_en" value={formData.description_en} onChange={handleInputChange} rows={3} className="w-full p-2 border border-gray-300 rounded focus:ring-custom-gold focus:border-custom-gold outline-none"></textarea>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Цена (BGN)</label>
            <input required type="number" step="0.01" min="0" name="price" value={formData.price} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-custom-gold focus:border-custom-gold outline-none" />
          </div>

          {/* Image */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Снимка</label>
            <input id="image-upload" required type="file" accept="image/*" onChange={handleFileChange} className="w-full p-2 border border-gray-300 rounded bg-white outline-none" />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           {/* Wood Type */}
           <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Вид дървесина (BG)</label>
            <select name="woodType_bg" value={formData.woodType_bg} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-custom-gold focus:border-custom-gold outline-none">
              <option value="Орех">Орех</option>
              <option value="Дъб">Дъб</option>
              <option value="Липа">Липа</option>
              <option value="Череша">Череша</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Wood Type (EN)</label>
            <select name="woodType_en" value={formData.woodType_en} onChange={handleInputChange} className="w-full p-2 border border-gray-300 rounded focus:ring-custom-gold focus:border-custom-gold outline-none">
              <option value="Walnut">Walnut</option>
              <option value="Oak">Oak</option>
              <option value="Linden">Linden</option>
              <option value="Cherry">Cherry</option>
            </select>
          </div>
        </div>

        {/* Options */}
        <div className="space-y-4">
          <div className="flex items-center">
            <input type="checkbox" id="isMadeToOrder" name="isMadeToOrder" checked={formData.isMadeToOrder} onChange={handleInputChange} className="h-4 w-4 text-custom-forest border-gray-300 rounded focus:ring-custom-gold outline-none" />
            <label htmlFor="isMadeToOrder" className="ml-2 block text-sm text-gray-700">
              По поръчка (Made to order)
            </label>
          </div>

          <div className="flex items-center">
            <input type="checkbox" id="personalization" name="personalization" checked={formData.personalization} onChange={handleInputChange} className="h-4 w-4 text-custom-forest border-gray-300 rounded focus:ring-custom-gold outline-none" />
            <label htmlFor="personalization" className="ml-2 block text-sm text-gray-700">
              Позволи гравиране
            </label>
          </div>

          {formData.personalization && (
             <div>
               <label className="block text-sm font-medium text-gray-700 mb-1">Такса за гравиране (BGN)</label>
               <input type="number" step="0.01" min="0" name="personalizationSurcharge" value={formData.personalizationSurcharge} onChange={handleInputChange} className="w-48 p-2 border border-gray-300 rounded focus:ring-custom-gold focus:border-custom-gold outline-none" />
             </div>
          )}
        </div>

        <button type="submit" disabled={loading} className="w-full bg-custom-forest hover:bg-custom-forest/90 text-white font-bold py-3 px-4 rounded transition-colors disabled:opacity-50">
          {loading ? "Качване..." : "Качи Продукт"}
        </button>
      </form>
    </div>
  );
}
