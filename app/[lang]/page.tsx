import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/firebase/admin";
import { getDictionary } from "@/dictionaries/getDictionary";

export default async function Home({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang as any);
  
  let products: any[] = [];
  try {
    const snapshot = await db.collection("products").orderBy("createdAt", "desc").get();
    products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    // Fallback if DB isn't ready
    products = [
      { id: "1", name: dict.product.fallback_name || "Orthodox Icon Relief - St. George", price: 250, description: dict.product.fallback_desc || "Hand-carved wooden relief.", image: "/images/st-george.jpg" },
      { id: "2", name: params.lang === 'bg' ? "Релеф Тайната Вечеря" : "Last Supper Relief", price: 550, description: params.lang === 'bg' ? "Спираща дъха дърворезба на Тайната Вечеря." : "Breathtaking carving of the Last Supper.", image: "/images/last-supper.jpg" },
      { id: "3", name: params.lang === 'bg' ? "Винтидж Флорален Плакет" : "Vintage Floral Plaque", price: 180, description: params.lang === 'bg' ? "Възстановен мотив от български таванни орнаменти." : "Reclaimed Bulgaria ceiling ornament pattern.", image: "/images/floral-plaque.jpg" }
    ];
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Minimalist Greeting */}
      <section className="w-full max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
        <h2 className="font-serif text-3xl md:text-5xl text-custom-forest font-bold mb-4" dangerouslySetInnerHTML={{ __html: dict.home.hero_title }} />
        <p className="text-lg text-custom-charcoal/70 font-serif italic mb-8 max-w-2xl mx-auto">
          {dict.home.hero_subtitle}
        </p>
        <Link href={`/${params.lang}/catalogue`} className="inline-block px-8 py-3 bg-custom-gold hover:bg-custom-gold/80 text-white font-bold text-sm tracking-widest uppercase transition-colors rounded shadow-sm">
          {dict.home.shop_now}
        </Link>
      </section>

      {/* Featured Masterpieces Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-8 relative z-20">
        <div className="bg-transparent md:bg-white md:shadow-sm p-4 md:p-12 md:rounded-xl">
          <div className="text-center mb-12">
            <h3 className="font-serif text-3xl text-custom-forest">{dict.home.featured_masterpieces}</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => {
              const productName = p[`name_${params.lang}`] || p.name || '';
              const productDesc = p[`description_${params.lang}`] || p.description || '';
              const imageSrc = (p.images && p.images.length > 0) ? p.images[0] : p.image;
              
              return (
              <Link href={`/${params.lang}/products/${p.id}`} key={p.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full cursor-pointer group">
                <div className="relative h-48 bg-custom-parchment p-4 flex items-center justify-center border-b border-gray-50 overflow-hidden">
                   {imageSrc ? (
                     <Image src={imageSrc} alt={productName} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                   ) : (
                     <div className="w-full h-full border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs text-center p-2">Липсва снимка:<br/>{productName}</div>
                   )}
                </div>
                <div className="p-6 flex flex-col flex-grow text-center">
                  <h4 className="font-bold text-custom-charcoal text-sm mb-2 group-hover:text-custom-gold transition-colors">{productName}</h4>
                  <p className="text-xs text-custom-muted mb-4 flex-grow line-clamp-3">{productDesc}</p>
                  <p className="text-custom-gold font-bold mb-4">{p.price} BGN</p>
                  <div className="block w-full py-2 bg-custom-forest hover:bg-custom-forest/90 text-white text-xs font-bold tracking-wider uppercase transition-colors rounded">
                    {dict.home.view_details}
                  </div>
                </div>
              </Link>
            )})}
          </div>
        </div>
      </section>
    </div>
  );
}
