import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import userUsecase, {
  comparePassword,
  findByUsernameOrEmail,
} from "../usecases/user";
import { AuthenticationError } from "../errors/authentication-error";
import { UserRole } from "@/db/schemas/users";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { intersection } from "lodash";
import AuthorisationError from "../errors/authorisation-error";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: {
      roles: UserRole[] | null;
      id: string;
      username: string;
      image: string | null;
      name: string;
    };
  }

  interface User {
    roles: UserRole[] | null;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    roles: UserRole[] | null;
    id: string;
  }
}
const authFns = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentails) => {
        const user = await findByUsernameOrEmail(
          credentails.username as string,
        );
        if (user === null) {
          throw new AuthenticationError("invalid credentials");
        }

        const matched = await comparePassword(
          user.id,
          credentails.password as string,
        );
        if (!matched) {
          throw new AuthenticationError("invalid credentials");
        }

        revalidatePath("/admin");

        return { ...user, image: user?.image?.id };
      },
    }),
  ],
  callbacks: {
    jwt: ({ user, token }) => {
      if (user && user.id) {
        token.roles = user.roles;
        token.id = user.id;
      }
      return token;
    },
    session: ({ session, token }) => {
      session.user.roles = token.roles;
      session.user.id = token.id;
      return session;
    },
  },
  jwt: {},
});

export const signIn = authFns.signIn;
export const signOut = authFns.signOut;
export const handlers = authFns.handlers;
export const unstable_update = authFns.unstable_update;

export const auth = async (
  roles?: UserRole[],
  { redirect: _redirect = true }: { redirect?: boolean } = { redirect: true },
) => {
  const session = await authFns.auth();
  if (!session) {
    if (_redirect) {
      return redirect("/auth/sign-in");
    }
    return null;
  }

  const user = await userUsecase.getById(session.user.id);
  if (!user) {
    if (_redirect) {
      return redirect("/auth/sign-in");
    }
    return null;
  }

  if (roles && intersection(user.roles, roles).length === 0) {
    if (_redirect) {
      redirect("/");
    }
    return null;
  }
  return { ...session, user };
};
