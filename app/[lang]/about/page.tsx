import Image from "next/image";
import { Metadata } from "next";
import { getDictionary } from "@/dictionaries/getDictionary";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://woodcarvingbg.eu';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang as any);
  
  return {
    title: dict.metadata.about_title,
    description: dict.metadata.about_description,
    openGraph: {
      title: dict.metadata.about_title,
      description: dict.metadata.about_description,
      type: 'website',
      locale: params.lang === 'bg' ? 'bg_BG' : 'en_US',
    },
    alternates: {
      canonical: `${baseUrl}/${params.lang}/about`,
      languages: {
        'bg': `${baseUrl}/bg/about`,
        'en': `${baseUrl}/en/about`,
      },
    },
  };
}

export default async function AboutPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang as any);

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[40vh] md:h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1611077544837-7c49f82d2c18?q=80&w=2000')] bg-cover bg-center opacity-40 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-custom-parchment/80 to-custom-parchment/20"></div>
        
        <div className="relative z-10 max-w-4xl mt-12">
          <h2 className="font-serif text-4xl md:text-5xl text-custom-forest font-bold mb-4 drop-shadow-sm">
            {dict.about.title}
          </h2>
          <p className="text-xl text-custom-charcoal/80 font-serif italic">
            {dict.about.subtitle}
          </p>
        </div>
      </section>

      {/* Content Section */}
      <section className="w-full max-w-4xl mx-auto px-4 py-16 -mt-10 relative z-20">
        <div className="bg-custom-cream rounded-xl shadow-xl shadow-custom-forest/5 p-8 md:p-16 border border-white/50">
          
          <div className="prose prose-lg prose-amber mx-auto">
            <h3 className="font-serif text-3xl text-custom-forest mb-6 text-center">{dict.about.heading}</h3>
            <p className="text-custom-charcoal/80 leading-relaxed mb-6">
              {dict.about.p1}
            </p>
            <p className="text-custom-charcoal/80 leading-relaxed mb-6">
              {dict.about.p2}
            </p>
            <div className="my-12 border-l-4 border-custom-gold pl-6 py-2">
              <p className="text-xl font-serif text-custom-forest italic m-0">
                {dict.about.quote}
              </p>
            </div>
            <p className="text-custom-charcoal/80 leading-relaxed mb-6" dangerouslySetInnerHTML={{ __html: dict.about.p3 }} />
            <p className="text-custom-charcoal/80 leading-relaxed mb-10">
              {dict.about.p4}
            </p>

            {/* Process & Trust Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-8 border-t border-gray-200/70 text-xs">
              <div className="flex items-start gap-3 bg-white/80 p-4 rounded-lg border border-gray-100 shadow-sm">
                <span className="text-xl">🌳</span>
                <div>
                  <h4 className="font-bold text-custom-forest text-sm mb-0.5">{dict.trust?.wood_title || "Масивна Дървесина"}</h4>
                  <p className="text-custom-muted">{dict.trust?.wood_desc || "Селектиран орех, дъб и липа"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/80 p-4 rounded-lg border border-gray-100 shadow-sm">
                <span className="text-xl">⚙️</span>
                <div>
                  <h4 className="font-bold text-custom-forest text-sm mb-0.5">{dict.trust?.craft_title || "Прецизност и Занаят"}</h4>
                  <p className="text-custom-muted">{dict.trust?.craft_desc || "Прецизен релеф с майсторска ръчна дообработка"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/80 p-4 rounded-lg border border-gray-100 shadow-sm">
                <span className="text-xl">✨</span>
                <div>
                  <h4 className="font-bold text-custom-forest text-sm mb-0.5">{dict.trust?.finish_title || "Натурален Финиш"}</h4>
                  <p className="text-custom-muted">{dict.trust?.finish_desc || "Защита с естествени масла и пчелен восък"}</p>
                </div>
              </div>
              <div className="flex items-start gap-3 bg-white/80 p-4 rounded-lg border border-gray-100 shadow-sm">
                <span className="text-xl">📦</span>
                <div>
                  <h4 className="font-bold text-custom-forest text-sm mb-0.5">{dict.trust?.delivery_title || "Преглед при Доставка"}</h4>
                  <p className="text-custom-muted">{dict.trust?.delivery_desc || "Сигурна доставка с Еконт / Спиди с опция преглед"}</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
