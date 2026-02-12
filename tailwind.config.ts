import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx,mdx}', './content/**/*.{mdx,json}'],
  theme: {
    extend: {
      container: { center: true, padding: '1rem' }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}

export default config
