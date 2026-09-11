"use client";

import { useState, useEffect } from "react";
import PersonalizationModule from "@/components/PersonalizationModule";
import ImageZoom from "@/components/ImageZoom";

export default function ProductClient({ product, dict, lang = "bg" }: { product: any, dict: any, lang?: string }) {
  const [totalPrice, setTotalPrice] = useState(Number(product?.price) || 0);
  const [engraving, setEngraving] = useState("");
  const [copied, setCopied] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const [currentUrl, setCurrentUrl] = useState("");
  
  // Handle multiple images if product.images exists, otherwise fallback to product.image
  const images = product?.images && product.images.length > 0 ? product.images : (product?.image ? [product.image] : []);
  const [mainImage, setMainImage] = useState(images[0] || "");

  useEffect(() => {
    if (typeof window !== "undefined") {
      setCurrentUrl(window.location.href);
    }
  }, []);

  const handlePersonalizationUpdate = (price: number, text: string) => {
    setTotalPrice(price);
    setEngraving(text);
  };

  const handleCopyLink = () => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(currentUrl || window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const madeToOrderText = dict?.made_to_order_takes || "По поръчка (Изработка {time})";
  
  const phoneNumber = "+359878437966";
  const engravingText = engraving ? (lang === 'bg' ? ` с гравиране: "${engraving}"` : ` with engraving: "${engraving}"`) : '';
  const messageTemplate = (dict?.inquiry_message || 'Здравейте, интересувам се от продукта "{name}" (€{price}){engraving}.')
    .replace('{name}', product?.name || '')
    .replace('{price}', totalPrice.toFixed(2))
    .replace('{engraving}', engravingText);
  const messageText = encodeURIComponent(messageTemplate);

  const shareText = encodeURIComponent(`${product?.name || "Дърворезба"} - Казанлък Дърворезба\n${currentUrl}`);

  const faqs = [
    {
      q: dict?.faq_1_q || "Включено ли е окачване за стена?",
      a: dict?.faq_1_a || "Да, всяка дърворезба пристига с монтирано стабилно метално окачване на гърба, напълно готова за закачане."
    },
    {
      q: dict?.faq_2_q || "Как се поддържа и почиства дървото?",
      a: dict?.faq_2_a || "Творбите са защитени с натурални масла и чист пчелен восък. Достатъчно е периодично забърсване със суха, мека кърпа. Избягвайте мокрене и пряка близост до отоплителни уреди."
    },
    {
      q: dict?.faq_3_q || "Осветени ли са православните икони?",
      a: dict?.faq_3_a || "Според православния канон, всяка икона се освещава в църква от човека, който я придобива или подарява. Нашите творби се изработват с канонична точност и дълбоко уважение към светието."
    },
    {
      q: dict?.faq_4_q || "Може ли да се изработи по индивидуален размер или модел?",
      a: dict?.faq_4_a || "Да! Можем да изработим проект по ваши размери или с персонализирано гравирано посвещение на гърба. Свържете се с нас по телефон или Viber за консултация."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
        {/* Image Gallery */}
        <div className="flex flex-col gap-4">
          {mainImage ? (
            <ImageZoom src={mainImage} alt={product?.name || 'Product Image'} />
          ) : (
            <div className="aspect-square bg-gray-100 flex items-center justify-center text-gray-400 border border-gray-200 rounded">
              {dict?.no_image || "No image"}
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

          {/* Trust Guarantees */}
          <div className="mt-4 p-5 bg-custom-cream/60 rounded-xl border border-gray-100 space-y-3 text-xs text-custom-charcoal/90">
            <div className="flex items-center gap-3">
              <span className="text-base">🌳</span>
              <span className="font-semibold">{dict?.trust_solid_wood || "100% масивна дървесина (орех, дъб, липа)"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base">⚙️</span>
              <span className="font-semibold">{dict?.trust_precision_craft || "Прецизен релеф с майсторска ръчна дообработка"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base">📦</span>
              <span className="font-semibold">{dict?.trust_inspection || "Преглед преди плащане с Еконт или Спиди"}</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-base">🖼️</span>
              <span className="font-semibold">{dict?.trust_ready_to_hang || "Монтирано метално окачване за стена"}</span>
            </div>
          </div>
        </div>

        {/* Product Details */}
        <div className="flex flex-col justify-start">
          <h1 className="font-serif text-3xl md:text-5xl text-custom-forest font-bold mb-4">{product?.name}</h1>
          
          <div className="flex flex-wrap items-center gap-4 mb-6">
            <p className="text-3xl text-custom-gold font-bold">€{totalPrice.toFixed(2)}</p>
            {product?.isMadeToOrder ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full border border-amber-200">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                {madeToOrderText.replace('{time}', product.leadTime || (lang === 'bg' ? '2-3 седмици' : '2-3 weeks'))}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-800 text-xs font-semibold rounded-full border border-emerald-200">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                {dict?.in_stock_ready || (lang === 'bg' ? 'В наличност (Изпращане до 24ч)' : 'In Stock (Ships within 24h)')}
              </span>
            )}
          </div>

          {/* Attributes Grid */}
          {((product?.dimensions || (product?.width && product?.height)) || product?.material || product?.woodType) && (
            <div className="flex flex-wrap gap-6 mb-6 p-4 bg-white rounded-lg border border-gray-100 shadow-sm">
              {(product?.dimensions || (product?.width && product?.height)) && (
                <div>
                  <span className="text-xs font-bold text-custom-charcoal uppercase tracking-wider block mb-0.5">
                    {dict?.dimensions || (lang === 'bg' ? 'Размери' : 'Dimensions')}:
                  </span>
                  <span className="text-sm font-semibold text-custom-forest">
                    {product.dimensions || `${product.width} × ${product.height} см`}
                  </span>
                </div>
              )}

              {(product?.material || product?.woodType) && (
                <div>
                  <span className="text-xs font-bold text-custom-charcoal uppercase tracking-wider block mb-0.5">
                    {dict?.wood_finish || (lang === 'bg' ? 'Материал' : 'Wood')}:
                  </span>
                  <span className="text-sm font-semibold text-custom-charcoal/80">
                    {product.material || product.woodType}
                  </span>
                </div>
              )}
            </div>
          )}

          <p className="text-custom-charcoal/80 mb-8 leading-relaxed whitespace-pre-line text-sm md:text-base">
            {product?.description}
          </p>

          <PersonalizationModule 
            basePrice={Number(product?.price) || 0} 
            surcharge={10.00} 
            onUpdate={handlePersonalizationUpdate}
            dict={dict}
          />

          {/* Order Actions */}
          <div className="mt-8">
            <h3 className="text-xs font-bold text-custom-charcoal mb-3 uppercase tracking-wider">
              {dict?.order_via || "Бърза поръчка / Запитване:"}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <a 
                href={`tel:${phoneNumber}`}
                className="flex items-center justify-center gap-2 py-3.5 border-2 border-custom-forest text-custom-forest hover:bg-custom-forest hover:text-white font-bold text-sm transition-colors rounded shadow-sm"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                {dict?.call || "Обаждане"}
              </a>
              <a 
                href={`viber://chat?number=${phoneNumber.replace('+', '')}&text=${messageText}`}
                className="flex items-center justify-center gap-2 py-3.5 bg-[#7360F2] hover:bg-[#5e4bcf] text-white font-bold text-sm transition-colors rounded shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M21.26 12.22c-.08-.94-.28-1.87-.61-2.77-.32-.88-.74-1.72-1.25-2.49A11.789 11.789 0 0 0 17.15 4.7c-.82-.6-1.7-1.12-2.65-1.5-1.07-.43-2.19-.7-3.32-.82C10.15 2.25 9.08 2.25 8 2.38c-1.16.14-2.3.43-3.38.87-1.08.45-2.09 1.03-3 1.74-.95.74-1.78 1.6-2.48 2.56C.68 8.16.32 9.07.13 10.02c-.19 1-.29 2.03-.28 3.06.01 1.06.16 2.11.45 3.12.33 1.17.84 2.28 1.5 3.28.66.99 1.46 1.88 2.37 2.65a12.8 12.8 0 0 0 1.93 1.34c.14.08.28.14.45.18.27.06.56.02.77-.16.18-.15.31-.35.4-.57l1.09-3.08c.08-.22.1-.47.05-.7-.06-.23-.19-.44-.37-.59-.57-.46-1.06-.99-1.46-1.57-.42-.6-.73-1.25-.92-1.95-.12-.46-.17-.94-.17-1.43 0-.6.11-1.19.3-1.76a5.83 5.83 0 0 1 .86-1.61c.44-.56.98-1.04 1.59-1.4.63-.38 1.32-.63 2.05-.75.45-.07.9-.09 1.35-.07a5.55 5.55 0 0 1 1.92.42c.57.21 1.1.53 1.56.92.51.42.92.93 1.23 1.49.29.54.49 1.12.59 1.73.08.48.1.98.05 1.47a5.56 5.56 0 0 1-.36 1.63c-.19.55-.47 1.07-.81 1.54-.42.59-.92 1.12-1.49 1.57a3.02 3.02 0 0 1-.58.37c-.24.12-.51.13-.76.05-.23-.07-.44-.21-.57-.42l-1.93-3.15c-.14-.24-.36-.43-.63-.52-.28-.09-.58-.07-.84.06-.88.45-1.8.8-2.76 1.05-1.02.26-2.08.38-3.14.35-1.08-.03-2.15-.22-3.17-.55a12.28 12.28 0 0 1-2.9-1.32 1.1 1.1 0 0 0-1.48.33 1.14 1.14 0 0 0-.27 1.12c.07.31.25.57.51.74a14.28 14.28 0 0 0 3.39 1.56c1.17.38 2.4.6 3.64.65 1.23.05 2.46-.06 3.65-.32 1.14-.25 2.24-.65 3.28-1.18 1-.51 1.93-1.14 2.76-1.88.75-.68 1.41-1.44 1.96-2.28.53-.8.95-1.67 1.24-2.58a10.45 10.45 0 0 0 .52-3.23c.02-1.17-.13-2.34-.44-3.48z"/></svg>
                {dict?.viber || "Viber"}
              </a>
              <a 
                href={`https://m.me/Woodcarving21?text=${messageText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 py-3.5 bg-[#0084FF] hover:bg-[#0073e6] text-white font-bold text-sm transition-colors rounded shadow-md"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.145 2 11.258c0 2.9 1.443 5.485 3.69 7.155v3.42l3.376-1.85c.937.26 1.92.398 2.934.398 5.523 0 10-4.144 10-9.257C22 6.145 17.523 2 12 2zm1.092 12.56l-2.8-2.99-5.46 2.99 6.002-6.393 2.893 2.99 5.367-2.99-6.002 6.393z"/></svg>
                {dict?.messenger || "Messenger"}
              </a>
            </div>
          </div>

          {/* Share Block */}
          <div className="mt-8 pt-6 border-t border-gray-100">
            <span className="text-xs font-bold text-custom-charcoal/70 uppercase tracking-wider block mb-3">
              {dict?.share_title || "Сподели с близки:"}
            </span>
            <div className="flex flex-wrap items-center gap-2">
              <a
                href={`viber://forward?text=${shareText}`}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#7360F2]/10 hover:bg-[#7360F2]/20 text-[#7360F2] text-xs font-semibold rounded transition-colors"
                title="Сподели във Viber"
              >
                <span>Viber</span>
              </a>
              <a
                href={`https://api.whatsapp.com/send?text=${shareText}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-semibold rounded transition-colors"
                title="Сподели в WhatsApp"
              >
                <span>WhatsApp</span>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(currentUrl)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-[#1877F2]/10 hover:bg-[#1877F2]/20 text-[#1877F2] text-xs font-semibold rounded transition-colors"
                title="Сподели във Facebook"
              >
                <span>Facebook</span>
              </a>
              <button
                type="button"
                onClick={handleCopyLink}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 border border-gray-200 hover:bg-gray-50 text-custom-charcoal text-xs font-semibold rounded transition-colors"
                title="Копирай връзката"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                </svg>
                <span>{copied ? (dict?.link_copied || "Връзката е копирана!") : (dict?.copy_link || "Копирай връзка")}</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* FAQ Accordion Section */}
      <div className="mt-12 max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-gray-100 p-6 md:p-10">
        <h3 className="font-serif text-2xl md:text-3xl text-custom-forest font-bold mb-6 text-center">
          {dict?.faq_title || "Често задавани въпроси"}
        </h3>
        <div className="space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="border-b border-gray-100 pb-4 last:border-b-0 last:pb-0">
              <button
                type="button"
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left flex justify-between items-center py-2 font-serif text-base md:text-lg text-custom-forest hover:text-custom-gold font-semibold transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <span className="ml-4 text-custom-gold font-bold text-xl leading-none">
                  {openFaq === idx ? "−" : "+"}
                </span>
              </button>
              {openFaq === idx && (
                <p className="mt-2 text-custom-charcoal/80 text-sm leading-relaxed pr-6 animate-fade-in">
                  {faq.a}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
