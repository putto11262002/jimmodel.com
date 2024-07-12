import { UserRole, userRoles } from "@/db/schemas";

export const UserActions = {
  updatePasswordById: "update-password-by-id",
  updateRoleById: "update-role-by-id",
  addImageById: "add-image-by-id",
} as const;

const userPermissions: { [key in keyof typeof UserActions]: UserRole[] } = {
  updatePasswordById: ["admin"],
  updateRoleById: ["admin"],
  addImageById: ["admin"],
} as const;

// Emptry array = only authentication is required
// Null = no authentication required
const permissions = {
  users: userPermissions,
} as const;

export default permissions;
