"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

export default function CookieConsent({ dict, lang }: { dict: any; lang: string }) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookie-consent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookie-consent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  const t = dict || {
    message: "This site uses cookies for analytics and marketing. By continuing, you agree to our",
    privacy_link: "Privacy Policy",
    accept: "Accept",
    decline: "Decline",
  };

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[200] bg-white border-t border-gray-200 shadow-2xl p-4 md:p-6 animate-slide-in">
      <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center gap-4">
        <p className="text-sm text-custom-charcoal/80 flex-1">
          {t.message}{" "}
          <Link href={`/${lang}/privacy`} className="text-custom-forest underline font-semibold">
            {t.privacy_link}
          </Link>
          .
        </p>
        <div className="flex gap-3 flex-shrink-0">
          <button
            onClick={handleDecline}
            className="px-5 py-2 text-sm border border-gray-300 text-custom-charcoal/70 hover:bg-gray-50 rounded transition-colors"
          >
            {t.decline}
          </button>
          <button
            onClick={handleAccept}
            className="px-5 py-2 text-sm bg-custom-forest text-white hover:bg-custom-forest/90 rounded font-semibold transition-colors"
          >
            {t.accept}
          </button>
        </div>
      </div>
    </div>
  );
}
