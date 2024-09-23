import { AuthUser, Permission } from "./";
import { intersection } from "lodash";

/**
 * Checks whether a user is authorized to perform an action based on their roles
 * and a custom authentication function.
 *
 * @param {AuthUser | null | undefined} user - The authenticated user object,
 * which may be null or undefined if the user is not logged in.
 * @param {UserRole[] | undefined} requiredPermission - An optional array of roles
 * required to perform the action. If undefined, the action is public and accessible by anyone.
 * @param {(user: AuthUser) => boolean} authFn - An optional custom function that further
 * validates the user's authorization based on additional criteria.
 *
 * @returns {boolean} - Returns true if the user has the necessary permissions,
 * or if the action is public, or if the custom auth function returns true.
 *
 * The function follows these steps to determine authorization:
 * 1. If `requiredPermission` is not provided, the action is public and no permissions
 *    are required, so it returns `true`.
 * 2. If the user is not authenticated (`user` is null or undefined), the function returns `false`.
 * 3. If the `requiredPermission` array is empty, meaning any authenticated user is allowed,
 *    the function returns `true`.
 * 4. The user's roles are checked against the required permissions. If the roles do not intersect,
 *    meaning the user does not have any of the required roles, the function returns `false`.
 * 5. If an `authFn` is provided, it is used for further validation. The function will return
 *    the result of `authFn(user)` if defined, otherwise it defaults to `true`.
 */
export const checkAuth = (
  user?: AuthUser | null,
  requiredPermission?: Permission,
  authFn?: (user: AuthUser) => "success" | "forbidden"
): "success" | "unauthenticatead" | "forbidden" => {
  // Public action
  if (!requiredPermission) {
    return "success";
  }

  // User is not authenticated
  if (!user) {
    return "unauthenticatead";
  }

  // Only required authenticated user
  if (requiredPermission.length === 0) {
    return "success";
  }
  return checkPermission(user, requiredPermission, authFn);
};

/**
 * Assumed user is authenticated
 */
export const checkPermission = (
  user: AuthUser,
  requiredPermission: Permission,
  fn?: (user: AuthUser) => "success" | "forbidden"
): "success" | "forbidden" => {
  if (!requiredPermission || requiredPermission.length === 0) {
    return "success";
  }
  // Check if the user roles intersect with the required permission
  if (intersection(user.roles, requiredPermission).length < 1) {
    return "forbidden";
  }

  return fn ? fn(user) : "success";
};
