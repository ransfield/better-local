import Link from 'next/link'
import { Container } from '@/components/ui/container'
import { cn } from '@/components/ui/cn'

export function Hero(props: {
  title: string
  subtitle?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
  eyebrow?: string
  backgroundImage?: string
  tone?: 'light' | 'dark' | 'brand'
}) {
  const tone = props.tone ?? 'brand'

  const toneClass =
    tone === 'dark'
      ? 'bg-neutral-950 text-white border-neutral-800'
      : tone === 'brand'
        ? 'bg-[#065e59] text-white border-[#05423e]'
        : 'bg-white text-black border-neutral-200'

  const subtitleClass = tone === 'light' ? 'text-neutral-700' : 'text-white/88'
  const overlayClass = props.backgroundImage
    ? tone === 'light'
      ? 'bg-white/85'
      : 'bg-black/45'
    : tone === 'brand'
      ? 'bg-[linear-gradient(118deg,rgba(6,46,43,0.7)_0%,rgba(8,73,68,0.55)_48%,rgba(9,84,78,0.68)_100%)]'
      : tone === 'dark'
        ? 'bg-[radial-gradient(70%_70%_at_20%_15%,rgba(255,255,255,0.10),transparent_58%),radial-gradient(55%_55%_at_85%_0%,rgba(255,255,255,0.08),transparent_48%)]'
        : 'bg-[radial-gradient(75%_70%_at_20%_10%,rgba(0,0,0,0.06),transparent_60%)]'

  return (
    <section className={cn('relative isolate w-full overflow-hidden border-y border-neutral-800', toneClass)}>
      {props.backgroundImage ? (
        <div
          className={cn(
            'absolute inset-0 bg-cover bg-center',
            tone === 'light' ? 'opacity-20' : 'opacity-45'
          )}
          style={{ backgroundImage: `url(${props.backgroundImage})` }}
          aria-hidden="true"
        />
      ) : null}
      <div className={cn('absolute inset-0', overlayClass)} aria-hidden="true" />
      {!props.backgroundImage && tone === 'brand' ? (
        <>
          <div className="absolute inset-y-0 left-[6%] w-[38%] bg-white/10" aria-hidden="true" />
          <div className="absolute inset-y-0 left-[47%] w-[31%] bg-black/12" aria-hidden="true" />
          <div
            className="absolute inset-0 opacity-[0.14] [background-image:linear-gradient(to_right,rgba(255,255,255,0.5)_1px,transparent_1px)] [background-size:52px_52px]"
            aria-hidden="true"
          />
        </>
      ) : null}
      <Container size="read" className="relative flex min-h-[72vh] flex-col justify-center py-28 text-center">
        <div>
          <p className={cn('text-xs uppercase tracking-widest opacity-70', tone === 'light' ? 'text-neutral-700' : 'text-white')}>
            {props.eyebrow ?? 'BetterLocal'}
          </p>
          <h1
            className={cn(
              'mt-4 font-display text-5xl font-semibold leading-[1.05] tracking-tight md:text-6xl',
              tone === 'light' ? 'text-black' : 'text-white'
            )}
          >
            {props.title}
          </h1>
          {props.subtitle ? (
            <p className={cn('mx-auto mt-8 max-w-2xl whitespace-pre-line text-base leading-relaxed md:text-lg', subtitleClass)}>
              {props.subtitle}
            </p>
          ) : null}
        </div>
        <div className="mt-6 flex flex-wrap justify-center gap-4">
          {props.primaryCta ? (
            <Link
              href={props.primaryCta.href}
              className="inline-flex items-center justify-center rounded-md bg-[#d8e2b8] px-8 py-4 text-lg font-semibold text-[#11453f] no-underline transition hover:bg-[#ccd7a8]"
            >
              {props.primaryCta.label}
            </Link>
          ) : null}
          {props.secondaryCta ? (
            <Link
              href={props.secondaryCta.href}
              className={cn(
                'inline-flex items-center justify-center px-1 py-1 text-base font-medium no-underline',
                tone === 'light' ? 'text-neutral-900' : 'text-white'
              )}
            >
              {props.secondaryCta.label}
            </Link>
          ) : null}
        </div>
      </Container>
    </section>
  )
}
