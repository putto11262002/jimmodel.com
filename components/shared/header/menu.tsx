"use client";
import { AuthUser, checkPermission } from "@/lib/auth";
import { LinkMenuItem } from "../types/menu";
import Container from "@/components/container";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export default function Menu({
  user,
  items,
}: {
  user: AuthUser;
  items?: (LinkMenuItem & { isActive?: boolean })[];
}) {
  const filteredItems = items?.filter(
    (item) => checkPermission(user, item.permissions) === "success"
  );
  const path = usePathname();

  // Helper function to determine if an item is active
  const active = filteredItems
    ?.filter((item) => path.startsWith(item.href))
    .sort()
    .reverse()[0]?.href;
  return filteredItems ? (
    <div className=" ">
      <Container
        max={"liquid"}
        className="flex items-center py-0 max-w-full overflow-x-auto no-scrollbar"
      >
        {filteredItems.map((item, index) => (
          <div
            className={cn(
              "px-4 first:pl-0 pb-2 border-b text-sm text-muted-foreground",
              (item.isActive || active === item.href) &&
                "text-primary font-medium border-b-2 border-b-primary"
            )}
            key={index}
          >
            <Link href={item.href} key={index}>
              {item.label}
            </Link>
          </div>
        ))}
      </Container>
    </div>
  ) : null;
}
