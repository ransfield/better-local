import type { Metadata } from 'next'
import { renderMdxPage, generateMdxMetadata } from '@/lib/mdx'

export async function generateMetadata(): Promise<Metadata> {
  return generateMdxMetadata('home', '/')
}

export default async function HomePage() {
  return renderMdxPage('home')
}
