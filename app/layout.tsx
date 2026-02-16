import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { SiteHeader } from '@/components/site-header'
import { SiteFooter } from '@/components/site-footer'
import { getSite } from '@/lib/site'
import { buildMetadata } from '@/lib/seo'

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap'
})

export async function generateMetadata(): Promise<Metadata> {
  const site = await getSite()
  return buildMetadata(site, {
    title: site.seo.defaultTitle,
    description: site.seo.defaultDescription,
    path: '/'
  })
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const site = await getSite()
  return (
    <html lang="en">
      <body className={`${inter.variable} bg-white text-neutral-950 antialiased`}>
        <SiteHeader site={site} />
        <main className="min-h-[70vh]">{children}</main>
        <SiteFooter site={site} />
      </body>
    </html>
  )
}
