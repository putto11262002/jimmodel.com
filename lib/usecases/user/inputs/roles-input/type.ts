import { User } from "@/lib/domains";

export type UserRolesUpdateInput = {
  roles: Exclude<User["roles"][number], "root">[];
};
