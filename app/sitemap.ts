import { MetadataRoute } from 'next'
import { db } from '@/lib/firebase/admin'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://woodcarvingbg.eu'
  
  const locales = ['bg', 'en']
  const staticPages = ['', '/catalogue', '/about', '/contact']
  
  // Static pages for each locale
  const staticEntries = locales.flatMap(locale =>
    staticPages.map(page => ({
      url: `${baseUrl}/${locale}${page}`,
      lastModified: new Date(),
      changeFrequency: page === '' ? 'weekly' as const : 'monthly' as const,
      priority: page === '' ? 1 : 0.8,
    }))
  )
  
  // Dynamic product pages
  let productEntries: MetadataRoute.Sitemap = []
  try {
    const snapshot = await db.collection('products').get()
    productEntries = snapshot.docs.flatMap(doc =>
      locales.map(locale => ({
        url: `${baseUrl}/${locale}/products/${doc.id}`,
        lastModified: doc.data().createdAt?.toDate?.() || new Date(),
        changeFrequency: 'monthly' as const,
        priority: 0.7,
      }))
    )
  } catch (error) {
    console.error('Error generating sitemap:', error)
  }
  
  return [...staticEntries, ...productEntries]
}
