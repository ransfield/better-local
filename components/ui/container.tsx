import { cn } from '@/components/ui/cn'

type ContainerSize = 'wide' | 'read'

export function Container({
  className,
  size = 'wide',
  ...props
}: React.HTMLAttributes<HTMLDivElement> & { size?: ContainerSize }) {
  const widthClass = size === 'read' ? 'max-w-[720px]' : 'max-w-[1120px]'
  return <div className={cn('mx-auto w-full px-6', widthClass, className)} {...props} />
}
