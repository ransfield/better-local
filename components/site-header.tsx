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
      <div className="announcement-bar w-full">
        <Container size="wide" className="text-center">
          <Link href="/contact" className="transition-opacity hover:opacity-100">
            Book a Local Presence Audit - practical advice, fast launch plan.
          </Link>
        </Container>
      </div>

      <div className="glass-nav w-full">
        <Container size="wide" className="py-5">
          <div className="flex items-center justify-between">
            <Link href="/" className="flex items-center" aria-label={site.business.name}>
              <Image src="/logo.svg" alt={`${site.business.name} logo`} width={140} height={56} priority />
            </Link>

            <div className="hidden items-center gap-10 md:flex">
              <nav className="flex items-center gap-8 text-[15px] font-medium leading-none text-[var(--color-text)]">
                {site.nav.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={`whitespace-nowrap transition-colors ${pathname === item.href ? 'text-[var(--color-accent)]' : 'text-[var(--color-text)] hover:text-[var(--color-dark)]'}`}
                  >
                    {item.label}
                  </Link>
                ))}
              </nav>
              <Link
                href="/contact"
                className="nav-cta inline-flex items-center"
              >
                Book a Local Presence Audit
              </Link>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <Link
                href="/contact"
                className="nav-cta inline-flex items-center px-3 py-2 text-xs"
              >
                Book audit
              </Link>
              <button
                type="button"
                aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
                aria-expanded={mobileMenuOpen}
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                className="inline-flex h-10 w-10 items-center justify-center border border-[var(--color-bg-alt)] text-[var(--color-text)]"
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
          </div>
        </Container>
      </div>

      {mobileMenuOpen ? (
        <div className="fixed inset-0 z-[70] bg-[var(--color-bg)] md:hidden">
          <div className="announcement-bar w-full">
            <Container size="wide" className="text-center">
              <Link href="/contact" className="transition-opacity hover:opacity-100" onClick={() => setMobileMenuOpen(false)}>
                Book a Local Presence Audit - practical advice, fast launch plan.
              </Link>
            </Container>
          </div>

          <div className="border-b border-[var(--color-bg-alt)]">
            <Container size="wide" className="py-5">
              <div className="flex items-center gap-4">
                <button
                  type="button"
                  aria-label="Close menu"
                  onClick={() => setMobileMenuOpen(false)}
                  className="inline-flex h-9 w-9 items-center justify-center text-3xl leading-none text-[var(--color-text-secondary)]"
                >
                  &times;
                </button>
                <Link href="/" onClick={() => setMobileMenuOpen(false)}>
                  <Image src="/logo.svg" alt={`${site.business.name} logo`} width={140} height={56} priority />
                </Link>
              </div>
            </Container>
          </div>

          <Container size="wide" className="pt-2 pb-10">
            <nav className="border-t border-[var(--color-bg-alt)]">
              {site.nav.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block border-b border-[var(--color-bg-alt)] py-5 text-2xl font-medium text-[var(--color-text)]"
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            <div className="mt-8">
              <Link
                href="/contact"
                onClick={() => setMobileMenuOpen(false)}
                className="nav-cta inline-flex w-full items-center justify-center text-base"
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
