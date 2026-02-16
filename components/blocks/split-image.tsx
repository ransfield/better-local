import Image from 'next/image'

export function SplitImage(props: {
  title: string
  body: string
  imageSrc: string
  imageAlt: string
  reverse?: boolean
}) {
  return (
    <div className="grid gap-6 md:grid-cols-2 md:items-center">
      <div className={props.reverse ? 'md:order-2' : ''}>
        <h3 className="font-display text-xl font-semibold text-black md:text-2xl">{props.title}</h3>
        <p className="mt-3 text-base leading-relaxed text-neutral-700">{props.body}</p>
      </div>
      <div className={props.reverse ? 'md:order-1' : ''}>
        <div className="relative aspect-[4/3] overflow-hidden rounded-lg border border-neutral-300 bg-neutral-100">
          <Image
            src={props.imageSrc}
            alt={props.imageAlt}
            fill
            className="pointer-events-none object-cover select-none"
            sizes="(min-width: 768px) 50vw, 100vw"
          />
        </div>
      </div>
    </div>
  )
}
