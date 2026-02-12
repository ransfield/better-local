import { cn } from '@/components/ui/cn'

export function Container({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('container', className)} {...props} />
}
