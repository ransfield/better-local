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
    <div className={cn('space-y-0', className)}>
      {items.map((item, idx) => (
        <article
          key={item.question}
          data-open={openIndex === idx ? 'true' : 'false'}
          className="faq-item stagger-item overflow-hidden"
        >
          <button
            type="button"
            aria-expanded={openIndex === idx}
            aria-controls={`faq-answer-${idx}`}
            onClick={(event) => {
              event.preventDefault()
              setOpenIndex((prev) => (prev === idx ? -1 : idx))
            }}
            className="faq-question text-left"
          >
            <span>{item.question}</span>
            <span className={cn('faq-icon', openIndex === idx && 'rotate-45')}>
              +
            </span>
          </button>
          {openIndex === idx ? (
            <div id={`faq-answer-${idx}`} className="faq-answer">
              {item.answer}
            </div>
          ) : null}
        </article>
      ))}
    </div>
  )
}
