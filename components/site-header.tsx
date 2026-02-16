'use client'

import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Container } from '@/components/ui/container'
import type { Site } from '@/lib/site'

export function SiteHeader({ site }: { site: Site }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const pathname = usePathname()

  useEffect(() => {
    if (!mobileMenuOpen) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [mobileMenuOpen])

  return (
    <header className="w-full">
      <div className="w-full bg-[#05423e] text-white">
        <Container size="wide" className="py-2 text-center text-xs font-normal">
          <Link href="/contact" className="transition hover:text-white/90">
            Book a Local Presence Audit - practical advice, fast launch plan.
          </Link>
        </Container>
      </div>

      <div className="w-full border-b border-neutral-200/60 bg-white">
        <Container size="wide" className="py-6">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center" aria-label={site.business.name}>
              <Image src="/logo.svg" alt={`${site.business.name} logo`} width={120} height={48} priority />
            </Link>

            <div className="hidden items-center gap-10 md:flex">
              <nav className="flex items-center gap-8 text-sm font-medium text-neutral-800">
                {site.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap transition-colors ${pathname === item.href ? 'text-neutral-950' : 'text-neutral-800 hover:text-neutral-950'}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/contact"
                className="inline-flex items-center rounded-md bg-neutral-950 px-4 py-2 text-xs font-semibold text-white transition hover:bg-neutral-800"
              >
                Book a Local Presence Audit
              </Link>
            </div>

            <button
              type="button"
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={mobileMenuOpen}
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="inline-flex h-10 w-10 items-center justify-center border border-neutral-300 text-neutral-900 md:hidden"
            >
              {mobileMenuOpen ? (
                <span className="text-2xl leading-none">&times;</span>
              ) : (
                <span className="flex flex-col gap-1">
                  <span className="h-0.5 w-5 bg-current" />
                  <span className="h-0.5 w-5 bg-current" />
                  <span className="h-0.5 w-5 bg-current" />
                </span>
              )}
            </button>
          </div>
        </Container>
      </div>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[70] bg-white md:hidden">
          <div className="w-full bg-[#05423e] text-white">
            <Container size="wide" className="py-2 text-center text-xs font-normal">
              <Link href="/contact" className="transition hover:text-white/90" onClick={() => setMobileMenuOpen(false)}>
                Book a Local Presence Audit - practical advice, fast launch plan.
              </Link>
            </Container>
          </div>

          <div className="border-b border-neutral-200">
            <Container size="wide" className="py-5">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center text-3xl leading-none text-neutral-700"
                >
                  &times;
                </button>
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Image src="/logo.svg" alt={`${site.business.name} logo`} width={120} height={48} priority />
                </Link>
              </div>
            </Container>
          </div>

          <Container size="wide" className="pt-2 pb-10">
            <nav className="border-t border-neutral-200">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block border-b border-neutral-200 py-5 text-2xl font-medium text-neutral-900"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="inline-flex w-full items-center justify-center rounded-md bg-neutral-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-neutral-800"
              >
                Book a Local Presence Audit
              </Link>
            </div>
          </Container>
        </div>
      ) : null}
    </header>
  )
}
