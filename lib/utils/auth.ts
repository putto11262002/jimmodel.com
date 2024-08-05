import { UserRole } from "@/db/schemas";
import { intersection, union } from "lodash";

export const hasPermission = (
  required: UserRole[] | null,
  target: UserRole[] | null,
): boolean => {
  if (required === null) {
    return true;
  }
  if (required.length === 0) {
    return true;
  }
  return intersection(required, target).length > 0;
};

export const combine = (...perms: UserRole[][]): UserRole[] => {
  return union(...perms);
};
