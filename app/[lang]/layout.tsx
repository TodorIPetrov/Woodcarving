import type { Metadata } from "next";
import "../globals.css";

import { Inter, Playfair_Display } from "next/font/google";
import Link from "next/link";
import { getDictionary } from "@/dictionaries/getDictionary";
import Header from "@/components/Header";
import GoogleAnalytics from "@/components/GoogleAnalytics";
import MetaPixel from "@/components/MetaPixel";
import CookieConsent from "@/components/CookieConsent";

const inter = Inter({ subsets: ["latin", "cyrillic"], variable: '--font-inter' });
const playfair = Playfair_Display({ subsets: ["latin", "cyrillic"], variable: '--font-playfair' });

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://woodcarvingbg.eu';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang as any);

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
        <Header dict={dict} lang={params.lang} />
        
        <main className="flex-grow">
          {children}
        </main>

        <footer className="bg-custom-forest text-custom-cream py-12 mt-20">
          <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 text-sm">
            {/* Contact Info */}
            <div>
              <h4 className="font-serif text-lg text-custom-gold mb-4">{dict.footer.contact_info}</h4>
              <p className="font-semibold mb-1">Казанлък Дърворезба</p>
              <p>ул. Орешака 9, гр. Казанлък</p>
              <p className="mt-2">+359 87 843 7966</p>
              <p>info@woodcarvingbg.eu</p>
              <div className="mt-4">
                <Link href={`/${params.lang}/privacy`} className="text-xs text-custom-sage hover:text-custom-gold transition-colors underline">
                  {dict.footer.privacy}
                </Link>
              </div>
            </div>

            {/* Google Maps Link */}
            <div className="text-center md:text-right flex flex-col items-center md:items-end justify-center">
              <a 
                href="https://maps.google.com/?q=Oreshaka+9,+Kazanlak,+Bulgaria" 
                target="_blank" 
                rel="noopener noreferrer"
                className="bg-white/10 hover:bg-white/20 transition-colors h-20 w-44 flex flex-col items-center justify-center rounded-lg border border-white/20 cursor-pointer"
              >
                <svg className="w-5 h-5 mb-1 text-custom-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <span className="text-white/80 font-semibold text-xs">Google Maps</span>
              </a>
            </div>
          </div>
          <div className="max-w-7xl mx-auto px-4 mt-8 pt-8 border-t border-white/10 text-center text-xs text-custom-sage flex justify-between items-center">
            <p>&copy; {new Date().getFullYear()} Kazanlak Woodcarving. {dict.footer.rights}</p>
            <div className="flex space-x-3 items-center">
              <a 
                href="https://www.facebook.com/Woodcarving21" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/10 hover:bg-[#1877F2] text-white transition-all duration-300 group text-xs font-semibold shadow-sm border border-white/10 hover:border-[#1877F2]"
                aria-label="Facebook страница Woodcarving21"
              >
                <svg className="w-4 h-4 fill-current transition-transform group-hover:scale-110" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                <span>Facebook</span>
              </a>
              <span className="text-white/20">·</span>
              <Link 
                href={`/${params.lang}/admin`} 
                title="Вход за управление" 
                className="text-white/20 hover:text-custom-gold transition-colors p-1"
                aria-label="Вход за управление"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </Link>
            </div>
          </div>
        </footer>

        <CookieConsent dict={dict.cookie} lang={params.lang} />
      </body>
    </html>
  );
}
