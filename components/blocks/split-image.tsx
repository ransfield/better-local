import Image from 'next/image'
import { cn } from '@/components/ui/cn'

export function SplitImage(props: {
  title: string
  body: string
  imageSrc: string
  imageAlt: string
  reverse?: boolean
}) {
  return (
    <div className="card-surface overflow-hidden p-0">
      <div className="grid md:grid-cols-2 md:items-stretch">
        <div className={cn('p-6 md:p-8', props.reverse ? 'md:order-2' : '')}>
        <h3 className="font-display text-xl font-semibold text-[var(--color-dark)] md:text-2xl">{props.title}</h3>
        <p className="mt-3 text-base leading-relaxed text-[var(--color-text-secondary)]">{props.body}</p>
      </div>
      <div className={cn('relative min-h-[280px] bg-[var(--color-bg-alt)] md:min-h-[360px]', props.reverse ? 'md:order-1' : '')}>
          <Image
            src={props.imageSrc}
            alt={props.imageAlt}
            fill
            className="pointer-events-none object-cover object-center select-none"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
      </div>
      </div>
    </div>
  )
}
