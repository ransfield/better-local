import { Button } from '@/components/ui/button'

export function CtaBanner(props: { title: string; body?: string; cta: { label: string; href: string } }) {
  return (
    <div className="not-prose rounded-2xl border border-neutral-800 bg-[var(--color-dark)] p-7 text-[var(--color-bg)] shadow-sm md:p-9">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-display text-xl font-semibold text-[var(--color-bg)] md:text-2xl">{props.title}</h3>
          {props.body ? <p className="mt-2 text-base leading-relaxed text-[var(--color-bg-alt)] md:text-lg">{props.body}</p> : null}
        </div>
        <Button className="shrink-0 !bg-[#ebebd5] !text-[#004943] hover:!bg-[#dfdfc7] hover:!text-[#004943]" href={props.cta.href}>
          {props.cta.label}
        </Button>
      </div>
    </div>
  )
}
