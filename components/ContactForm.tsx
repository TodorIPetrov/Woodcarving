"use client";

import { useState } from "react";
import { submitInquiry } from "@/lib/actions/inquiry";

export default function ContactForm({ dict }: { dict: any }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setErrorMessage("");
    setIsSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitInquiry(formData);

    setIsSubmitting(false);
    if (result.success) {
      setIsSuccess(true);
    } else {
      setErrorMessage(result.error || dict?.error_fill_fields || "Възникна грешка.");
    }
  };

  if (isSuccess) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm border border-emerald-100 text-center flex flex-col items-center justify-center min-h-[380px]">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-4">
          <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="font-serif text-2xl text-custom-forest font-bold mb-2">
          {dict?.success_title || "Запитването е изпратено успешно!"}
        </h3>
        <p className="text-custom-charcoal/80 max-w-md mx-auto mb-6 text-sm">
          {dict?.success_desc || "Благодарим ви! Получихме вашето съобщение и ще се свържем с вас в най-кратък срок."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 w-full max-w-sm">
          <a
            href="viber://chat?number=359878437966"
            className="flex-1 py-3 px-4 bg-[#7360F2] hover:bg-[#5e4bcf] text-white font-bold text-xs uppercase tracking-wider rounded transition-colors flex items-center justify-center gap-2 shadow-sm"
          >
            <span>Viber чат</span>
          </a>
          <button
            type="button"
            onClick={() => setIsSuccess(false)}
            className="flex-1 py-3 px-4 border border-gray-300 text-custom-charcoal hover:bg-gray-50 text-xs font-semibold uppercase tracking-wider rounded transition-colors"
          >
            Ново запитване
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
      <h3 className="font-serif text-2xl text-custom-forest mb-6">
        {dict?.send_message_title || "Изпратете Запитване"}
      </h3>

      {errorMessage && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded">
          {errorMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-custom-charcoal uppercase tracking-wider mb-2">
            {dict?.name_label || "Вашето Име"} *
          </label>
          <input
            type="text"
            name="name"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-custom-gold focus:bg-white transition-colors text-sm"
            placeholder={dict?.name_placeholder || "Иван Иванов"}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-custom-charcoal uppercase tracking-wider mb-2">
            {dict?.contact_label || "Телефон или Имейл"} *
          </label>
          <input
            type="text"
            name="contact"
            required
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-custom-gold focus:bg-white transition-colors text-sm"
            placeholder={dict?.contact_placeholder || "+359 88 ... или имейл"}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-custom-charcoal uppercase tracking-wider mb-2">
            {dict?.message_label || "Вашето Съобщение / Въпрос"}
          </label>
          <textarea
            name="message"
            rows={4}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-custom-gold focus:bg-white transition-colors text-sm"
            placeholder={dict?.message_placeholder || "Как можем да ви помогнем?"}
          ></textarea>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-4 bg-custom-forest hover:bg-custom-forest/90 disabled:opacity-50 text-white font-bold tracking-widest uppercase text-sm rounded shadow-md transition-colors mt-4 flex items-center justify-center gap-2 cursor-pointer"
        >
          {isSubmitting ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{dict?.sending || "Изпращане..."}</span>
            </>
          ) : (
            <span>{dict?.send_button || "Изпрати Запитване"}</span>
          )}
        </button>
      </form>

      <div className="mt-6 pt-6 border-t border-gray-100 text-center">
        <p className="text-xs text-custom-muted mb-3">
          {dict?.instant_viber || "Или ни пишете директно във Viber за мигновен отговор:"}
        </p>
        <a
          href="viber://chat?number=359878437966"
          className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-[#7360F2]/10 hover:bg-[#7360F2]/20 text-[#7360F2] font-semibold text-xs rounded transition-colors"
        >
          <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
            <path d="M21.26 12.22c-.08-.94-.28-1.87-.61-2.77-.32-.88-.74-1.72-1.25-2.49A11.789 11.789 0 0 0 17.15 4.7c-.82-.6-1.7-1.12-2.65-1.5-1.07-.43-2.19-.7-3.32-.82C10.15 2.25 9.08 2.25 8 2.38c-1.16.14-2.3.43-3.38.87-1.08.45-2.09 1.03-3 1.74-.95.74-1.78 1.6-2.48 2.56C.68 8.16.32 9.07.13 10.02c-.19 1-.29 2.03-.28 3.06.01 1.06.16 2.11.45 3.12.33 1.17.84 2.28 1.5 3.28.66.99 1.46 1.88 2.37 2.65a12.8 12.8 0 0 0 1.93 1.34c.14.08.28.14.45.18.27.06.56.02.77-.16.18-.15.31-.35.4-.57l1.09-3.08c.08-.22.1-.47.05-.7-.06-.23-.19-.44-.37-.59-.57-.46-1.06-.99-1.46-1.57-.42-.6-.73-1.25-.92-1.95-.12-.46-.17-.94-.17-1.43 0-.6.11-1.19.3-1.76a5.83 5.83 0 0 1 .86-1.61c.44-.56.98-1.04 1.59-1.4.63-.38 1.32-.63 2.05-.75.45-.07.9-.09 1.35-.07a5.55 5.55 0 0 1 1.92.42c.57.21 1.1.53 1.56.92.51.42.92.93 1.23 1.49.29.54.49 1.12.59 1.73.08.48.1.98.05 1.47a5.56 5.56 0 0 1-.36 1.63c-.19.55-.47 1.07-.81 1.54-.42.59-.92 1.12-1.49 1.57a3.02 3.02 0 0 1-.58.37c-.24.12-.51.13-.76.05-.23-.07-.44-.21-.57-.42l-1.93-3.15c-.14-.24-.36-.43-.63-.52-.28-.09-.58-.07-.84.06-.88.45-1.8.8-2.76 1.05-1.02.26-2.08.38-3.14.35-1.08-.03-2.15-.22-3.17-.55a12.28 12.28 0 0 1-2.9-1.32 1.1 1.1 0 0 0-1.48.33 1.14 1.14 0 0 0-.27 1.12c.07.31.25.57.51.74a14.28 14.28 0 0 0 3.39 1.56c1.17.38 2.4.6 3.64.65 1.23.05 2.46-.06 3.65-.32 1.14-.25 2.24-.65 3.28-1.18 1-.51 1.93-1.14 2.76-1.88.75-.68 1.41-1.44 1.96-2.28.53-.8.95-1.67 1.24-2.58a10.45 10.45 0 0 0 .52-3.23c.02-1.17-.13-2.34-.44-3.48z" />
          </svg>
          <span>Viber: +359 87 843 7966</span>
        </a>
      </div>
    </div>
  );
}
