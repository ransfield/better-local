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
    <footer className="border-t border-[#05423e] bg-[#065e59] text-teal-50">
      <Container size="wide" className="py-16 text-sm">
        <div className="grid gap-8 sm:grid-cols-2">
          <div>
            <div className="font-display text-xl font-bold text-white">{site.business.name}</div>
            <div className="mt-2 whitespace-pre-line">{site.business.address}</div>
            <div className="mt-2">{site.business.hours}</div>
          </div>
          <div className="sm:text-right">
            <div className="font-display text-xl font-bold text-white">Contact</div>
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
                    className="inline-flex border border-teal-100/50 px-3 py-1.5 text-xs font-medium text-teal-50 transition hover:border-white hover:text-white"
                  >
                    {item.label}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>
        <div className="mt-8 border-t border-teal-100/25 pt-6 text-xs text-teal-100/80">
          &copy; {new Date().getFullYear()} {site.business.name}. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
