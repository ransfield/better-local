import fs from 'node:fs/promises'
import path from 'node:path'
import { z } from 'zod'

const NavItem = z.object({
  label: z.string(),
  href: z.string()
})

const SiteSchema = z.object({
  business: z.object({
    name: z.string(),
    phone: z.string(),
    phoneRaw: z.string().optional(),
    address: z.string(),
    hours: z.string()
  }),
  contact: z.object({
    toEmail: z.string().email()
  }),
  nav: z.array(NavItem),
  social: z
    .object({
      facebook: z.string().url().optional(),
      instagram: z.string().url().optional(),
      linkedin: z.string().url().optional()
    })
    .optional(),
  seo: z.object({
    siteUrl: z.string().url(),
    defaultTitle: z.string(),
    defaultDescription: z.string()
  })
})

export type Site = z.infer<typeof SiteSchema>

export async function getSite(): Promise<Site> {
  const file = path.join(process.cwd(), 'content', 'site.json')
  const raw = await fs.readFile(file, 'utf8')
  const data = JSON.parse(raw)
  return SiteSchema.parse(data)
}
