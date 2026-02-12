import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function CtaBanner(props: { title: string; body?: string; cta: { label: string; href: string } }) {
  return (
    <Card className="bg-neutral-50">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-xl font-semibold">{props.title}</h3>
          {props.body ? <p className="mt-1 text-neutral-700">{props.body}</p> : null}
        </div>
        <Button href={props.cta.href}>{props.cta.label}</Button>
      </div>
    </Card>
  )
}
