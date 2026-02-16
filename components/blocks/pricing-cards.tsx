import { Button } from '@/components/ui/button'
import { cn } from '@/components/ui/cn'

type Plan = {
  name: string
  price: string
  description?: string
  points: string[]
  ctaLabel: string
  ctaHref: string
  featured?: boolean
  badge?: string
  note?: string
}

export function PricingCards(props: { plans: Plan[] }) {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {props.plans.map((plan) => (
        <article
          key={plan.name}
          className={cn(
            'relative flex min-h-[34rem] flex-col rounded-2xl border border-neutral-200/80 bg-neutral-50 p-8 text-left shadow-sm',
            plan.featured ? 'border-[#065e59] bg-[#065e59] text-white' : ''
          )}
        >
          {plan.badge ? (
            <div
              className={cn(
                'absolute right-5 top-5 rounded-full px-3 py-1 text-xs font-medium',
                plan.featured ? 'bg-[#d6f5f1] text-[#05423e]' : 'bg-neutral-100 text-neutral-700'
              )}
            >
              {plan.featured ? `✧ ${plan.badge}` : plan.badge}
            </div>
          ) : null}
          <h3 className={cn('font-display text-xl font-semibold leading-tight md:text-2xl', plan.featured ? 'text-white' : 'text-[#0e5653]')}>
            {plan.name}
          </h3>
          <p className={cn('mt-2 font-display text-3xl font-semibold leading-[0.95] tracking-tight md:text-4xl', plan.featured ? 'text-white' : 'text-[#0e5653]')}>
            {plan.price}
          </p>
          {plan.description ? (
            <p className={cn('mt-3 text-lg leading-snug md:text-xl', plan.featured ? 'text-teal-50/95' : 'text-neutral-700')}>{plan.description}</p>
          ) : null}

          <div className={cn('mt-7 h-px w-full', plan.featured ? 'bg-white/20' : 'bg-neutral-200')} />

          <ul className={cn('mt-6 space-y-3 text-base leading-relaxed', plan.featured ? 'text-teal-50/95' : 'text-neutral-700')}>
            {plan.points.map((point) => (
              <li key={point} className="flex items-start gap-3">
                <span className={cn('mt-0.5 text-2xl leading-none', plan.featured ? 'text-teal-50' : 'text-[#0e5653]')}>✓</span>
                <span>{point}</span>
              </li>
            ))}
          </ul>

          {plan.note ? (
            <p className={cn('mt-6 text-base leading-relaxed md:text-lg', plan.featured ? 'text-teal-50/95' : 'text-neutral-700')}>
              <strong>Best for:</strong> {plan.note}
            </p>
          ) : null}

          <div className="mt-auto pt-8">
            <Button
              className={cn(
                'w-auto rounded-md px-6 py-3 text-base font-semibold normal-case tracking-normal',
                plan.featured ? 'bg-[#d8e2b8] text-[#11453f] hover:bg-[#ccd7a8] focus:ring-white' : 'bg-[#0d5753] text-white hover:bg-[#0a4946]'
              )}
              href={plan.ctaHref}
            >
              {plan.ctaLabel}
            </Button>
          </div>
        </article>
      ))}
    </div>
  )
}
