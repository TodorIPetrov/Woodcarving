import Link from "next/link";
import { db } from "@/lib/firebase/admin";
import { getDictionary } from "@/dictionaries/getDictionary";

export default async function CataloguePage({ params }: { params: { lang: string } }) {
  const dict = await getDictionary(params.lang as any);
  
  let products: any[] = [];
  try {
    const snapshot = await db.collection("products").get();
    products = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching products from Firestore:", error);
    // Fallback if DB isn't ready
    products = [
      { id: "1", name: dict.product.fallback_name || "Orthodox Icon Relief - St. George", price: 250, description: dict.product.fallback_desc || "Hand-carved wooden relief.", image: "/images/st-george.jpg", isMadeToOrder: true },
      { id: "2", name: params.lang === 'bg' ? "Релеф Тайната Вечеря" : "Last Supper Relief", price: 550, description: params.lang === 'bg' ? "Спираща дъха дърворезба на Тайната Вечеря." : "Breathtaking carving of the Last Supper.", image: "/images/last-supper.jpg", isMadeToOrder: true },
      { id: "3", name: params.lang === 'bg' ? "Винтидж Флорален Плакет" : "Vintage Floral Plaque", price: 180, description: params.lang === 'bg' ? "Възстановен мотив от български таванни орнаменти." : "Reclaimed Bulgaria ceiling ornament pattern.", image: "/images/floral-plaque.jpg", isMadeToOrder: false }
    ];
  }

  return (
    <div className="flex flex-col items-center w-full">
      <section className="w-full max-w-7xl mx-auto px-4 py-12 md:py-20 relative z-20">
        <div className="text-center mb-16">
          <h1 className="font-serif text-4xl md:text-5xl text-custom-forest font-bold mb-4">{dict.catalogue.title}</h1>
          <p className="text-custom-charcoal/80 max-w-2xl mx-auto font-serif italic">
            {dict.catalogue.subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {products.map((product) => (
            <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 border border-gray-100 flex flex-col h-full group">
              <div className="relative h-64 bg-custom-parchment p-4 flex items-center justify-center border-b border-gray-50 overflow-hidden">
                 {/* Image Placeholder */}
                 <div className="w-full h-full border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs bg-custom-parchment group-hover:scale-105 transition-transform duration-700">Image: {product.name}</div>
                 
                 {product.isMadeToOrder && (
                   <div className="absolute top-4 left-4 bg-white/90 backdrop-blur text-amber-700 text-[10px] font-bold px-2 py-1 rounded shadow-sm border border-amber-100 uppercase tracking-wider">
                     {dict.catalogue.made_to_order}
                   </div>
                 )}
              </div>
              <div className="p-6 flex flex-col flex-grow">
                <h4 className="font-bold text-custom-charcoal text-base mb-2">{product.name}</h4>
                <p className="text-sm text-custom-muted mb-6 flex-grow line-clamp-2 leading-relaxed">{product.description}</p>
                
                <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-50">
                  <p className="text-custom-gold font-bold text-lg">{product.price.toFixed(2)} BGN</p>
                  <Link href={`/${params.lang}/products/${product.id}`} className="px-4 py-2 bg-custom-forest/10 hover:bg-custom-forest hover:text-white text-custom-forest text-xs font-bold tracking-wider uppercase transition-colors rounded">
                    {dict.catalogue.view}
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
