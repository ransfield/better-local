import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { cn } from '@/components/ui/cn'

export function Hero(props: {
  title: string
  subtitle?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  supportingLine?: string
  eyebrow?: string
  backgroundImage?: string
  tone?: 'light' | 'dark' | 'brand'
}) {
  const tone = props.tone ?? 'brand'

  const toneClass =
    tone === 'dark'
      ? 'bg-[var(--color-dark)] text-[var(--color-bg)] border-[var(--color-dark-surface)]'
      : tone === 'brand'
        ? 'bg-[var(--color-dark-surface)] text-[var(--color-bg)] border-[var(--color-dark-surface)]'
        : 'bg-[var(--color-bg)] text-[var(--color-text)] border-[var(--color-bg-alt)]'

  const subtitleClass = tone === 'light' ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-bg-alt)]'
  const overlayClass = props.backgroundImage
    ? tone === 'light'
      ? 'bg-white/68'
      : 'bg-[rgba(26,26,25,0.45)]'
    : tone === 'brand'
      ? 'bg-[linear-gradient(118deg,rgba(20,20,20,0.7)_0%,rgba(38,38,38,0.58)_50%,rgba(17,17,17,0.72)_100%)]'
      : tone === 'dark'
        ? 'bg-[radial-gradient(70%_70%_at_20%_15%,rgba(255,255,255,0.10),transparent_58%),radial-gradient(55%_55%_at_85%_0%,rgba(255,255,255,0.08),transparent_48%)]'
        : 'bg-[radial-gradient(75%_70%_at_20%_10%,rgba(0,0,0,0.06),transparent_60%)]'

  return (
    <section className={cn('relative isolate w-full overflow-hidden border-y border-[var(--color-bg-alt)]', tone === 'light' && 'hero-surface-light', toneClass)}>
      {props.backgroundImage ? (
        <div
          className={cn(
            'absolute inset-0 bg-cover bg-center',
            tone === 'light' ? 'opacity-40' : 'opacity-45'
          )}
          style={{ backgroundImage: `url(${props.backgroundImage})` }}
          aria-hidden="true"
        />
      ) : null}
      <div className={cn('absolute inset-0', overlayClass)} aria-hidden="true" />
      {!props.backgroundImage && tone === 'brand' ? (
        <>
          <div className="absolute inset-y-0 left-[6%] w-[38%] bg-white/10" aria-hidden="true" />
          <div className="absolute inset-y-0 left-[47%] w-[31%] bg-[rgba(26,26,25,0.12)]" aria-hidden="true" />
          <div
            className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:52px_52px]"
            aria-hidden="true"
          />
        </>
      ) : null}
      <Container size="read" className="relative flex min-h-[72vh] flex-col justify-center py-[var(--space-3xl)] md:py-[var(--space-4xl)] text-center">
        <div>
          {props.eyebrow ? (
            <p className={cn('text-xs uppercase tracking-widest opacity-70', tone === 'light' ? 'text-neutral-700' : 'text-white')}>
              {props.eyebrow}
            </p>
          ) : null}
          <h1
            className={cn(
              'mx-auto max-w-[680px] font-display font-normal leading-[1.05] tracking-[-0.03em] [font-size:clamp(40px,5vw,64px)]',
              props.eyebrow ? 'mt-4' : 'mt-0',
              tone === 'light' ? 'text-[var(--color-dark)]' : 'text-[var(--color-bg)]'
            )}
          >
            {props.title}
          </h1>
          {props.subtitle ? (
            <p className={cn('mx-auto mt-8 max-w-[680px] whitespace-pre-line text-base leading-relaxed md:text-lg', subtitleClass)}>
              {props.subtitle}
            </p>
          ) : null}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {props.primaryCta ? (
            <Link
              href={props.primaryCta.href}
              className={cn(
                'btn-primary inline-flex items-center justify-center no-underline',
                tone === 'light'
                  ? ''
                  : '!bg-[#ebebd5] !text-[#004943] hover:!bg-[#dfdfc7]'
              )}
            >
              {props.primaryCta.label}
            </Link>
          ) : null}
          {props.secondaryCta ? (
            <Link
              href={props.secondaryCta.href}
              className={cn(
                'btn-secondary inline-flex items-center justify-center no-underline',
                tone === 'light'
                  ? ''
                  : '!border-[var(--color-bg-alt)] !text-[var(--color-bg)] hover:!bg-white/10 hover:!text-[var(--color-bg)]'
              )}
            >
              {props.secondaryCta.label}
            </Link>
          ) : null}
        </div>
        {props.supportingLine ? (
          <p className={cn('mx-auto mt-4 max-w-2xl text-sm leading-relaxed', tone === 'light' ? 'text-[var(--color-text-secondary)]' : 'text-[var(--color-bg-alt)]')}>
            {props.supportingLine}
          </p>
        ) : null}
      </Container>
    </section>
  )
}
