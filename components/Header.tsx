"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageSwitcher from "./LanguageSwitcher";

export default function Header({ dict, lang }: { dict: any; lang: string }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="py-4 border-b border-gray-200 bg-custom-cream sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 flex justify-between items-center relative">
        
        {/* Left: Language Switcher (Desktop) */}
        <div className="hidden md:flex flex-1 items-center gap-2">
          <LanguageSwitcher currentLang={lang} />
        </div>

        {/* Center: Navigation (Desktop) */}
        <nav className="hidden md:flex flex-1 justify-center space-x-8 text-sm font-semibold tracking-wide uppercase">
          <Link href={`/${lang}`} className="hover:text-custom-gold transition-colors pb-1">{dict.nav.home}</Link>
          <Link href={`/${lang}/catalogue`} className="hover:text-custom-gold transition-colors pb-1">{dict.nav.catalogue}</Link>
          <Link href={`/${lang}/about`} className="hover:text-custom-gold transition-colors pb-1">{dict.nav.about}</Link>
          <Link href={`/${lang}/contact`} className="hover:text-custom-gold transition-colors pb-1">{dict.nav.contact}</Link>
        </nav>

        {/* Right: Phone Icon (Desktop) */}
        <div className="hidden md:flex flex-1 justify-end items-center gap-4">
          <a href="tel:+359878437966" className="text-sm font-bold text-custom-forest hover:text-custom-gold transition-colors flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
            +359 87 843 7966
          </a>
        </div>

        {/* Mobile: Logo placeholder / Title */}
        <div className="md:hidden flex-1 font-serif text-lg text-custom-forest font-bold">
          Kazanlak Woodcarving
        </div>

        {/* Mobile: Hamburger Button */}
        <div className="md:hidden flex items-center gap-4">
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-custom-cream border-b border-gray-200 shadow-lg py-4 px-6 flex flex-col space-y-4 text-center z-40 animate-slide-in">
          <Link href={`/${lang}`} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold hover:text-custom-gold transition-colors">{dict.nav.home}</Link>
          <Link href={`/${lang}/catalogue`} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold hover:text-custom-gold transition-colors">{dict.nav.catalogue}</Link>
          <Link href={`/${lang}/about`} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold hover:text-custom-gold transition-colors">{dict.nav.about}</Link>
          <Link href={`/${lang}/contact`} onClick={() => setIsMobileMenuOpen(false)} className="text-lg font-bold hover:text-custom-gold transition-colors">{dict.nav.contact}</Link>
          
          <div className="pt-4 border-t border-gray-200 mt-2">
            <a href="tel:+359878437966" className="flex items-center justify-center gap-2 text-custom-forest font-bold">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
              +359 87 843 7966
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
