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

import Header from "@/components/Header";

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
        <Header dict={dict} lang={params.lang} />
        
        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-custom-forest text-custom-cream py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
            <div>
              <h4 className="font-serif text-lg text-custom-gold mb-4">{dict.footer.contact_info}</h4>
              <p>+359 87 843 7966</p>
              <p>Oreshaka 9, Kazanlak</p>
            </div>
            <div className="text-center">
              <div className="bg-white/10 h-24 w-48 mx-auto flex items-center justify-center rounded-lg border border-white/20 mb-4">
                {/* Map Placeholder */}
                <span className="text-white/50 text-xs">{dict.footer.map_placeholder || "Google Map"}</span>
              </div>
            </div>
            <div className="text-right">
              <h4 className="font-serif text-lg text-custom-gold mb-4">{dict.footer.secure_payment}</h4>
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
      </body>
    </html>
  );
}
