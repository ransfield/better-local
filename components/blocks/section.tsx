import { Container } from '@/components/ui/container'
import { cn } from '@/components/ui/cn'

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
  const size = props.size ?? 'read'
  const spacing = props.spacing ?? 'normal'

  const toneClass =
    tone === 'dark'
      ? 'bg-neutral-950 text-white [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_p]:!text-neutral-100/90 [&_li]:!text-neutral-100/85 [&_blockquote]:!border-white [&_blockquote]:!text-white/95 [&_a]:!text-white'
      : tone === 'brand'
        ? 'bg-[#065e59] text-white [&_h1]:!text-white [&_h2]:!text-white [&_h3]:!text-white [&_p]:!text-teal-50/90 [&_li]:!text-teal-50/90 [&_blockquote]:!border-teal-100 [&_blockquote]:!text-teal-50 [&_a]:!text-teal-50'
        : 'bg-white text-neutral-950'

  const spacingClass =
    spacing === 'hero'
      ? 'py-28'
      : spacing === 'major'
        ? 'py-24'
        : spacing === 'statement'
          ? 'py-20'
          : spacing === 'sm'
            ? 'py-10'
            : 'py-16'

  return (
    <section className={cn('w-full', toneClass, props.className)}>
      <Container size={size} className={spacingClass}>
        {props.children}
      </Container>
    </section>
  )
}
