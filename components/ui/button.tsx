import Link from 'next/link'
import { cn } from '@/components/ui/cn'

type Props = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  href?: string
  variant?: 'primary' | 'secondary' | 'ghost'
}

export function Button({ className, variant = 'primary', href, ...props }: Props) {
  const base =
    'inline-flex items-center justify-center no-underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-[var(--color-bg)]'

  const styles =
    variant === 'primary'
      ? 'btn-primary focus:ring-[var(--color-accent)]'
      : variant === 'secondary'
        ? 'btn-secondary focus:ring-[var(--color-accent)]'
        : 'rounded-[10px] bg-transparent px-4 py-2.5 text-[15px] font-medium text-[var(--color-dark)] transition hover:bg-[var(--color-accent-light)] focus:ring-[var(--color-accent)]'

  if (href) {
    return (
      <Link className={cn(base, styles, className)} href={href}>
        {props.children}
      </Link>
    )
  }

  return <button className={cn(base, styles, className)} {...props} />
}
