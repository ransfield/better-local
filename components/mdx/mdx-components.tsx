import Link from 'next/link'
import { Hero } from '@/components/blocks/hero'
import { Section } from '@/components/blocks/section'
import { FeatureGrid } from '@/components/blocks/feature-grid'
import { CtaBanner } from '@/components/blocks/cta-banner'
import { ContactForm } from '@/components/contact-form'

export const mdxComponents = {
  Hero,
  Section,
  FeatureGrid,
  CtaBanner,
  ContactForm,
  a: (props: any) => <Link {...props} className="underline" />
}
