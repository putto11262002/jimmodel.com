import { Briefcase, Dock, Lock, User, LayoutDashboard } from "lucide-react";

const iconClasses = "h-5 w-5";

export const navMenuItems = [
  {
    label: "Dashbaord",
    href: "/admin",
    icon: <LayoutDashboard className={iconClasses} />,
  },
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
  {
    label: "Applications",
    href: "/admin/applications",
    icon: <Dock className={iconClasses} />,
  },
];
