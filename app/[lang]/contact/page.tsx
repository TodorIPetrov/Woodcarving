import { Metadata } from "next";
import { getDictionary } from "@/dictionaries/getDictionary";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://woodcarvingbg.eu';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang as any);
  
  return {
    title: dict.metadata.contact_title,
    description: dict.metadata.contact_description,
    openGraph: {
      title: dict.metadata.contact_title,
      description: dict.metadata.contact_description,
      type: 'website',
      locale: params.lang === 'bg' ? 'bg_BG' : 'en_US',
    },
    alternates: {
      canonical: `${baseUrl}/${params.lang}/contact`,
      languages: {
        'bg': `${baseUrl}/bg/contact`,
        'en': `${baseUrl}/en/contact`,
      },
    },
  };
}

export default async function ContactPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang as any);

  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full max-w-7xl mx-auto px-4 py-12 md:py-20 relative z-20">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-custom-forest font-bold mb-4">{dict.contact.title}</h1>
          <p className="text-custom-charcoal/80 max-w-2xl mx-auto">
            {dict.contact.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-custom-cream rounded-xl shadow-xl shadow-custom-forest/5 p-8 md:p-12 border border-white/50">
          
          {/* Contact Info */}
          <div className="flex flex-col justify-center">
            <h3 className="font-serif text-2xl text-custom-forest mb-6">{dict.contact.workshop_details}</h3>
            
            <div className="space-y-6">
              <div className="flex items-start">
                <svg className="w-6 h-6 text-custom-gold mt-1 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                <div>
                  <h4 className="font-bold text-custom-charcoal text-sm uppercase tracking-wider mb-1">{dict.contact.address_label}</h4>
                  <p className="text-custom-muted" dangerouslySetInnerHTML={{ __html: dict.contact.address }} />
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 text-custom-gold mt-1 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                <div>
                  <h4 className="font-bold text-custom-charcoal text-sm uppercase tracking-wider mb-1">{dict.contact.phone_label}</h4>
                  <p className="text-custom-muted">+359 87 843 7966</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 text-custom-gold mt-1 mr-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                <div>
                  <h4 className="font-bold text-custom-charcoal text-sm uppercase tracking-wider mb-1">{dict.contact.email_label}</h4>
                  <p className="text-custom-muted">info@woodcarvingbg.eu</p>
                </div>
              </div>

              <div className="flex items-start">
                <svg className="w-6 h-6 text-custom-gold mt-1 mr-4" fill="currentColor" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <div>
                  <h4 className="font-bold text-custom-charcoal text-sm uppercase tracking-wider mb-1">Facebook</h4>
                  <a href="https://www.facebook.com/Woodcarving21" target="_blank" rel="noopener noreferrer" className="text-custom-forest hover:text-custom-gold font-medium transition-colors underline">
                    facebook.com/Woodcarving21
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white p-8 rounded-lg shadow-sm border border-gray-100">
            <h3 className="font-serif text-2xl text-custom-forest mb-6">{dict.contact.send_message_title}</h3>
            <form className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-custom-charcoal uppercase tracking-wider mb-2">{dict.contact.name_label}</label>
                <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-custom-gold focus:bg-white transition-colors" placeholder={dict.contact.name_placeholder} />
              </div>
              <div>
                <label className="block text-xs font-bold text-custom-charcoal uppercase tracking-wider mb-2">{dict.contact.email_label}</label>
                <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-custom-gold focus:bg-white transition-colors" placeholder={dict.contact.email_placeholder} />
              </div>
              <div>
                <label className="block text-xs font-bold text-custom-charcoal uppercase tracking-wider mb-2">{dict.contact.message_label}</label>
                <textarea rows={4} className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-custom-gold focus:bg-white transition-colors" placeholder={dict.contact.message_placeholder}></textarea>
              </div>
              <button type="button" className="w-full py-4 bg-custom-forest hover:bg-custom-forest/90 text-white font-bold tracking-widest uppercase text-sm rounded shadow-md transition-colors mt-4">
                {dict.contact.send_button}
              </button>
            </form>
          </div>

        </div>
      </section>
    </div>
  );
}
