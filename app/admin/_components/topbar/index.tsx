"use client";
import UserAvatar from "@/components/user/user-avatar";
import MobileNavMenu from "./mobile-nav-menu";
import useSession from "@/hooks/use-session";
import { Skeleton } from "@/components/ui/skeleton";
import { BreadcrumbDisplay } from "@/components/breadcrumb";

export default function TopBar() {
  const { status, data } = useSession();
  return (
    <header className="sticky top-0 z-10 flex items-center gap-4 border-b bg-background px-4 sm:static sm:h-auto sm:px-6 ">
      <div className="h-14 flex items-center gap-4 w-full">
        <MobileNavMenu />

        <div>
          <BreadcrumbDisplay />
        </div>
        <div className="ml-auto">
          {status === "loading" ? (
            <Skeleton className="w-[32px] h-[32px] rounded-full " />
          ) : (
            <UserAvatar
              rounded
              size="small"
              user={{
                image: data?.user?.image ? { id: data?.user?.image } : null,
                name: data.user.name,
              }}
            />
          )}
        </div>
      </div>
    </header>
  );
}
