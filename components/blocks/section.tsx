import { Container } from '@/components/ui/container'
import { cn } from '@/components/ui/cn'
import { Reveal } from '@/components/ui/reveal'

type Tone = 'light' | 'dark' | 'brand'
type Size = 'read' | 'wide'
type Spacing = 'sm' | 'normal' | 'major' | 'hero' | 'statement'

export function Section(props: {
  children: React.ReactNode
  tone?: Tone
  size?: Size
  spacing?: Spacing
  className?: string
}) {
  const tone = props.tone ?? 'light'
  const spacing = props.spacing ?? 'normal'
  const size = props.size ?? (spacing === 'statement' ? 'wide' : 'read')

  const toneClass =
    tone === 'dark'
      ? 'bg-[var(--color-dark)] text-[var(--color-bg)] [&_h1]:!text-[var(--color-bg)] [&_h2]:!text-[var(--color-bg)] [&_h3]:!text-[var(--color-bg)] [&_p]:!text-[var(--color-bg-alt)] [&_li]:!text-[var(--color-bg-alt)] [&_blockquote]:!mx-auto [&_blockquote]:!max-w-5xl [&_blockquote]:!border-0 [&_blockquote]:!px-0 [&_blockquote]:!text-center [&_blockquote]:!font-display [&_blockquote]:!font-normal [&_blockquote]:!tracking-tight [&_blockquote]:!leading-[1.05] [&_blockquote]:!text-[3rem] md:[&_blockquote]:!text-[3.75rem] [&_blockquote]:!text-[rgba(255,255,255,0.92)] [&_blockquote]:whitespace-normal lg:[&_blockquote]:whitespace-nowrap'
      : tone === 'brand'
        ? 'bg-[var(--color-dark-surface)] text-[var(--color-bg)] [&_h1]:!text-[var(--color-bg)] [&_h2]:!text-[var(--color-bg)] [&_h3]:!text-[var(--color-bg)] [&_p]:!text-[var(--color-bg-alt)] [&_li]:!text-[var(--color-bg-alt)] [&_blockquote]:!mx-auto [&_blockquote]:!max-w-5xl [&_blockquote]:!border-0 [&_blockquote]:!px-0 [&_blockquote]:!text-center [&_blockquote]:!font-display [&_blockquote]:!font-normal [&_blockquote]:!tracking-tight [&_blockquote]:!leading-[1.05] [&_blockquote]:!text-[3rem] md:[&_blockquote]:!text-[3.75rem] [&_blockquote]:!text-[rgba(255,255,255,0.92)] [&_blockquote]:whitespace-normal lg:[&_blockquote]:whitespace-nowrap'
        : 'bg-[var(--color-bg)] text-[var(--color-text)]'

  const spacingClass =
    spacing === 'hero'
      ? 'py-[var(--space-3xl)] md:py-[var(--space-4xl)]'
      : spacing === 'major'
        ? 'py-[var(--space-2xl)] md:py-[var(--space-3xl)]'
        : spacing === 'statement'
          ? 'py-[var(--space-2xl)]'
          : spacing === 'sm'
            ? 'py-[var(--space-lg)] md:py-[var(--space-xl)]'
            : 'py-[var(--space-2xl)] md:py-[var(--space-3xl)]'

  return (
    <section className={cn('w-full', toneClass, props.className)}>
      <Container size={size} className={spacingClass}>
        <Reveal>{props.children}</Reveal>
      </Container>
    </section>
  )
}
