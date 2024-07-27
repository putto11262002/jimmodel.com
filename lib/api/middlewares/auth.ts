import { Session } from "next-auth";
import { createMiddleware } from "hono/factory";
import { UserRole } from "@/db/schemas";
import { intersection } from "lodash";
import { auth } from "@/lib/auth";
import { HTTPException } from "hono/http-exception";

declare module "hono" {
  interface ContextVariableMap {
    session: Session;
  }
}

export const authMiddleware = (roles?: UserRole[]) =>
  createMiddleware(async (c, next) => {
    const session = await auth(undefined, { redirect: false });

    if (!session) {
      throw new HTTPException(401, { message: "Unauthenticated" });
    }
    if (roles && intersection(roles, session.user.roles).length === 0) {
      throw new HTTPException(403, { message: "Forbidden" });
    }
    c.set("session", session);
    await next();
  });
