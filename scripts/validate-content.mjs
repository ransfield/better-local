import fs from 'node:fs'
import path from 'node:path'

const required = [
  'content/site.json',
  'content/pages/home.mdx',
  'content/pages/about.mdx',
  'content/pages/services.mdx',
  'content/pages/contact.mdx'
]

const missing = required.filter((p) => !fs.existsSync(path.join(process.cwd(), p)))

if (missing.length) {
  console.error('\nMissing required content files:\n' + missing.map((m) => `- ${m}`).join('\n'))
  process.exit(1)
}

console.log('Content validation OK')
