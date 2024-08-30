import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { ContactMessageFilterQuerySchema } from "@/lib/validators/contact-message";
import Link from "next/link";

export default function FilterSection({
  searchParams,
}: {
  searchParams: Record<string, string | string[]>;
}) {
  const { read } = ContactMessageFilterQuerySchema.parse(searchParams);
  return (
    <div className="flex">
      <ToggleGroup
        className="border p-1 rounded-md"
        size={"sm"}
        value={typeof read === "boolean" ? (read ? "read" : "unread") : "all"}
        type="single"
      >
        <Link href={`/admin/contacts?page=1`}>
          <ToggleGroupItem value={"all"}>All</ToggleGroupItem>
        </Link>
        <Link href={`/admin/contacts?page=1&read=false`}>
          <ToggleGroupItem value={"unread"}>Unread</ToggleGroupItem>
        </Link>
        <Link href={`/admin/contacts?page=1&read=true`}>
          <ToggleGroupItem value={"read"}>Read</ToggleGroupItem>
        </Link>
      </ToggleGroup>
    </div>
  );
}
