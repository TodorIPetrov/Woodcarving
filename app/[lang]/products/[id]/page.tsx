import { Metadata } from "next";
import { getDictionary } from "@/dictionaries/getDictionary";
import { db } from "@/lib/firebase/admin";
import ProductClient from "./ProductClient";

const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://woodcarvingbg.eu';

export async function generateMetadata({ params }: { params: { lang: string, id: string } }): Promise<Metadata> {
  const dict = await getDictionary(params.lang as any);
  let title = "Kazanlak Woodcarving";
  let description = dict.metadata.site_description;
  let imageUrl = "";

  try {
    const doc = await db.collection("products").doc(params.id).get();
    if (doc.exists) {
      const data = doc.data() as any;
      title = data[`name_${params.lang}`] || data.name || title;
      description = data[`description_${params.lang}`] || data.description || description;
      imageUrl = (data.images && data.images.length > 0) ? data.images[0] : (data.image || "");
    }
  } catch (error) {}

  const otherLang = params.lang === 'bg' ? 'en' : 'bg';

  return {
    title: `${title} | Kazanlak Woodcarving`,
    description: description.substring(0, 160),
    openGraph: {
      title: title,
      description: description.substring(0, 160),
      images: imageUrl ? [{ url: imageUrl }] : [],
      type: 'website',
      locale: params.lang === 'bg' ? 'bg_BG' : 'en_US',
    },
    twitter: {
      card: 'summary_large_image',
      title: title,
      description: description.substring(0, 160),
      images: imageUrl ? [imageUrl] : [],
    },
    alternates: {
      canonical: `${baseUrl}/${params.lang}/products/${params.id}`,
      languages: {
        'bg': `${baseUrl}/bg/products/${params.id}`,
        'en': `${baseUrl}/en/products/${params.id}`,
      },
    },
  };
}

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
        woodType: data[`woodType_${params.lang}`] || data.woodType || '',
        createdAt: data.createdAt?.toDate?.()?.toISOString() || null
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

  // Build image URL for schema
  const schemaImage = (product.images && product.images.length > 0) 
    ? product.images[0] 
    : (product.image?.startsWith('http') ? product.image : `${baseUrl}${product.image || ''}`);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            "name": product.name,
            "image": schemaImage,
            "description": product.description,
            "brand": {
              "@type": "Brand",
              "name": "Kazanlak Woodcarving"
            },
            "material": product.woodType || "Wood",
            "offers": {
              "@type": "Offer",
              "price": product.price,
              "priceCurrency": "BGN",
              "availability": product.isMadeToOrder ? "https://schema.org/PreOrder" : "https://schema.org/InStock",
              "seller": {
                "@type": "Organization",
                "name": "Kazanlak Woodcarving"
              }
            }
          })
        }}
      />
      <ProductClient product={product} dict={dict.product} lang={params.lang} />
    </>
  );
}
