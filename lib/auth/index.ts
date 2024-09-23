import NextAuth from "next-auth";
import "next-auth/jwt";
import { UserUseCase } from "@/lib/usecases";
import Credentials from "next-auth/providers/credentials";
import { AuthenticationError } from "../errors/authentication-error";
import { revalidatePath } from "next/cache";
import "@auth/core/adapters";
import { User } from "@/lib/domains";
import { redirect } from "next/navigation";
import { checkAuth, checkPermission } from "./utils";
import { ForbiddenError } from "../errors";

export type AuthUser = Pick<
  User,
  "roles" | "id" | "name" | "imageId" | "email" | "username"
>;

/**
 * This type represents the permissions required to access a route.
 *
 * - `UserRole[]`: An array of user roles that indicates the required roles
 *   for accessing the route.
 * - If the array is empty, it signals that the route is accessible
 *     to any authenticated user, regardless of their role.
 * - `null`: Signals that the route is public and accessible to all users,
 *   whether authenticated or not.
 * - `undefined`: Also signals that the route is public, similar to `null`.
 */
export type Permission = User["roles"] | null | undefined;

declare module "@auth/core/adapters" {
  interface AdapterUser extends AuthUser {}
}

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: AuthUser;
  }

  interface User extends AuthUser {}
}

declare module "@auth/core/types" {
  interface User extends AuthUser {}
}

declare module "next-auth/jwt" {
  interface JWT extends AuthUser {}
}

const initAuth = ({ userUseCase }: { userUseCase: UserUseCase }) => {
  const returned = NextAuth({
    providers: [
      Credentials({
        credentials: {
          username: {},
          password: {},
        },
        authorize: async (credentails) => {
          const user = await userUseCase.findByUsernameOrEmail(
            credentails.username as string
          );
          if (user === null) {
            throw new AuthenticationError("invalid credentials");
          }

          const matched = await userUseCase.comparePassword(
            user.id,
            credentails.password as string
          );
          if (!matched) {
            throw new AuthenticationError("invalid credentials");
          }

          revalidatePath("/admin");

          return { ...user, image: user.imageId }; // Quick fix for image as string
        },
      }),
    ],
    callbacks: {
      jwt: ({ user, token }) => {
        if (user?.id !== undefined) {
          token.id = user.id;
          token.roles = user.roles;
          token.name = user.name;
          token.imageId = user.imageId;
          token.username = user.username;
          token.email = user.email;
          return token;
        }
        return token;
      },
      session: ({ session, token }) => {
        session.user = {
          id: token.id,
          roles: token.roles,
          name: token.name!,
          imageId: token.imageId,
          username: token.username,
          email: token.email!,
          emailVerified: null,
        };
        return session;
      },
    },
    jwt: {},
  });
  const auth = async ({ permission }: { permission?: Permission } = {}) => {
    const session = await returned.auth();
    if (!session) {
      redirect("/auth/sign-in");
    }

    const res = checkPermission(session.user, permission);
    if (res === "forbidden") {
      throw new ForbiddenError(
        "You don't have permission to access this resource"
      );
    }
    return session;
  };

  return { ...returned, auth, authWithoutRedirect: returned.auth };
};

export { initAuth };
export * from "./utils";
