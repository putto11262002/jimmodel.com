import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  ApplicationCreateInputSchema,
  ApplicationImageCreateInputSchema,
} from "../validators/application";
import { applicationUseCase } from "../usecases";
import { z } from "zod";
import { HTTPException } from "hono/http-exception";
import { applicationStatuses } from "@/db/schemas";
import { authMiddleware } from "./middlewares/auth";
import permissions from "@/config/permission";
import { stringToNumber } from "../validators/req-query";

const applicationRouter = new Hono()
  .basePath("applications")
  .get(
    "/",
    authMiddleware(permissions.applications.getApplications),
    zValidator(
      "query",
      z.object({
        page: stringToNumber.optional(),
        pageSize: stringToNumber.optional(),
        status: z.enum(applicationStatuses).optional(),
      }),
    ),
    async (c) => {
      const { page, pageSize, status } = c.req.valid("query");

      const data = await applicationUseCase.getApplications({
        page,
        pageSize,
        statuses: [...(status ? [status] : [])],
      });
      return c.json(data);
    },
  )
  .post(
    "/:id/reject",
    authMiddleware(permissions.applications.rejectApplication),
    async (c) => {
      const id = c.req.param("id");
      await applicationUseCase.rejectApplication(id);
      return c.newResponse(null, { status: 204 });
    },
  )
  .post(
    "/:id/approve",
    authMiddleware(permissions.applications.approveApplication),
    async (c) => {
      const id = c.req.param("id");
      await applicationUseCase.approveApplication(id);
      return c.newResponse(null, { status: 204 });
    },
  )
  .get(
    "/:id",
    authMiddleware(permissions.applications.getApplicationById),
    async (c) => {
      const id = c.req.param("id");
      const application = await applicationUseCase.getApplication(id);
      if (!application) {
        throw new HTTPException(404, { message: "Application not foud" });
      }
      return c.json(application);
    },
  )
  .get(
    "/:id/images",
    authMiddleware(permissions.applications.getApplicationImageById),
    async (c) => {
      const id = c.req.param("id");
      const images = await applicationUseCase.getImages(id);
      return c.json(images);
    },
  )
  .post("/", zValidator("json", ApplicationCreateInputSchema), async (c) => {
    const input = c.req.valid("json");
    console.log(input);
    const createdApplication =
      await applicationUseCase.createApplication(input);
    return c.json(createdApplication);
  })
  .post(
    "/:id/images",
    zValidator("form", ApplicationImageCreateInputSchema),
    async (c) => {
      const { file, type } = c.req.valid("form");
      const id = c.req.param("id");

      await applicationUseCase.addImage(id, {
        file,
        type,
      });

      return c.newResponse(null, 201);
    },
  );

export default applicationRouter;
