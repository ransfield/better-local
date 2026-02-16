import { cn } from '@/components/ui/cn'

export function Card({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('border border-neutral-300 bg-white p-6 shadow-none', className)} {...props} />
}
