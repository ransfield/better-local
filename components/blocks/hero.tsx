import { Button } from '@/components/ui/button'
import { Container } from '@/components/ui/container'

export function Hero(props: {
  title: string
  subtitle?: string
  primaryCta?: { label: string; href: string }
  secondaryCta?: { label: string; href: string }
}) {
  return (
    <div className="bg-gradient-to-b from-neutral-50 to-white">
      <Container className="py-16">
        <h1 className="text-4xl font-semibold tracking-tight sm:text-5xl">{props.title}</h1>
        {props.subtitle ? <p className="mt-4 max-w-2xl text-lg text-neutral-700">{props.subtitle}</p> : null}
        <div className="mt-8 flex flex-wrap gap-3">
          {props.primaryCta ? <Button href={props.primaryCta.href}>{props.primaryCta.label}</Button> : null}
          {props.secondaryCta ? (
            <Button variant="secondary" href={props.secondaryCta.href}>
              {props.secondaryCta.label}
            </Button>
          ) : null}
        </div>
      </Container>
    </div>
  )
}
