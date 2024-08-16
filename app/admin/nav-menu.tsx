import permissions from "@/config/permission";
import { combine } from "@/lib/utils/auth";
import { Briefcase, Dock, Lock, User, LayoutDashboard } from "lucide-react";

const iconClasses = "h-5 w-5";

export const navMenuItems = [
  {
    label: "Dashbaord",
    href: "/admin",
    icon: <LayoutDashboard className={iconClasses} />,
    permissions: combine(
      permissions.models.getBlocksWithModel,
      permissions.jobs.getBookingsWithJob,
    ),
  },
  {
    label: "Models",
    href: "/admin/models",
    icon: <User className={iconClasses} />,
    permissions: permissions.models.getModels,
  },
  {
    label: "Jobs",
    href: "/admin/jobs",
    icon: <Briefcase className={iconClasses} />,
    permissions: permissions.jobs.getJobs,
  },
  {
    label: "Users",
    href: "/admin/users",
    icon: <Lock className={iconClasses} />,
    permissions: permissions.users.getUsers,
  },
  {
    label: "Applications",
    href: "/admin/applications",
    icon: <Dock className={iconClasses} />,
    permissions: permissions.applications.getApplications,
  },
];
