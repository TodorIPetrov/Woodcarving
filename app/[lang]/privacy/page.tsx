import { Metadata } from "next";
import { getDictionary } from "@/dictionaries/getDictionary";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://woodcarvingbg.eu';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang as any);
  return {
    title: dict.metadata.privacy_title,
    description: dict.metadata.privacy_description,
    alternates: {
      canonical: `${baseUrl}/${params.lang}/privacy`,
      languages: { 'bg': `${baseUrl}/bg/privacy`, 'en': `${baseUrl}/en/privacy` },
    },
  };
}

export default async function PrivacyPage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang as any);
  const isBg = params.lang === 'bg';

  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full max-w-4xl mx-auto px-4 py-12 md:py-20">
        <h1 className="font-serif text-4xl md:text-5xl text-custom-forest font-bold mb-4 text-center">{dict.privacy.title}</h1>
        <p className="text-center text-custom-muted mb-12">{dict.privacy.last_updated}: 11.09.2026</p>
        <div className="prose prose-lg max-w-none text-custom-charcoal/80 space-y-8">
          {isBg ? (
            <>
              <div>
                <h2 className="font-serif text-2xl text-custom-forest mb-4">1. Информация за сайта</h2>
                <p>Настоящата политика за поверителност се отнася за уебсайта <strong>woodcarvingbg.eu</strong>, представящ авторски дърворезби и произведения от семейното ателие в гр. Казанлък:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li><strong>Ателие:</strong> Казанлък Дърворезба</li>
                  <li><strong>Адрес:</strong> гр. Казанлък, ул. „Орешака“ 9</li>
                  <li><strong>Имейл:</strong> info@woodcarvingbg.eu</li>
                  <li><strong>Телефон:</strong> +359 87 843 7966</li>
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-custom-forest mb-4">2. Какви данни се обработват</h2>
                <h3 className="font-semibold text-lg mt-4 mb-2">а) Автоматично събирани данни (бисквитки)</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google Analytics:</strong> Анонимизирани статистически данни за посещенията (страници, време на престой, устройство). Използват се единствено за подобряване на представянето на сайта.</li>
                  <li><strong>Meta Pixel:</strong> Данни за взаимодействието със сайта за целите на маркетинга и представянето на творбите в социалните мрежи.</li>
                </ul>
                <h3 className="font-semibold text-lg mt-4 mb-2">б) Данни при директен контакт</h3>
                <p>Когато се свържете с ателието чрез Viber, Messenger или телефон, данните ви (име, телефон, съобщение) се използват единствено за отговор на вашето запитване или уточняване на поръчка по заявка.</p>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-custom-forest mb-4">3. Бисквитки</h2>
                <p>Сайтът използва бисквитки за анализ на трафика и правилно функциониране. Можете да управлявате съгласието си чрез банера в долната част на екрана или чрез настройките на вашия браузър.</p>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-custom-forest mb-4">4. Контакт</h2>
                <p>При въпроси относно поверителността можете да ни пишете на: <strong>info@woodcarvingbg.eu</strong></p>
              </div>
            </>
          ) : (
            <>
              <div>
                <h2 className="font-serif text-2xl text-custom-forest mb-4">1. Site Information</h2>
                <p>This privacy policy applies to the website <strong>woodcarvingbg.eu</strong>, showcasing handmade woodcarvings and artworks from the family workshop in Kazanlak, Bulgaria:</p>
                <ul className="list-disc pl-6 space-y-2 mt-3">
                  <li><strong>Workshop:</strong> Kazanlak Woodcarving</li>
                  <li><strong>Address:</strong> Oreshaka 9, 6100 Kazanlak, Bulgaria</li>
                  <li><strong>Email:</strong> info@woodcarvingbg.eu</li>
                  <li><strong>Phone:</strong> +359 87 843 7966</li>
                </ul>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-custom-forest mb-4">2. Data Processed</h2>
                <h3 className="font-semibold text-lg mt-4 mb-2">a) Automatically collected data (cookies)</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Google Analytics:</strong> Anonymized visit statistics (pages viewed, device type, duration). Used solely to improve the website.</li>
                  <li><strong>Meta Pixel:</strong> Interaction data used for social media presentation and outreach.</li>
                </ul>
                <h3 className="font-semibold text-lg mt-4 mb-2">b) Direct contact data</h3>
                <p>When you reach out via Viber, Messenger, or phone, your contact information is used strictly to answer your inquiry or coordinate custom commissions.</p>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-custom-forest mb-4">3. Cookies</h2>
                <p>This website uses cookies for traffic analysis and core functionality. You can manage your preferences using the on-screen banner or your browser settings.</p>
              </div>
              <div>
                <h2 className="font-serif text-2xl text-custom-forest mb-4">4. Contact</h2>
                <p>For any privacy-related inquiries, contact us at: <strong>info@woodcarvingbg.eu</strong></p>
              </div>
            </>
          )}
        </div>
      </section>
    </div>
  );
}
