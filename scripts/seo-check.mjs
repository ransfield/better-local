import fs from 'node:fs/promises'
import path from 'node:path'

async function main() {
  const root = process.cwd()
  const pagesDir = path.join(root, 'content', 'pages')
  const sitePath = path.join(root, 'content', 'site.json')

  const siteRaw = await fs.readFile(sitePath, 'utf8')
  const site = JSON.parse(siteRaw)

  const errors = []

  try {
    new URL(site?.seo?.siteUrl)
  } catch {
    errors.push('content/site.json: seo.siteUrl must be a valid absolute URL.')
  }

  const files = (await fs.readdir(pagesDir)).filter((f) => f.endsWith('.mdx'))
  const slugs = new Set(files.map((f) => f.replace(/\.mdx$/, '')))

  for (const item of site?.nav || []) {
    if (!item?.href || typeof item.href !== 'string') {
      errors.push('content/site.json: each nav item needs a string href.')
      continue
    }

    if (item.href === '/') continue
    if (!item.href.startsWith('/')) {
      errors.push(`content/site.json: nav href '${item.href}' must start with '/'.`)
      continue
    }

    const slug = item.href.slice(1)
    if (!slugs.has(slug)) {
      errors.push(`content/site.json: nav href '${item.href}' has no matching content/pages/${slug}.mdx.`)
    }
  }

  for (const file of files) {
    const fullPath = path.join(pagesDir, file)
    const source = await fs.readFile(fullPath, 'utf8')
    const h1Count = (source.match(/^#\s+\S+/gm) || []).length
    const hasHeroTitle = /<Hero[\s\S]*?\btitle=/.test(source)

    if (h1Count === 0 && !hasHeroTitle) {
      errors.push(`content/pages/${file}: add a '# H1' heading or a Hero block with a title prop.`)
    }

    if (h1Count > 1) {
      errors.push(`content/pages/${file}: use only one H1 heading.`)
    }
  }

  if (errors.length) {
    console.error('\nSEO check failed:\n' + errors.map((e) => `- ${e}`).join('\n'))
    process.exit(1)
  }

  console.log('SEO check OK')
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
