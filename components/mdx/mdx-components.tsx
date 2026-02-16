import Link from 'next/link'
import { Hero } from '@/components/blocks/hero'
import { Section } from '@/components/blocks/section'
import { FeatureGrid } from '@/components/blocks/feature-grid'
import { CtaBanner } from '@/components/blocks/cta-banner'
import { FAQAccordion } from '@/components/blocks/faq-accordion'
import { ImageGallery } from '@/components/blocks/image-gallery'
import { PricingCards } from '@/components/blocks/pricing-cards'
import { SplitImage } from '@/components/blocks/split-image'
import { ContactForm } from '@/components/contact-form'
import { Container } from '@/components/ui/container'

export const mdxComponents = {
  Hero,
  Section,
  FeatureGrid,
  CtaBanner,
  FAQAccordion,
  ImageGallery,
  PricingCards,
  SplitImage,
  ContactForm,
  h1: (props: any) => (
    <section className="w-full bg-white">
      <Container size="read" className="py-16">
        <h1 {...props} />
      </Container>
    </section>
  ),
  a: (props: any) => <Link {...props} className="underline" />
}
