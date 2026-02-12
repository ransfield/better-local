import { Card } from '@/components/ui/card'

export function FeatureGrid(props: { items: { title: string; body: string }[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {props.items.map((it) => (
        <Card key={it.title}>
          <h3 className="text-lg font-semibold">{it.title}</h3>
          <p className="mt-2 text-neutral-700">{it.body}</p>
        </Card>
      ))}
    </div>
  )
}
