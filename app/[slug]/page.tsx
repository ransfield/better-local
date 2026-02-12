import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { renderMdxPage, generateMdxMetadata } from '@/lib/mdx'
import { getAllPageSlugs } from '@/lib/pages'

export async function generateStaticParams() {
  const slugs = await getAllPageSlugs()
  return slugs.filter((s) => s !== 'home').map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  return generateMdxMetadata(params.slug, `/${params.slug}`)
}

export default async function Page({ params }: { params: { slug: string } }) {
  try {
    return await renderMdxPage(params.slug)
  } catch {
    notFound()
  }
}
