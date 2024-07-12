import { Session } from "next-auth";
import { createMiddleware } from "hono/factory";
import { UserRole } from "@/db/schemas";
import { intersection } from "lodash";
import { auth } from "@/lib/auth";

declare module "hono" {
  interface ContextVariableMap {
    session: Session;
  }
}

export const authMiddleware = (roles?: UserRole[]) =>
  createMiddleware(async (c, next) => {
    const session = await auth();
    if (!session) {
      throw new Error("Unauthorized");
    }
    if (roles && intersection(roles, session.user.roles).length === 0) {
      throw new Error("Forbidden");
    }
    c.set("session", session);
    await next();
  });
