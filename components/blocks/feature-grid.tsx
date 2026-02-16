import { cn } from '@/components/ui/cn'

export function FeatureGrid(props: { items: { title: string; body: string }[]; columns?: 2 | 3; compact?: boolean }) {
  const columns = props.columns ?? 2

  return (
    <div className={cn('grid gap-4', columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2')}>
      {props.items.map((it, idx) => (
        <article
          key={it.title}
          className={cn(
            'rounded-2xl border border-neutral-200/60 bg-white p-6 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md',
            idx % 3 === 1 ? 'bg-neutral-50' : ''
          )}
        >
          <h3 className="font-display text-base font-semibold leading-tight text-black">
            {it.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-neutral-600">{it.body}</p>
        </article>
      ))}
    </div>
  )
}
