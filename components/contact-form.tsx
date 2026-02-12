'use client'

import { useFormState } from 'react-dom'
import { submitContact, type ContactState } from '@/app/actions'
import { cn } from '@/components/ui/cn'

const initial: ContactState | null = null

export function ContactForm() {
  const [state, action] = useFormState(submitContact, initial)
  const errors = state && !state.ok ? state.fieldErrors : undefined

  return (
    <form action={action} className="mt-6 grid gap-4">
      <div className="grid gap-1">
        <label className="text-sm font-medium" htmlFor="name">
          Name
        </label>
        <input id="name" name="name" className={inputClass(errors?.name)} placeholder="Jane Doe" required />
        {errors?.name ? <p className="text-sm text-red-600">{errors.name}</p> : null}
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className={inputClass(errors?.email)}
          placeholder="jane@email.com"
          required
        />
        {errors?.email ? <p className="text-sm text-red-600">{errors.email}</p> : null}
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium" htmlFor="phone">
          Phone (optional)
        </label>
        <input id="phone" name="phone" className={inputClass(errors?.phone)} placeholder="(555) 123-4567" />
      </div>

      <div className="grid gap-1">
        <label className="text-sm font-medium" htmlFor="message">
          Message
        </label>
        <textarea
          id="message"
          name="message"
          rows={6}
          className={inputClass(errors?.message)}
          placeholder="How can we help?"
          required
        />
        {errors?.message ? <p className="text-sm text-red-600">{errors.message}</p> : null}
      </div>

      <input name="company" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <input name="turnstileToken" className="hidden" tabIndex={-1} autoComplete="off" aria-hidden="true" />

      <button className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:bg-neutral-800" type="submit">
        Send message
      </button>

      {state ? <p className={cn('text-sm', state.ok ? 'text-green-700' : 'text-neutral-700')}>{state.message}</p> : null}
    </form>
  )
}

function inputClass(error?: string) {
  return cn(
    'rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-black',
    error ? 'border-red-400 focus:ring-red-400' : 'border-neutral-300'
  )
}
