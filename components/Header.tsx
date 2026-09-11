"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ dict, lang }: { dict: any; lang: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Quick keyboard shortcut for admin access: Alt + A or Ctrl + Shift + A
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.altKey && e.key.toLowerCase() === 'a') || (e.ctrlKey && e.shiftKey && e.key.toLowerCase() === 'a')) {
        e.preventDefault();
        window.location.href = `/${lang}/admin`;
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [lang]);

  return (
    <header className="bg-white sticky top-0 z-50 shadow-sm border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4">
        
        {/* Desktop Header */}
        <div className="hidden md:flex flex-col items-center pt-6 pb-4">
          <div className="w-full flex justify-between items-start mb-2">
            <LanguageSwitcher currentLang={lang} />
            <a href="tel:+359878437966" className="text-sm font-semibold text-custom-forest hover:text-custom-gold transition-colors flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              +359 87 843 7966
            </a>
          </div>
          
          <Link href={`/${lang}`} className="font-serif text-3xl text-custom-forest font-bold tracking-wider hover:opacity-80 transition-opacity mb-6">
            Kazanlak Woodcarving
          </Link>

          <nav className="flex justify-center space-x-12 text-sm font-semibold tracking-widest uppercase text-custom-charcoal/80">
            <Link href={`/${lang}`} className="hover:text-custom-gold transition-colors">{dict.nav.home}</Link>
            <Link href={`/${lang}/catalogue`} className="hover:text-custom-gold transition-colors">{dict.nav.catalogue}</Link>
            <Link href={`/${lang}/about`} className="hover:text-custom-gold transition-colors">{dict.nav.about}</Link>
            <Link href={`/${lang}/contact`} className="hover:text-custom-gold transition-colors">{dict.nav.contact}</Link>
          </nav>
        </div>

        {/* Mobile Header */}
        <div className="md:hidden flex justify-between items-center py-4">
          <Link href={`/${lang}`} className="font-serif text-xl text-custom-forest font-bold tracking-wide">
            Woodcarving
          </Link>

          <div className="flex items-center gap-4">
            <LanguageSwitcher currentLang={lang} />
            <button 
              className="text-custom-charcoal hover:text-custom-gold transition-colors focus:outline-none"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-white border-b border-gray-100 shadow-lg py-6 px-6 flex flex-col space-y-6 text-center z-40 animate-slide-in">
          <Link href={`/${lang}`} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif text-custom-charcoal hover:text-custom-gold transition-colors">{dict.nav.home}</Link>
          <Link href={`/${lang}/catalogue`} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif text-custom-charcoal hover:text-custom-gold transition-colors">{dict.nav.catalogue}</Link>
          <Link href={`/${lang}/about`} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif text-custom-charcoal hover:text-custom-gold transition-colors">{dict.nav.about}</Link>
          <Link href={`/${lang}/contact`} onClick={() => setIsMobileMenuOpen(false)} className="text-xl font-serif text-custom-charcoal hover:text-custom-gold transition-colors">{dict.nav.contact}</Link>
          
          <div className="pt-6 border-t border-gray-100">
            <a href="tel:+359878437966" className="flex items-center justify-center gap-2 text-custom-forest font-bold text-lg">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              +359 87 843 7966
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
