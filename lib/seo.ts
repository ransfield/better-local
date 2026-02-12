import type { Metadata } from 'next'
import type { Site } from '@/lib/site'

export function buildMetadata(site: Site, opts: { title: string; description: string; path: string }): Metadata {
  const base = new URL(site.seo.siteUrl)
  const url = new URL(opts.path, base).toString()

  return {
    metadataBase: base,
    title: opts.title,
    description: opts.description,
    alternates: { canonical: url },
    openGraph: {
      title: opts.title,
      description: opts.description,
      url,
      siteName: site.business.name,
      type: 'website'
    }
  }
}
