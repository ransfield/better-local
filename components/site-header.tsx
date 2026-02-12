import Image from 'next/image'
import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { Button } from '@/components/ui/button'
import type { Site } from '@/lib/site'

export function SiteHeader({ site }: { site: Site }) {
  return (
    <header className="border-b border-neutral-200 bg-white">
      <Container className="flex items-center justify-between py-4">
        <Link href="/" className="flex items-center gap-3">
          <Image src="/logo.svg" alt={`${site.business.name} logo`} width={160} height={40} priority />
          <span className="font-semibold">{site.business.name}</span>
        </Link>

        <nav className="hidden gap-6 text-sm text-neutral-700 md:flex">
          {site.nav.map((item) => (
            <Link key={item.href} href={item.href} className="hover:text-black">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button variant="secondary" href={`tel:${site.business.phoneRaw || site.business.phone}`}>
            Call
          </Button>
          <Button href="/contact">Get a quote</Button>
        </div>
      </Container>
    </header>
  )
}
