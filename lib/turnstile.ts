export async function verifyTurnstile(token: string): Promise<boolean> {
  const siteKey = process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY
  const secret = process.env.TURNSTILE_SECRET_KEY

  // Not configured => do not block (honeypot still runs)
  if (!siteKey || !secret) return true

  // Configured but missing token => block
  if (!token) return false

  const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', {
    method: 'POST',
    headers: { 'content-type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({ secret, response: token })
  })

  if (!res.ok) return false
  const data = (await res.json()) as { success?: boolean }
  return Boolean(data.success)
}
