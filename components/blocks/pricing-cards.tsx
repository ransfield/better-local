import { Button } from '@/components/ui/button'
import { cn } from '@/components/ui/cn'

type Plan = {
  name: string
  price: string
  description?: string
  points?: string[]
  ctaLabel: string
  ctaHref: string
  featured?: boolean
  badge?: string
  note?: string
}

export function PricingCards(props: { plans: Plan[] }) {
  return (
    <div className="not-prose grid gap-5 md:grid-cols-3">
      {props.plans.map((plan, idx) => {
        const isEntry = idx === 0
        const isFeatured = Boolean(plan.featured)
        const isSupport = idx === props.plans.length - 1 && !isFeatured

        return (
          <article
            key={plan.name}
            className={cn(
              'stagger-item relative flex flex-col rounded-2xl border border-[var(--color-bg-alt)] bg-[var(--color-surface)] p-8 text-left shadow-sm',
              isEntry && 'min-h-[25rem] bg-[var(--color-bg-alt)]',
              isFeatured &&
                'min-h-[30rem] border-2 border-[var(--color-accent)] bg-[var(--color-dark-surface)] text-[var(--color-bg)] [&_h3]:!text-[var(--color-bg)] [&_p]:!text-[var(--color-bg)] [&_li]:!text-[var(--color-bg)] [&_span]:!text-[var(--color-bg)] [&_strong]:!text-[var(--color-bg)]',
              isSupport && 'min-h-[27rem] border-2 border-[var(--color-bg-alt)] bg-transparent'
            )}
          >
          {plan.badge ? (
            <div className="badge-popular absolute right-5 top-5">
              {plan.featured ? `✧ ${plan.badge}` : plan.badge}
            </div>
          ) : null}
          <h3 className={cn('font-display text-xl font-semibold leading-tight md:text-2xl', plan.featured ? '!text-[var(--color-bg)]' : 'text-[var(--color-dark)]')}>
            {plan.name}
          </h3>
          <p className={cn('mt-2 font-display text-3xl font-semibold leading-[0.95] tracking-tight md:text-4xl', plan.featured ? '!text-[var(--color-bg)]' : 'text-[var(--color-dark)]')}>
            {plan.price}
          </p>
          {plan.description ? (
            <p className={cn('mt-4 text-base leading-relaxed md:text-lg', plan.featured ? '!text-[var(--color-bg)]' : 'text-[var(--color-text-secondary)]')}>{plan.description}</p>
          ) : null}

          {plan.points && plan.points.length > 0 ? (
            <>
              <div className={cn('mt-7 h-px w-full', plan.featured ? 'bg-white/25' : 'bg-[var(--color-bg-alt)]')} />
              <ul className={cn('mt-6 space-y-3 text-base leading-relaxed', plan.featured ? '!text-[var(--color-bg)]' : 'text-[var(--color-text-secondary)]')}>
                {plan.points.map((point) => (
                  <li key={point} className="flex items-start gap-3">
                    <span className={cn('mt-0.5 text-2xl leading-none', plan.featured ? '!text-[var(--color-bg)]' : 'text-[var(--color-accent)]')}>✓</span>
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </>
          ) : null}

          {plan.note ? (
            <p className={cn('mt-6 text-base leading-relaxed md:text-lg', plan.featured ? '!text-[var(--color-bg)]' : 'text-[var(--color-text-secondary)]')}>
              <strong>Best for:</strong> {plan.note}
            </p>
          ) : null}

          <div className="mt-auto pt-8">
            <Button
              className={cn(
                'w-auto rounded-md px-6 py-3 text-base font-semibold normal-case tracking-normal',
                plan.featured
                  ? 'bg-[#ebebd5] text-[#004943] hover:bg-[#dfdfc7] focus:ring-[#ebebd5]'
                  : 'bg-[#ebebd5] text-[#004943] hover:bg-[#dfdfc7]'
              )}
              href={plan.ctaHref}
            >
              {plan.ctaLabel}
            </Button>
          </div>
          </article>
        )
      })}
    </div>
  )
}
