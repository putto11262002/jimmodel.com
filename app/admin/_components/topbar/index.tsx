import MobileNavMenu from "./mobile-nav-menu";
import webConfig from "@/config/web";
import { AuthUser } from "@/lib/auth";
import Avatar from "@/components/avatar";
import { LinkMenuItem } from "@/components/shared/types/menu";
import { UserMenu } from "../user-menu";

export default async function TopBar({
  user,
  navItems,
}: {
  user: AuthUser;
  navItems: LinkMenuItem[];
}) {
  return (
    <header className="sticky border-box bg-background top-0 z-10 h-14 flex md:hidden items-center gap-4 border-b px-4 sm:px-6">
      <div className="flex items-center gap-4 w-full">
        <MobileNavMenu navItems={navItems} />
        {/* <div> */}
        {/*   <h1 className="text-lg font-bold">{webConfig.companyName}</h1> */}
        {/* </div> */}
        <div className="ml-auto">
          <UserMenu user={user} />
        </div>
      </div>
    </header>
  );
}
