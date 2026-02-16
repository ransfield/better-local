import { Container } from '@/components/ui/container'

export function Section({ children }: { children: React.ReactNode }) {
  return <Container className="py-12">{children}</Container>
}
