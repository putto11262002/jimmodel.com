import NextAuth, { DefaultSession } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { comparePassword, findByUsernameOrEmail } from "../usecases/user";
import { AuthenticationError } from "../errors/authentication-error";

declare module "next-auth" {
  /**
   * Returned by `auth`, `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  // interface Session {
  //   } & DefaultSession["user"]
  // }
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        username: {},
        password: {},
      },
      authorize: async (credentails) => {
        console.log("000");
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
        console.log("GGG");
        if (!matched) {
          throw new AuthenticationError("invalid credentials");
        }
        return user;
      },
    }),
  ],
  callbacks: {},
  jwt: {},
});
