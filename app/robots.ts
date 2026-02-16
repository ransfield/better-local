import type { MetadataRoute } from 'next'
import { getSite } from '@/lib/site'

export default async function robots(): Promise<MetadataRoute.Robots> {
  const site = await getSite()
  const base = new URL(site.seo.siteUrl)

  return {
    rules: [{ userAgent: '*', allow: '/' }],
    sitemap: new URL('/sitemap.xml', base).toString(),
    host: base.origin
  }
}
