import Link from "next/link";
import { db } from "@/lib/firebase/admin";

export default async function Home() {
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
      { id: "1", name: "Orthodox Icon Relief - St. George", price: 250, description: "Hand-carved wooden relief.", image: "/images/st-george.jpg" },
      { id: "2", name: "Last Supper Relief", price: 550, description: "Breathtaking carving of the Last Supper.", image: "/images/last-supper.jpg" },
      { id: "3", name: "Vintage Floral Plaque", price: 180, description: "Reclaimed Bulgaria ceiling ornament pattern.", image: "/images/floral-plaque.jpg" }
    ];
  }

  return (
    <div className="flex flex-col items-center w-full">
      {/* Hero Section */}
      <section className="relative w-full h-[60vh] md:h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1599839619722-39751411ea63?q=80&w=2000')] bg-cover bg-center opacity-30 mix-blend-multiply"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-custom-parchment/60 to-custom-parchment/10"></div>
        
        <div className="relative z-10 max-w-4xl">
          <h2 className="font-serif text-4xl md:text-6xl text-custom-forest font-bold mb-4 drop-shadow-sm">
            BULGARIAN MASTER<br/>WOOD CARVINGS.
          </h2>
          <p className="text-xl md:text-2xl text-custom-charcoal/80 font-serif italic mb-8">
            Traditional Craft from Kazanlak.
          </p>
          <Link href="/products/1" className="inline-block px-8 py-3 bg-custom-gold hover:bg-custom-gold/80 text-white font-bold text-sm tracking-widest uppercase transition-colors rounded-sm shadow-md">
            Explore Our Collection
          </Link>
        </div>
      </section>

      {/* Featured Masterpieces Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-16 -mt-20 relative z-20">
        <div className="bg-custom-cream rounded-xl shadow-xl shadow-custom-forest/5 p-8 md:p-12 border border-white/50">
          <div className="text-center mb-12">
            <h3 className="font-serif text-3xl text-custom-forest">Featured Masterpieces</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 border border-gray-100 flex flex-col h-full">
                <div className="h-48 bg-custom-parchment p-4 flex items-center justify-center border-b border-gray-50">
                   {/* Placeholder for actual image */}
                   <div className="w-full h-full border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400 text-xs">Image: {product.name}</div>
                </div>
                <div className="p-6 flex flex-col flex-grow text-center">
                  <h4 className="font-bold text-custom-charcoal text-sm mb-2">{product.name}</h4>
                  <p className="text-xs text-custom-muted mb-4 flex-grow line-clamp-3">{product.description}</p>
                  <p className="text-custom-gold font-bold mb-4">{product.price} BGN</p>
                  <Link href={`/products/${product.id}`} className="block w-full py-2 bg-custom-forest hover:bg-custom-forest/90 text-white text-xs font-bold tracking-wider uppercase transition-colors rounded">
                    View Details
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
