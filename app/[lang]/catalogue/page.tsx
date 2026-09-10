import { Metadata } from "next";
import { db } from "@/lib/firebase/admin";
import { getDictionary } from "@/dictionaries/getDictionary";
import CatalogueClient from "@/components/CatalogueClient";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://woodcarvingbg.eu';

export async function generateMetadata({ params }: { params: { lang: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang as any);
  
  return {
    title: dict.metadata.catalogue_title,
    description: dict.metadata.catalogue_description,
    openGraph: {
      title: dict.metadata.catalogue_title,
      description: dict.metadata.catalogue_description,
      type: 'website',
      locale: params.lang === 'bg' ? 'bg_BG' : 'en_US',
    },
    alternates: {
      canonical: `${baseUrl}/${params.lang}/catalogue`,
      languages: {
        'bg': `${baseUrl}/bg/catalogue`,
        'en': `${baseUrl}/en/catalogue`,
      },
    },
  };
}

export default async function CataloguePage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang as any);
  
  let products: any[] = [];
  try {
    const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();
    products = snapshot.docs.map((doc) => {
      const data = doc.data();
      return {
        id: doc.id,
        name: data[`name_${params.lang}`] || data.name || '',
        description: data[`description_${params.lang}`] || data.description || '',
        price: data.price || 0,
        image: data.image,
        images: data.images,
        category: data.category,
        isMadeToOrder: data.isMadeToOrder || false,
      };
    });
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    // Fallback if DB isn't ready
    products = [
      { id: "1", name: dict.product.fallback_name || "Orthodox Icon Relief - St. George", price: 250, description: dict.product.fallback_desc || "Hand-carved wooden relief.", image: "/images/st-george.jpg", isMadeToOrder: true, category: "Icons" },
      { id: "2", name: params.lang === 'bg' ? "Релеф Тайната Вечеря" : "Last Supper Relief", price: 550, description: params.lang === 'bg' ? "Спираща дъха дърворезба на Тайната Вечеря." : "Breathtaking carving of the Last Supper.", image: "/images/last-supper.jpg", isMadeToOrder: true, category: "Reliefs" },
      { id: "3", name: params.lang === 'bg' ? "Винтидж Флорален Плакет" : "Vintage Floral Plaque", price: 180, description: params.lang === 'bg' ? "Възстановен мотив от български таванни орнаменти." : "Reclaimed Bulgaria ceiling ornament pattern.", image: "/images/floral-plaque.jpg", isMadeToOrder: false, category: "Panels" }
    ];
  }

  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full max-w-7xl mx-auto px-4 py-12 md:py-20 relative z-20">
        <div className="text-center mb-12">
          <h1 className="font-serif text-4xl md:text-5xl text-custom-forest font-bold mb-4">{dict.catalogue.title}</h1>
          <p className="text-custom-charcoal/80 max-w-2xl mx-auto font-serif italic">
            {dict.catalogue.subtitle}
          </p>
        </div>

        <CatalogueClient 
          products={products} 
          dict={dict.catalogue} 
          lang={params.lang} 
        />
      </section>
    </div>
  );
}
