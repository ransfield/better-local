import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'

export function CtaBanner(props: { title: string; body?: string; cta: { label: string; href: string } }) {
  return (
    <Card className="not-prose rounded-none border-2 border-black bg-neutral-950 p-7 text-white md:p-9">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold text-white md:text-2xl">{props.title}</h3>
          {props.body ? <p className="mt-2 text-base leading-relaxed text-neutral-200 md:text-lg">{props.body}</p> : null}
        </div>
        <Button className="shrink-0 bg-white !text-black hover:bg-neutral-100 focus:ring-white" href={props.cta.href}>
          {props.cta.label}
        </Button>
      </div>
    </Card>
  )
}
