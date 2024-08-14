import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import { userUsecase } from "../usecases";
import { authMiddleware } from "./middlewares/auth";
import { NewUserSchema } from "../validators/user";
import { imageValidator } from "../validators/file";
import { HTTPException } from "hono/http-exception";
import { userRoles } from "@/db/schemas";
import permissions from "@/config/permission";

const userRouter = new Hono()
  .post("/users", zValidator("json", NewUserSchema), async (c) => {
    const newUser = c.req.valid("json");
    await userUsecase.createUser(newUser);
    return c.newResponse(null, 201);
  })
  .post(
    "/users/self/image",
    authMiddleware(),
    zValidator(
      "form",
      z.object({
        file: imageValidator(),
      }),
    ),
    async (c) => {
      const { file } = c.req.valid("form");
      const session = c.get("session");
      await userUsecase.addImage(session.user.id, file);
      return c.newResponse(null, 204);
    },
  )
  .post(
    "/users/:id/image",
    authMiddleware(["admin"]),
    zValidator(
      "form",
      z.object({
        file: imageValidator(),
      }),
    ),
    async (c) => {
      const { file } = c.req.valid("form");
      const id = c.req.param("id");
      await userUsecase.addImage(id, file);
      return c.newResponse(null, 204);
    },
  )
  .get(
    "/users",
    authMiddleware(permissions.users.getUsers),
    zValidator(
      "query",
      z.object({
        page: z
          .string()
          .optional()
          .transform((v) => {
            if (!v) return 1;
            const n = parseInt(v, 10);
            return isNaN(n) ? 1 : n;
          }),
        pageSize: z
          .string()
          .optional()
          .transform((v) => {
            if (!v) return 10;
            const n = parseInt(v, 10);
            return isNaN(n) ? 10 : n;
          }),
        q: z.string().optional(),
      }),
    ),
    async (c) => {
      const { page, pageSize } = c.req.valid("query");
      const paginatedModels = await userUsecase.getAll({ page, pageSize });
      return c.json(paginatedModels);
    },
  )
  .get("/users/self", authMiddleware(), async (c) => {
    const session = c.get("session");
    const user = await userUsecase.getById(session.user.id);
    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }
    return c.json(user);
  })
  .get("/users/:id", async (c) => {
    const id = c.req.param("id");
    const user = await userUsecase.getById(id);
    if (!user) {
      throw new HTTPException(404, { message: "User not found" });
    }
    return c.json(user);
  })
  .put(
    "/users/self/roles",
    authMiddleware(),
    zValidator(
      "json",
      z.object({
        roles: z.array(z.enum(userRoles)),
      }),
    ),
    async (c) => {
      const { roles } = c.req.valid("json");
      const session = c.get("session");
      await userUsecase.updateUserRole(session.user.id, roles);
      return c.newResponse(null, 204);
    },
  )
  .put(
    "/users/:id/roles",
    authMiddleware(["admin"]),
    zValidator(
      "json",
      z.object({
        roles: z.array(z.enum(userRoles)),
      }),
    ),
    async (c) => {
      const { roles } = c.req.valid("json");
      const id = c.req.param("id");
      await userUsecase.updateUserRole(id, roles);
      return c.newResponse(null, 204);
    },
  )
  .put(
    "/users/self/password",
    authMiddleware(),
    zValidator("json", NewUserSchema.pick({ password: true })),
    async (c) => {
      const session = c.get("session");
      const { password } = c.req.valid("json");
      await userUsecase.resetPassword(session.user.id, password);
      return c.newResponse(null, 204);
    },
  )
  .put(
    "/users/:id/password",
    authMiddleware(["admin"]),
    zValidator("json", NewUserSchema.pick({ password: true })),
    async (c) => {
      const id = c.req.param("id");
      const { password } = c.req.valid("json");
      await userUsecase.resetPassword(id, password);
      return c.newResponse(null, 204);
    },
  );

export default userRouter;
