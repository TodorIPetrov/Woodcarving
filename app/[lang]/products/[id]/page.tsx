import { getDictionary } from "@/dictionaries/getDictionary";
import { db } from "@/lib/firebase/admin";
import ProductClient from "./ProductClient";

export default async function ProductPage({ params }: { params: { lang: string, id: string } }) {
  const dict = await getDictionary(params.lang as any);
  
  let product: any = null;
  try {
    const doc = await db.collection("products").doc(params.id).get();
    if (doc.exists) {
      const data = doc.data() as any;
      product = { 
        id: doc.id, 
        ...data,
        name: data[`name_${params.lang}`] || data.name || '',
        description: data[`description_${params.lang}`] || data.description || '',
        woodType: data[`woodType_${params.lang}`] || data.woodType || ''
      };
    }
  } catch (error) {
    console.error("Error fetching product:", error);
  }

  // Fallback if not found or DB fails
  if (!product) {
    product = {
      id: params.id,
      name: dict.product.fallback_name,
      price: 250.00,
      description: dict.product.fallback_desc,
      image: "/images/st-george-icon.jpg",
      isMadeToOrder: true,
      leadTime: "2-3 weeks"
    };
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "VisualArtwork",
            "name": product.name,
            "image": "https://example.com" + product.image,
            "description": product.description,
            "artMedium": "Wood",
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "BGN",
              "availability": product.isMadeToOrder ? "https://schema.org/PreOrder" : "https://schema.org/InStock"
            }
          })
        }}
      />
      <ProductClient product={product} dict={dict.product} />
    </>
  );
}
