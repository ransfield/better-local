import fs from 'node:fs/promises'
import path from 'node:path'

export async function getAllPageSlugs(): Promise<string[]> {
  const dir = path.join(process.cwd(), 'content', 'pages')
  const files = await fs.readdir(dir)
  return files
    .filter((f) => f.endsWith('.mdx'))
    .map((f) => f.replace(/\.mdx$/, ''))
}
