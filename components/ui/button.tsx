import Link from 'next/link'
import { cn } from '@/components/ui/cn'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ className, variant = 'primary', href, ...props }: Props) {
  const base =
    'inline-flex items-center justify-center rounded-sm px-4 py-2.5 text-sm font-semibold no-underline transition focus:outline-none focus:ring-2 focus:ring-offset-2'

  const styles =
    variant === 'primary'
      ? 'bg-black text-white hover:bg-neutral-800 focus:ring-black'
      : variant === 'secondary'
        ? 'border border-neutral-900 bg-white text-black hover:bg-neutral-100 focus:ring-neutral-500'
        : 'bg-transparent text-black hover:bg-neutral-100 focus:ring-neutral-400'

  if (href) {
    return (
      <Link className={cn(base, styles, className)} href={href}>
        {props.children}
      </Link>
    )
  }

  return <button className={cn(base, styles, className)} {...props} />
}
