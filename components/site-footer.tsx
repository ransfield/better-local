import { Container } from '@/components/ui/container'
import Link from 'next/link'
import type { Site } from '@/lib/site'

export function SiteFooter({ site }: { site: Site }) {
  const socials = [
    { key: 'facebook', label: 'Facebook', href: site.social?.facebook },
    { key: 'instagram', label: 'Instagram', href: site.social?.instagram },
    { key: 'linkedin', label: 'LinkedIn', href: site.social?.linkedin }
  ].filter((item): item is { key: string; label: string; href: string } => Boolean(item.href))

  return (
    <footer className="border-t border-[var(--color-bg-alt)] bg-[var(--color-bg)] text-[var(--color-text-secondary)]">
      <Container size="wide" className="py-16 text-sm">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <div className="font-display text-xl font-bold text-[var(--color-dark)]">{site.business.name}</div>
            <div className="mt-2 whitespace-pre-line">{site.business.address}</div>
            <div className="mt-2">{site.business.hours}</div>
          </div>
          <div className="sm:text-right">
            <div className="font-display text-xl font-bold text-[var(--color-dark)]">Contact</div>
            <div className="mt-2">{site.business.phone}</div>
            <div className="mt-1">{site.contact.toEmail}</div>
            {socials.length > 0 ? (
              <div className="mt-4 flex flex-wrap justify-start gap-2 sm:justify-end">
                {socials.map((item) => (
                  <Link
                    key={item.key}
                    href={item.href}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex border border-[var(--color-bg-alt)] px-3 py-1.5 text-xs font-medium text-[var(--color-text-secondary)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-8 border-t border-[var(--color-bg-alt)] pt-6 text-xs text-[var(--color-text-secondary)]">
          &copy; {new Date().getFullYear()} {site.business.name}. All rights reserved.
          <div className="mt-2">Better Local is part of Better Digital.</div>
        </div>
      </Container>
    </footer>
  )
}
