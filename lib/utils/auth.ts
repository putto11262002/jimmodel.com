import { UserRole } from "@/db/schemas";
import { intersection } from "lodash";

export const hasPermission = (
  required: UserRole[],
  target: UserRole[] | null,
): boolean => {
  return intersection(required, target).length > 0;
};
