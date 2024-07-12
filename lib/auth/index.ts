import NextAuth, { DefaultSession } from "next-auth";
import { JWT } from "next-auth/jwt";
import Credentials from "next-auth/providers/credentials";
import { comparePassword, findByUsernameOrEmail } from "../usecases/user";
import { AuthenticationError } from "../errors/authentication-error";
import { UserRole } from "@/db/schemas/users";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface Session {
    user: { roles: UserRole[] | null; id: string; username: string };
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

export const { handlers, signIn, signOut, auth } = NextAuth({
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
