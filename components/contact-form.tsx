'use client'

import { useFormState } from 'react-dom'
import { submitContact, type ContactState } from '@/app/actions'
import { cn } from '@/components/ui/cn'
import site from '@/content/site.json'

const initial: ContactState | null = null

type ContactFormProps = {
  heading?: string
  subheading?: string
  showPhoneLine?: boolean
  theme?: 'dark' | 'light'
}

export function ContactForm({ heading, subheading, showPhoneLine = false, theme = 'dark' }: ContactFormProps) {
  const [state, action] = useFormState(submitContact, initial)
  const errors = state && !state.ok ? state.fieldErrors : undefined
  const phone = site.business.phone
  const phoneHref = phone ? `tel:${phone.replace(/[^\d+]/g, '')}` : undefined

  return (
    <div className={cn('form-container', theme === 'light' && 'form-container-light')}>
      {heading ? (
        <div className="mb-6">
          <h3 className={cn('font-display text-3xl font-normal tracking-tight md:text-4xl', theme === 'light' ? 'text-[#111]' : 'text-white')}>
            {heading}
          </h3>
          {subheading ? (
            <p className={cn('mt-3 text-sm leading-relaxed md:text-base', theme === 'light' ? 'text-[var(--color-text-secondary)]' : 'text-white/70')}>
              {subheading}
            </p>
          ) : null}
        </div>
      ) : null}
      <form action={action} className="grid gap-4">
        <div className="grid gap-1">
          <label className={cn('text-xs font-normal tracking-wide', theme === 'light' ? 'text-[var(--color-text-secondary)]' : 'text-white/70')} htmlFor="name">
            Name
          </label>
          <input id="name" name="name" className={inputClass(errors?.name, theme)} placeholder="Jane Doe" required />
          {errors?.name ? <p className="text-sm text-red-300">{errors.name}</p> : null}
        </div>

        <div className="grid gap-1">
          <label className={cn('text-xs font-normal tracking-wide', theme === 'light' ? 'text-[var(--color-text-secondary)]' : 'text-white/70')} htmlFor="email">
            Email
          </label>
          <input
            id="email"
            name="email"
            type="email"
            className={inputClass(errors?.email, theme)}
            placeholder="jane@email.com"
            required
          />
          {errors?.email ? <p className="text-sm text-red-300">{errors.email}</p> : null}
        </div>

        <div className="grid gap-1">
          <label className={cn('text-xs font-normal tracking-wide', theme === 'light' ? 'text-[var(--color-text-secondary)]' : 'text-white/70')} htmlFor="phone">
            Phone (optional)
          </label>
          <input id="phone" name="phone" className={inputClass(errors?.phone, theme)} placeholder="(555) 123-4567" />
        </div>

        <div className="grid gap-1">
          <label className={cn('text-xs font-normal tracking-wide', theme === 'light' ? 'text-[var(--color-text-secondary)]' : 'text-white/70')} htmlFor="message">
            Message
          </label>
          <textarea
            id="message"
            name="message"
            rows={6}
            className={inputClass(errors?.message, theme)}
            placeholder="How can we help?"
            required
          />
          {errors?.message ? <p className="text-sm text-red-300">{errors.message}</p> : null}
        </div>

        <input name="company" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
        <input name="turnstileToken" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

        <button className="form-submit" type="submit">
          Send message
        </button>

        {state ? <p className={cn('text-sm', state.ok ? (theme === 'light' ? 'text-[var(--color-accent)]' : 'text-[var(--color-accent-light)]') : 'text-red-300')}>{state.message}</p> : null}
        {showPhoneLine && phoneHref ? (
          <p className={cn('text-xs', theme === 'light' ? 'text-[var(--color-text-secondary)]' : 'text-white/75')}>
            Prefer to talk?{' '}
            <a
              className={cn(
                'font-medium underline underline-offset-4',
                theme === 'light' ? 'text-[#111] hover:text-[var(--color-accent)]' : 'text-white hover:text-[var(--color-accent-light)]'
              )}
              href={phoneHref}
            >
              Call us on {phone}
            </a>
          </p>
        ) : null}
      </form>
    </div>
  )
}

function inputClass(error: string | undefined, theme: 'dark' | 'light') {
  return cn(
    theme === 'light' ? 'form-input-light' : 'form-input',
    error ? '!border-red-400 !shadow-[0_0_0_3px_rgba(248,113,113,0.2)]' : ''
  )
}
