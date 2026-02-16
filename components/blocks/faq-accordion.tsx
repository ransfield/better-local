'use client'

import { useState } from 'react'
import { cn } from '@/components/ui/cn'

type FAQItem = {
  question: string
  answer: string
}

type FAQAccordionProps = {
  items: FAQItem[]
  className?: string
}

export function FAQAccordion({ items, className }: FAQAccordionProps) {
  const [openIndex, setOpenIndex] = useState(0)

  return (
    <div className={cn('space-y-3', className)}>
      {items.map((item, idx) => (
        <article key={item.question} className="overflow-hidden rounded-xl bg-neutral-100">
          <button
            type="button"
            aria-expanded={openIndex === idx}
            aria-controls={`faq-answer-${idx}`}
            onClick={(event) => {
              event.preventDefault()
              setOpenIndex((prev) => (prev === idx ? -1 : idx))
            }}
            className="flex w-full items-center justify-between gap-4 px-6 py-6 text-left transition hover:bg-neutral-200/40 md:px-8"
          >
            <span className="font-display text-xl font-semibold leading-snug text-neutral-900 md:text-2xl">{item.question}</span>
            <span className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-neutral-200 text-3xl leading-none text-neutral-700">
              {openIndex === idx ? '↑' : '↓'}
            </span>
          </button>
          {openIndex === idx ? (
            <div id={`faq-answer-${idx}`} className="px-6 pb-7 text-base leading-relaxed text-neutral-600 md:px-8 md:text-lg">
              {item.answer}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  )
}
