import fs from 'node:fs/promises'
import path from 'node:path'
import type { Metadata } from 'next'
import { MDXRemote } from 'next-mdx-remote/rsc'
import { mdxComponents } from '@/components/mdx/mdx-components'
import { getSite } from '@/lib/site'
import { buildMetadata } from '@/lib/seo'

async function readMdx(slug: string) {
  const file = path.join(process.cwd(), 'content', 'pages', `${slug}.mdx`)
  return fs.readFile(file, 'utf8')
}

export async function renderMdxPage(slug: string) {
  const source = await readMdx(slug)
  return (
    <div className="prose prose-neutral container py-12">
      <MDXRemote source={source} components={mdxComponents} options={{ blockJS: false }} />
    </div>
  )
}

export async function generateMdxMetadata(slug: string, pathName: string): Promise<Metadata> {
  const site = await getSite()
  const title =
    slug === 'home' ? site.seo.defaultTitle : `${slug[0].toUpperCase()}${slug.slice(1)} - ${site.business.name}`

  return buildMetadata(site, {
    title,
    description: site.seo.defaultDescription,
    path: pathName
  })
}
