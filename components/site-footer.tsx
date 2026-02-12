import { Container } from '@/components/ui/container'
import type { Site } from '@/lib/site'

export function SiteFooter({ site }: { site: Site }) {
  return (
    <footer className="border-t border-neutral-200 bg-white">
      <Container className="py-10 text-sm text-neutral-700">
        <div className="grid gap-6 sm:grid-cols-2">
          <div>
            <div className="font-semibold text-black">{site.business.name}</div>
            <div className="mt-2 whitespace-pre-line">{site.business.address}</div>
            <div className="mt-2">{site.business.hours}</div>
          </div>
          <div className="sm:text-right">
            <div className="font-semibold text-black">Contact</div>
            <div className="mt-2">{site.business.phone}</div>
            <div className="mt-1">{site.contact.toEmail}</div>
          </div>
        </div>
        <div className="mt-8 text-xs text-neutral-500">
          &copy; {new Date().getFullYear()} {site.business.name}. All rights reserved.
        </div>
      </Container>
    </footer>
  )
}
