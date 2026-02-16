import type { MetadataRoute } from 'next'
import { getAllPageSlugs } from '@/lib/pages'
import { getSite } from '@/lib/site'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const site = await getSite()
  const base = new URL(site.seo.siteUrl)
  const slugs = await getAllPageSlugs()

  return slugs.map((slug) => ({
    url: new URL(slug === 'home' ? '/' : `/${slug}`, base).toString(),
    changeFrequency: slug === 'home' ? 'weekly' : 'monthly',
    priority: slug === 'home' ? 1 : 0.7
  }))
}
