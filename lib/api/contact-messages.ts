import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { contactMessageUseCase } from "../usecases";
import { ContactMessageFilterQuerySchema } from "../validators/contact-message";
import { authMiddleware } from "./middlewares/auth";
import permissions from "@/config/permission";

const contactMessageRouter = new Hono()
  .basePath("/contact-messages")
  .get(
    "/",
    authMiddleware(permissions.contactMessages.getContactMessages),
    zValidator("query", ContactMessageFilterQuerySchema),
    async (c) => {
      const { page, pageSize, read } = c.req.valid("query");
      const data = await contactMessageUseCase.getContactMessages({
        page,
        pageSize,
        read,
      });
      return c.json(data);
    },
  )
  .post(
    "/:id/mark-as-read",
    authMiddleware(permissions.contactMessages.markAsRead),
    async (c) => {
      const id = c.req.param("id");
      await contactMessageUseCase.markAsRead(id);
      return c.newResponse(null, 204);
    },
  );

export default contactMessageRouter;
