import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:px-10">
      <div className="mx-auto w-full max-w-4xl gap-4 grid">
        <div>
          <Link href={`/admin/jobs/update/${id}/bookings`}>
            <Button variant={"outline"} size={"icon"}>
              <ChevronLeft className="w-4 h-4" />
            </Button>
          </Link>
        </div>
        {children}
      </div>
    </main>
  );
}
