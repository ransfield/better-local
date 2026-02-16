import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="container py-20">
      <h1 className="text-3xl font-semibold">Page not found</h1>
      <p className="mt-3 text-neutral-700">The page you are looking for does not exist.</p>
      <Link className="mt-6 inline-block underline" href="/">
        Go home
      </Link>
    </div>
  )
}
