import { LinkMenuItem } from "@/components/shared/types/menu";
import permissions from "@/config/permission";
import routes from "@/config/routes";
import { union } from "lodash";
import {
  Briefcase,
  Dock,
  Lock,
  User,
  LayoutDashboard,
  StickyNote,
  Image,
  Send,
  HardDrive,
} from "lucide-react";

const iconClasses = "h-5 w-5";

export const navMenuItems: LinkMenuItem[] = [
  {
    label: "Dashbaord",
    href: "/admin",
    icon: <LayoutDashboard className={iconClasses} />,
    permissions: union(
      permissions.models.getBlocksWithModel,
      permissions.jobs.getBookingsWithJob
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
  {
    label: "Website",
    href: routes.admin.website.main,
    icon: <HardDrive className={iconClasses} />,
    permissions: permissions.showcases.getShowcases,
  },
  {
    label: "Contacts",
    href: "/admin/contacts",
    icon: <Send className={iconClasses} />,
    permissions: permissions.contactMessages.getContactMessages,
  },
];
