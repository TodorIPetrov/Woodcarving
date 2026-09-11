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
      { id: "1", name: dict.product.fallback_name || "Православна Икона - Св. Георги", price: 250, description: dict.product.fallback_desc || "Прецизен релеф с ръчен финиш.", image: "/images/st-george.jpg" },
      { id: "2", name: params.lang === 'bg' ? "Релеф Тайната Вечеря" : "Last Supper Relief", price: 550, description: params.lang === 'bg' ? "Спираща дъха дърворезба на Тайната Вечеря." : "Breathtaking carving of the Last Supper.", image: "/images/last-supper.jpg" },
      { id: "3", name: params.lang === 'bg' ? "Винтидж Флорален Плакет" : "Vintage Floral Plaque", price: 180, description: params.lang === 'bg' ? "Възстановен мотив от български таванни орнаменти." : "Reclaimed Bulgaria ceiling ornament pattern.", image: "/images/floral-plaque.jpg" }
    ];
  }

  // Find sample images for categories from products if available
  const iconProduct = products.find(p => p.category === "Icons" || (p.name_bg || p.name || '').includes("Св.") || (p.name_bg || p.name || '').includes("Икона"));
  const reliefProduct = products.find(p => p.category === "Reliefs" || (p.name_bg || p.name || '').includes("Вечеря") || (p.name_bg || p.name || '').includes("Релеф"));
  const panelProduct = products.find(p => p.category === "Panels" || (p.name_bg || p.name || '').includes("Плакет") || (p.name_bg || p.name || '').includes("Розетка"));

  const iconImg = iconProduct?.images?.[0] || iconProduct?.image || "/images/st-george.jpg";
  const reliefImg = reliefProduct?.images?.[0] || reliefProduct?.image || "/images/last-supper.jpg";
  const panelImg = panelProduct?.images?.[0] || panelProduct?.image || "/images/floral-plaque.jpg";

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="w-full max-w-4xl mx-auto px-4 pt-16 pb-12 text-center">
        <h1 className="font-serif text-3xl md:text-5xl lg:text-6xl text-custom-forest font-bold mb-4 tracking-tight leading-tight" dangerouslySetInnerHTML={{ __html: dict.home.hero_title }} />
        <p className="text-base md:text-xl text-custom-charcoal/80 font-serif italic mb-8 max-w-2xl mx-auto leading-relaxed">
          {dict.home.hero_subtitle}
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href={`/${params.lang}/catalogue`} className="w-full sm:w-auto px-8 py-3.5 bg-custom-gold hover:bg-custom-gold/90 text-white font-bold text-xs md:text-sm tracking-widest uppercase transition-colors rounded shadow-sm">
            {dict.home.shop_now}
          </Link>
          <Link href={`/${params.lang}/contact`} className="w-full sm:w-auto px-8 py-3.5 border-2 border-custom-forest text-custom-forest hover:bg-custom-forest hover:text-white font-bold text-xs md:text-sm tracking-widest uppercase transition-colors rounded">
            {dict.home.custom_orders}
          </Link>
        </div>
      </section>

      {/* Trust Badges Banner */}
      <section className="w-full max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 bg-white/80 backdrop-blur-sm border border-gray-100 rounded-2xl p-6 md:p-8 shadow-sm">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl flex-shrink-0">
              🌳
            </div>
            <div>
              <h3 className="font-bold text-custom-charcoal text-sm mb-1">{dict.trust.wood_title}</h3>
              <p className="text-xs text-custom-muted leading-relaxed">{dict.trust.wood_desc}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl flex-shrink-0">
              ⚙️
            </div>
            <div>
              <h3 className="font-bold text-custom-charcoal text-sm mb-1">{dict.trust.craft_title}</h3>
              <p className="text-xs text-custom-muted leading-relaxed">{dict.trust.craft_desc}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl flex-shrink-0">
              ✨
            </div>
            <div>
              <h3 className="font-bold text-custom-charcoal text-sm mb-1">{dict.trust.finish_title}</h3>
              <p className="text-xs text-custom-muted leading-relaxed">{dict.trust.finish_desc}</p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-2xl flex-shrink-0">
              📦
            </div>
            <div>
              <h3 className="font-bold text-custom-charcoal text-sm mb-1">{dict.trust.delivery_title}</h3>
              <p className="text-xs text-custom-muted leading-relaxed">{dict.trust.delivery_desc}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Masterpieces Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-8 relative z-20">
        <div className="bg-transparent md:bg-white md:shadow-sm p-4 md:p-12 md:rounded-xl">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-custom-forest font-bold mb-3">{dict.home.featured_masterpieces}</h2>
            <div className="w-16 h-0.5 bg-custom-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((p) => {
              const productName = p[`name_${params.lang}`] || p.name || '';
              const productDesc = p[`description_${params.lang}`] || p.description || '';
              const imageSrc = (p.images && p.images.length > 0) ? p.images[0] : p.image;
              
              return (
              <Link href={`/${params.lang}/products/${p.id}`} key={p.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer group hover:-translate-y-1">
                <div className="relative h-56 bg-custom-parchment p-4 flex items-center justify-center border-b border-gray-50 overflow-hidden">
                   {imageSrc ? (
                     <Image src={imageSrc} alt={productName} fill className="object-cover group-hover:scale-105 transition-transform duration-700" sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 25vw" />
                   ) : (
                     <div className="w-full h-full border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs text-center p-2">Липсва снимка:<br/>{productName}</div>
                   )}
                   {p.isMadeToOrder ? (
                     <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm text-amber-800 text-[10px] font-bold rounded-full shadow-sm border border-amber-200">
                       {dict.catalogue.made_to_order}
                     </span>
                   ) : (
                     <span className="absolute top-3 right-3 px-2.5 py-1 bg-emerald-50 text-emerald-800 text-[10px] font-bold rounded-full shadow-sm border border-emerald-200">
                       {dict.catalogue.in_stock}
                     </span>
                   )}
                </div>
                <div className="p-6 flex flex-col flex-grow text-center">
                  <h3 className="font-bold text-custom-charcoal text-sm mb-2 group-hover:text-custom-gold transition-colors">{productName}</h3>
                  <p className="text-xs text-custom-muted mb-4 flex-grow line-clamp-2">{productDesc}</p>
                  <p className="text-custom-gold font-bold text-lg mb-4">€{p.price}</p>
                  <div className="block w-full py-2.5 bg-custom-forest group-hover:bg-custom-forest/90 text-white text-xs font-bold tracking-wider uppercase transition-colors rounded">
                    {dict.home.view_details}
                  </div>
                </div>
              </Link>
            )})}
          </div>

          <div className="mt-10 text-center">
            <Link href={`/${params.lang}/catalogue`} className="inline-flex items-center gap-2 text-custom-forest hover:text-custom-gold font-bold text-sm uppercase tracking-wider transition-colors">
              <span>{dict.catalogue.title}</span>
              <span>&rarr;</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Cards Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-12">
        <div className="text-center mb-10">
          <h2 className="font-serif text-3xl md:text-4xl text-custom-forest font-bold mb-3">{dict.home.categories_title}</h2>
          <p className="text-sm md:text-base text-custom-charcoal/70 max-w-2xl mx-auto font-serif italic">
            {dict.home.categories_subtitle}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Icons Card */}
          <Link href={`/${params.lang}/catalogue?category=Icons`} className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col h-full hover:border-custom-gold/40">
            <div className="w-12 h-12 rounded-xl bg-custom-parchment flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🕊️
            </div>
            <h3 className="font-serif text-xl font-bold text-custom-forest mb-2 group-hover:text-custom-gold transition-colors">
              {dict.home.cat_icons}
            </h3>
            <p className="text-xs text-custom-muted leading-relaxed flex-grow mb-4">
              {dict.home.cat_icons_desc}
            </p>
            <span className="text-xs font-bold text-custom-forest group-hover:text-custom-gold uppercase tracking-wider inline-flex items-center gap-1">
              {dict.catalogue.view} &rarr;
            </span>
          </Link>

          {/* Reliefs Card */}
          <Link href={`/${params.lang}/catalogue?category=Reliefs`} className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col h-full hover:border-custom-gold/40">
            <div className="w-12 h-12 rounded-xl bg-custom-parchment flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              🖼️
            </div>
            <h3 className="font-serif text-xl font-bold text-custom-forest mb-2 group-hover:text-custom-gold transition-colors">
              {dict.home.cat_reliefs}
            </h3>
            <p className="text-xs text-custom-muted leading-relaxed flex-grow mb-4">
              {dict.home.cat_reliefs_desc}
            </p>
            <span className="text-xs font-bold text-custom-forest group-hover:text-custom-gold uppercase tracking-wider inline-flex items-center gap-1">
              {dict.catalogue.view} &rarr;
            </span>
          </Link>

          {/* Panels Card */}
          <Link href={`/${params.lang}/catalogue?category=Panels`} className="group bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-all p-6 flex flex-col h-full hover:border-custom-gold/40">
            <div className="w-12 h-12 rounded-xl bg-custom-parchment flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              ⚜️
            </div>
            <h3 className="font-serif text-xl font-bold text-custom-forest mb-2 group-hover:text-custom-gold transition-colors">
              {dict.home.cat_panels}
            </h3>
            <p className="text-xs text-custom-muted leading-relaxed flex-grow mb-4">
              {dict.home.cat_panels_desc}
            </p>
            <span className="text-xs font-bold text-custom-forest group-hover:text-custom-gold uppercase tracking-wider inline-flex items-center gap-1">
              {dict.catalogue.view} &rarr;
            </span>
          </Link>

          {/* Custom Commissions Card */}
          <Link href={`/${params.lang}/contact`} className="group bg-gradient-to-br from-custom-forest to-[#1b3d2b] text-white rounded-xl overflow-hidden shadow-sm hover:shadow-md transition-all p-6 flex flex-col h-full">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-2xl mb-4 group-hover:scale-110 transition-transform">
              ✏️
            </div>
            <h3 className="font-serif text-xl font-bold text-white mb-2 group-hover:text-custom-gold transition-colors">
              {dict.home.cat_custom}
            </h3>
            <p className="text-xs text-white/80 leading-relaxed flex-grow mb-4">
              {dict.home.cat_custom_desc}
            </p>
            <span className="text-xs font-bold text-custom-gold uppercase tracking-wider inline-flex items-center gap-1">
              {dict.home.custom_orders} &rarr;
            </span>
          </Link>
        </div>
      </section>

      {/* Customer Testimonials (Social Proof) */}
      <section className="w-full max-w-7xl mx-auto px-4 py-12 mb-8">
        <div className="bg-custom-cream/60 rounded-2xl border border-gray-100 p-8 md:p-14">
          <div className="text-center mb-10">
            <h2 className="font-serif text-3xl md:text-4xl text-custom-forest font-bold mb-3">{dict.home.testimonials_title}</h2>
            <p className="text-sm md:text-base text-custom-charcoal/70 max-w-2xl mx-auto font-serif italic">
              {dict.home.testimonials_subtitle}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex text-amber-400 text-sm mb-3">★★★★★</div>
              <p className="text-xs md:text-sm text-custom-charcoal/85 leading-relaxed flex-grow italic mb-4">
                &ldquo;{dict.home.test_1_quote}&rdquo;
              </p>
              <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-custom-forest/10 text-custom-forest font-bold text-xs flex items-center justify-center">
                  Д
                </div>
                <span className="text-xs font-bold text-custom-forest">{dict.home.test_1_author}</span>
              </div>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex text-amber-400 text-sm mb-3">★★★★★</div>
              <p className="text-xs md:text-sm text-custom-charcoal/85 leading-relaxed flex-grow italic mb-4">
                &ldquo;{dict.home.test_2_quote}&rdquo;
              </p>
              <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-custom-forest/10 text-custom-forest font-bold text-xs flex items-center justify-center">
                  Е
                </div>
                <span className="text-xs font-bold text-custom-forest">{dict.home.test_2_author}</span>
              </div>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col">
              <div className="flex text-amber-400 text-sm mb-3">★★★★★</div>
              <p className="text-xs md:text-sm text-custom-charcoal/85 leading-relaxed flex-grow italic mb-4">
                &ldquo;{dict.home.test_3_quote}&rdquo;
              </p>
              <div className="pt-3 border-t border-gray-100 flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-custom-forest/10 text-custom-forest font-bold text-xs flex items-center justify-center">
                  К
                </div>
                <span className="text-xs font-bold text-custom-forest">{dict.home.test_3_author}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
