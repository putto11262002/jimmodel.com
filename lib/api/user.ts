import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import userUsecase from "../usecases/user";
import { authMiddleware } from "./middlewares/auth";
import { File } from "buffer";
import { fileValidator } from "./validators/file";
import { validationMiddleware } from "./middlewares/validator";
import { NewUserSchema } from "../validators/user";

const USER_IMAGE_SIZE_LIMIT = 1024 * 1024 * 2; // 2MB
const USER_IMAGE_FILE_TYPES = [
  "image/jpeg",
  "image/png",
  "image/svg",
  "image/gif",
  "image/webp",
];

const userRouter = new Hono()
  .post("/users", validationMiddleware("json", NewUserSchema), async (c) => {
    const newUser = c.req.valid("json");
    await userUsecase.addUser(newUser);
    return c.newResponse(null, 201);
  })
  .post(
    "/users/self/image",
    authMiddleware(),
    validationMiddleware(
      "form",
      z.object({
        file: fileValidator({
          sizeLimit: USER_IMAGE_SIZE_LIMIT,
          mimetypes: USER_IMAGE_FILE_TYPES,
        }),
      }),
    ),
    async (c) => {
      const { file } = c.req.valid("form");
      const session = c.get("session");
      await userUsecase.addImage(
        session.user.id,
        new File([Buffer.from(await file.arrayBuffer())], "", {
          type: file.type,
        }),
      );
      return c.newResponse(null, 204);
    },
  )
  .post(
    "/users/:id/image",
    authMiddleware(["admin"]),
    zValidator(
      "form",
      z.object({
        file: fileValidator({
          sizeLimit: USER_IMAGE_SIZE_LIMIT,
          mimetypes: USER_IMAGE_FILE_TYPES,
        }),
      }),
    ),
    async (c) => {
      const { file } = c.req.valid("form");
      const id = c.req.param("id");
      await userUsecase.addImage(
        id,
        new File([Buffer.from(await file.arrayBuffer())], "", {
          type: file.type,
        }),
      );
      return c.newResponse(null, 204);
    },
  )
  .get(
    "/users",
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
  );

export default userRouter;
