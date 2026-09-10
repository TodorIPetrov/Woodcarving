import type { Metadata } from "next";
import "../globals.css";

import { Inter, Playfair_Display } from "next/font/google";
import { CartProvider } from "@/components/CartContext";
import CartDrawer from "@/components/CartDrawer";
import Link from "next/link";
import { getDictionary } from "@/dictionaries/getDictionary";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import Header from "@/components/Header";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], variable: '--font-playfair' });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://woodcarvingbg.eu';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang as any);
  const otherLang = params.lang === 'bg' ? 'en' : 'bg';

  return {
    metadataBase: new URL(baseUrl),
    title: dict.metadata.site_title,
    description: dict.metadata.site_description,
    keywords: params.lang === 'bg' 
      ? 'дърворезба, ръчна изработка, Казанлък, православни икони, дървени релефи, български занаят'
      : 'woodcarving, handmade, Kazanlak, orthodox icons, wood relief, Bulgarian craft, artisan',
    openGraph: {
      type: 'website',
      locale: params.lang === 'bg' ? 'bg_BG' : 'en_US',
      url: `${baseUrl}/${params.lang}`,
      siteName: 'Kazanlak Woodcarving',
      title: dict.metadata.site_title,
      description: dict.metadata.site_description,
    },
    twitter: {
      card: 'summary_large_image',
      title: dict.metadata.site_title,
      description: dict.metadata.site_description,
    },
    alternates: {
      canonical: `${baseUrl}/${params.lang}`,
      languages: {
        'bg': `${baseUrl}/bg`,
        'en': `${baseUrl}/en`,
      },
    },
  };
}

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
        <GoogleAnalytics />
        <MetaPixel />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "LocalBusiness",
              "name": "Kazanlak Woodcarving",
              "url": baseUrl,
              "telephone": "+359878437966",
              "email": "info@woodcarvingbg.eu",
              "address": {
                "@type": "PostalAddress",
                "streetAddress": "ул. Орешака 9",
                "addressLocality": "Казанлък",
                "addressRegion": "Стара Загора",
                "postalCode": "6100",
                "addressCountry": "BG"
              },
              "geo": {
                "@type": "GeoCoordinates",
                "latitude": "42.6198",
                "longitude": "25.3995"
              },
              "priceRange": "$$",
              "sameAs": [
                "https://www.facebook.com/Woodcarving21"
              ]
            })
          }}
        />
      </head>
      <body className="font-sans bg-custom-parchment text-custom-charcoal flex flex-col min-h-screen">
        <CartProvider>
          <Header dict={dict} lang={params.lang} />
          <CartDrawer dict={dict.cart} lang={params.lang} />
          
          <main className="flex-grow">
            {children}
          </main>

          <footer className="bg-custom-forest text-custom-cream py-12 mt-20">
            <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
              <div>
                <h4 className="font-serif text-lg text-custom-gold mb-4">{dict.footer.contact_info}</h4>
                <p>+359 87 843 7966</p>
                <p>Oreshaka 9, Kazanlak</p>
              </div>
              <div className="text-center md:text-right">
                <a 
                  href="https://maps.google.com/?q=Oreshaka+9,+Kazanlak,+Bulgaria" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-white/10 hover:bg-white/20 transition-colors h-24 w-48 mx-auto md:ml-auto md:mr-0 flex flex-col items-center justify-center rounded-lg border border-white/20 mb-4 cursor-pointer"
                >
                  <svg className="w-6 h-6 mb-2 text-custom-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  <span className="text-white/80 font-semibold text-sm">Google Maps</span>
                </a>
              </div>
            </div>
            <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-xs text-custom-sage flex justify-between">
              <p>&copy; {new Date().getFullYear()} Kazanlak Woodcarving. {dict.footer.rights}</p>
              <div className="flex space-x-2">
                <a href="https://www.facebook.com/Woodcarving21" target="_blank" rel="noopener noreferrer" className="hover:text-custom-gold transition-colors">F</a>
                <span>I</span>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
