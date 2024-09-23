import { Permission } from "@/lib/auth";

export type LinkMenuItem = {
  label: string;
  href: string;
  permissions?: Permission;
  icon?: React.ReactNode;
};
