"use client";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { useParams, usePathname } from "next/navigation";

const forms = {
  General: (id: string) => `/admin/jobs/update/${id}`,
  Booking: (id: string) => `/admin/jobs/update/${id}/booking`,
};
export default function JobFormMenu() {
  const { id } = useParams<{ id: string }>();
  const path = usePathname();

  return (
    <ul className="bg-muted inline-flex items-center gap-2 rounded p-1 font-medium">
      {Object.entries(forms).map(([label, getPath], index) => (
        <Link key={index} href={getPath(id)}>
          <li
            className={cn(
              "cursor-pointer text-muted-foreground bg-muted py-1 px-4 rounded text-sm",
              path === getPath(id) && "bg-background text-foreground",
            )}
          >
            {label}
          </li>
        </Link>
      ))}
    </ul>
  );
}
