import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Briefcase, Lock, User } from "lucide-react";
import UserMenu from "./user-menu";

const iconClasses = "h-5 w-5";

const navMenuItems = [
  {
    label: "Models",
    href: "/admin/models",
    icon: <User className={iconClasses} />,
  },
  {
    label: "Jobs",
    href: "/admin/jobs",
    icon: <Briefcase className={iconClasses} />,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: <Lock className={iconClasses} />,
  },
];

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 z-20 hidden w-14  border-r bg-background sm:flex flex-col">
      <NavMenu navItems={navMenuItems} />
      <UserMenu />
    </aside>
  );
}

function NavMenu<T extends { className?: string | undefined }>({
  navItems,
}: {
  navItems: {
    label: string;
    href: string;
    icon: React.ComponentElement<T, any>;
  }[];
}) {
  return (
    <nav className="">
      <ul className="flex flex-col items-center gap-6 sm:py-5">
        {navItems.map((item) => (
          <li key={item.label}>
            <NavMenuItem label={item.label} href={item.href} icon={item.icon} />
          </li>
        ))}
      </ul>
    </nav>
  );
}

function NavMenuItem<T extends { className?: string | undefined }>({
  label,
  href,
  icon,
}: {
  label: string;
  href: string;
  icon: React.ComponentElement<T, any>;
}) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={href}
          className="flex items-center justify-center rounded-lg text-muted-foreground transition-colors hover:text-foreground hover:bg-gray-100"
        >
          {icon}
          <span className="sr-only">{label}</span>
        </Link>
      </TooltipTrigger>
      <TooltipContent className="" side="right">
        {label}
      </TooltipContent>
    </Tooltip>
  );
}
