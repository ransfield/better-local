import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx,mdx}', './components/**/*.{ts,tsx,mdx}', './content/**/*.{mdx,json}'],
  theme: {
    extend: {
      container: { center: true, padding: '1rem' },
      fontFamily: {
        sans: ['var(--font-sans)', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'Georgia', 'serif']
      }
    }
  },
  plugins: [require('@tailwindcss/typography')]
}

export default config
