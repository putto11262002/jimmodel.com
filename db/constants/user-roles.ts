import { generateLabelsMap, generateLabelValuePairs } from "./utils";

export const USER_ROLE = {
  ROOT: "root",
  ADMIN: "admin",
  STAFF: "staff",
  IT: "IT",
} as const;

export const USER_ROLES = [
  USER_ROLE.ROOT,
  USER_ROLE.ADMIN,
  USER_ROLE.STAFF,
  USER_ROLE.IT,
] as const;

export const USER_ROLE_LABELS = generateLabelsMap(USER_ROLES);

export const USER_ROLE_LABEL_VALUE_PAIRS = generateLabelValuePairs(USER_ROLES);
