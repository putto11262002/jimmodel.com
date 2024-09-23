import Container from "@/components/container";
import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <Container max="liquid" className="grid gap-4">
      <Skeleton className="h-6 w-1/2" />
      <Skeleton className="h-8 w-full" />
    </Container>
  );
}
