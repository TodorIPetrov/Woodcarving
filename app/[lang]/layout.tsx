import type { Metadata } from "next";
import "../globals.css";

export const metadata: Metadata = {
  title: "Kazanlak Woodcarving | Artisanal Woodcrafts",
  description: "Premium handmade woodcarvings, personalized plaques, and Orthodox iconography from Kazanlak, Bulgaria.",
};

import { Inter, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { getDictionary } from "@/dictionaries/getDictionary";
import LanguageSwitcher from "@/components/LanguageSwitcher";

const inter = Inter({ subsets: ["latin"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin"], variable: '--font-playfair' });

export default async function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { lang: string };
}>) {
  const dict = await getDictionary(params.lang as any);

  return (
    <html lang={params.lang} className={`${inter.variable} ${playfair.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Kazanlak Woodcarving",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "Artisan Street 1",
                "addressLocality": "Kazanlak",
                "addressRegion": "Stara Zagora",
                "postalCode": "6100",
                "addressCountry": "BG"
              },
              "priceRange": "$$"
            })
          }}
        />
      </head>
      <body className="font-sans bg-custom-parchment text-custom-charcoal flex flex-col min-h-screen">
        <CartProvider>
          <header className="py-4 border-b border-gray-200 bg-custom-cream sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center">
              {/* Left/Mobile Nav placeholder */}
              <div className="hidden md:flex flex-1 items-center gap-2">
                <LanguageSwitcher currentLang={params.lang} />
              </div>
              
              {/* Centered Navigation */}
              <nav className="flex-1 flex justify-center space-x-6 md:space-x-8 text-sm font-semibold tracking-wide uppercase mt-4 md:mt-0 order-3 md:order-2">
                <Link href={`/${params.lang}`} className="hover:text-custom-gold transition-colors pb-1">{dict.nav.home}</Link>
                <Link href={`/${params.lang}/catalogue`} className="hover:text-custom-gold transition-colors pb-1">{dict.nav.catalogue}</Link>
                <Link href={`/${params.lang}/about`} className="hover:text-custom-gold transition-colors pb-1">{dict.nav.about}</Link>
                <Link href={`/${params.lang}/contact`} className="hover:text-custom-gold transition-colors pb-1">{dict.nav.contact}</Link>
              </nav>

              {/* Right Icons */}
              <div className="flex-1 flex justify-end space-x-4 items-center order-2 md:order-3">
                <a href="#" className="hover:text-custom-gold transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                </a>
                <a href="#" className="hover:text-custom-gold transition-colors relative">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                  {/* We can add a cart badge here later */}
                </a>
              </div>
            </div>
          </header>
          
          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-custom-forest text-custom-cream py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
              <div>
                <h4 className="font-serif text-lg text-custom-gold mb-4">Contact Info</h4>
                <p>+359 87 843 7966</p>
                <p>Oreshaka 9, Kazanlak</p>
              </div>
              <div className="text-center">
                <div className="bg-white/10 h-24 w-48 mx-auto flex items-center justify-center rounded-lg border border-white/20 mb-4">
                  {/* Map Placeholder */}
                  <span className="text-white/50 text-xs">Google Map</span>
                </div>
              </div>
              <div className="text-right">
                <h4 className="font-serif text-lg text-custom-gold mb-4">Secure Payment</h4>
                <p className="text-custom-muted text-xs">Visa, Mastercard, Maestro, Stripe</p>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-xs text-custom-sage flex justify-between">
              <p>&copy; {new Date().getFullYear()} Kazanlak Woodcarving. {dict.footer.rights}</p>
              <div className="flex space-x-2">
                <span>F</span> <span>I</span> <span>T</span>
              </div>
            </div>
          </footer>
          <CartDrawer dict={dict.cart} lang={params.lang} />
        </CartProvider>
      </body>
    </html>
  );
}
