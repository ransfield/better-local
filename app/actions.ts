'use server'

import { z } from 'zod'
import { Resend } from 'resend'
import { getSite } from '@/lib/site'
import { verifyTurnstile } from '@/lib/turnstile'

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  phone: z.string().optional().or(z.literal('')),
  message: z.string().min(10),
  company: z.string().optional().or(z.literal('')),
  turnstileToken: z.string().optional().or(z.literal(''))
})

export type ContactState =
  | { ok: true; message: string }
  | { ok: false; message: string; fieldErrors?: Record<string, string> }

export async function submitContact(
  _prevState: ContactState | null,
  formData: FormData
): Promise<ContactState> {
  const raw = Object.fromEntries(formData.entries())
  const parsed = schema.safeParse(raw)

  if (!parsed.success) {
    const fieldErrors: Record<string, string> = {}
    for (const issue of parsed.error.issues) {
      const key = String(issue.path[0] ?? 'form')
      fieldErrors[key] = issue.message
    }
    return { ok: false, message: 'Please fix the highlighted fields.', fieldErrors }
  }

  const { name, email, phone, message, company, turnstileToken } = parsed.data

  // Honeypot: if filled, silently succeed (treat as spam)
  if (company && company.trim().length > 0) {
    return { ok: true, message: 'Thanks. We will get back to you shortly.' }
  }

  // Turnstile verification (optional)
  const turnstileOk = await verifyTurnstile(turnstileToken || '')
  if (!turnstileOk) {
    return { ok: false, message: 'Spam protection check failed. Please try again.' }
  }

  const site = await getSite()
  const toEmail = process.env.EMAIL_TO || site.contact.toEmail

  if (!process.env.RESEND_API_KEY || !toEmail || !process.env.EMAIL_FROM) {
    return {
      ok: false,
      message: 'Email is not configured for this site yet (missing RESEND_API_KEY / EMAIL_FROM / EMAIL_TO).'
    }
  }

  const resend = new Resend(process.env.RESEND_API_KEY)
  const subject = `New website inquiry - ${site.business.name}`
  const text = [
    `Name: ${name}`,
    `Email: ${email}`,
    phone ? `Phone: ${phone}` : null,
    '',
    message
  ]
    .filter(Boolean)
    .join('\n')

  await resend.emails.send({
    from: process.env.EMAIL_FROM,
    to: toEmail,
    replyTo: email,
    subject,
    text
  })

  return { ok: true, message: 'Thanks. Your message has been sent.' }
}
