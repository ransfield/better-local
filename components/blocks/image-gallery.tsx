import Image from 'next/image'

type ImageGalleryItem = {
  src: string
  alt: string
  caption?: string
}

export function ImageGallery(props: { items: ImageGalleryItem[] }) {
  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {props.items.map((image) => (
        <figure key={image.src} className="card-surface stagger-item group overflow-hidden p-0">
          <div className="relative aspect-[4/3] overflow-hidden">
            <Image
              src={image.src}
              alt={image.alt}
              fill
              className="object-cover transition duration-500 group-hover:scale-105"
              sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            />
          </div>
          {image.caption ? <figcaption className="px-3 py-2 text-xs font-semibold text-[var(--color-text-secondary)]">{image.caption}</figcaption> : null}
        </figure>
      ))}
    </div>
  )
}
