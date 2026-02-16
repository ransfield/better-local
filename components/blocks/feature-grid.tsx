import { cn } from '@/components/ui/cn'

export function FeatureGrid(props: { items: { title: string; body: string }[]; columns?: 2 | 3; compact?: boolean }) {
  const columns = props.columns ?? 2

  return (
    <div className={cn('grid gap-4', columns === 3 ? 'sm:grid-cols-2 lg:grid-cols-3' : 'sm:grid-cols-2')}>
      {props.items.map((it) => (
        <article
          key={it.title}
          className="card-surface stagger-item p-8"
        >
          <h3 className="font-display text-base font-semibold leading-tight text-[var(--color-dark)]">
            {it.title}
          </h3>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-text-secondary)]">{it.body}</p>
        </article>
      ))}
    </div>
  )
}
