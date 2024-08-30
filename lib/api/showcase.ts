import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  ShowcaseCreateInputSchema,
  ShowcaseImageCreateInputSchema,
  ShowcaseUpdateInputSchema,
} from "../validators/showcase";
import { showcaseUseCase } from "../usecases";
import permissions from "@/config/permission";
import { authMiddleware } from "./middlewares/auth";
import {
  stringToBoolean,
  stringToNumberOrError,
} from "../validators/req-query";
import { z } from "zod";
import { NotFoundError } from "../errors/not-found-error";

const showcaseRouter = new Hono()
  .basePath("/showcases")
  .post(
    "/",
    authMiddleware(permissions.showcases.createShowcase),
    zValidator("json", ShowcaseCreateInputSchema),
    async (c) => {
      const input = c.req.valid("json");
      const result = await showcaseUseCase.createShowcase(input);
      return c.json(result);
    },
  )
  .put(
    "/:id",
    authMiddleware(permissions.showcases.updateShowcase),
    zValidator("json", ShowcaseUpdateInputSchema),
    async (c) => {
      const input = c.req.valid("json");
      const id = c.req.param("id");
      await showcaseUseCase.updateShowcase(id, input);
      return c.newResponse(null, 204);
    },
  )
  .get(
    "/:id",
    authMiddleware(permissions.showcases.getShowcaseById),
    async (c) => {
      const id = c.req.param("id");
      const showcase = await showcaseUseCase.getShowcaseById(id);
      if (!showcase) {
        throw new NotFoundError("Showcase not found");
      }
      return c.json(showcase);
    },
  )
  .put(
    "/:id/cover-image",
    authMiddleware(permissions.showcases.updateCoverImage),
    zValidator("form", ShowcaseImageCreateInputSchema),
    async (c) => {
      const input = c.req.valid("form");
      const id = c.req.param("id");
      await showcaseUseCase.updateCoverImage(
        id,
        "fileId" in input ? { fileId: input.fileId } : { file: input.file },
      );
      return c.newResponse(null, 204);
    },
  )
  .post(
    "/:id/images",
    authMiddleware(permissions.showcases.addImage),
    zValidator("form", ShowcaseImageCreateInputSchema),
    async (c) => {
      const input = c.req.valid("form");
      const id = c.req.param("id");
      await showcaseUseCase.addImage(
        id,
        "fileId" in input ? { fileId: input.fileId } : { file: input.file },
      );

      return c.newResponse(null, 204);
    },
  )
  .post(
    "/:id/models",
    authMiddleware(permissions.showcases.addModel),
    zValidator("json", z.object({ modelId: z.string() })),
    async (c) => {
      const { modelId } = c.req.valid("json");
      const id = c.req.param("id");
      await showcaseUseCase.addModel(id, modelId);
      return c.newResponse(null, 204);
    },
  )
  .post(
    "/:id/publish",
    authMiddleware(permissions.showcases.publishShowcase),
    async (c) => {
      const id = c.req.param("id");
      await showcaseUseCase.publish(id);
      return c.newResponse(null, 204);
    },
  )
  .post(
    "/:id/unpublish",
    authMiddleware(permissions.showcases.unpublishShowcase),
    async (c) => {
      const id = c.req.param("id");
      await showcaseUseCase.unpublish(id);
      return c.newResponse(null, 204);
    },
  )
  .get(
    "/",
    authMiddleware(permissions.showcases.getShowcases),
    zValidator(
      "query",
      z.object({
        page: stringToNumberOrError.optional(),
        pageSize: stringToNumberOrError.optional(),
        published: stringToBoolean.optional(),
      }),
    ),
    async (c) => {
      const { page, pageSize, published } = c.req.valid("query");
      const result = await showcaseUseCase.getShowcases({
        page,
        pageSize,
        published,
      });
      return c.json(result);
    },
  )
  .get(
    "/published",
    zValidator(
      "query",
      z.object({
        page: stringToNumberOrError.optional(),
        pageSize: stringToNumberOrError.optional(),
      }),
    ),
    async (c) => {
      const { page, pageSize } = c.req.valid("query");
      const result = await showcaseUseCase.getShowcases({
        page,
        pageSize,
        published: true,
      });
      return c.json(result);
    },
  )
  .post(
    "/:id/video-links/append",
    zValidator(
      "json",
      z.object({
        url: z.string(),
      }),
    ),
    async (c) => {
      const id = c.req.param("id");
      const { url } = c.req.valid("json");
      await showcaseUseCase.addVideoLink(id, url);
      return c.newResponse(null, 204);
    },
  )
  .post(
    "/:id/video-links/remove",
    zValidator(
      "json",
      z.object({
        url: z.string(),
      }),
    ),
    async (c) => {
      const id = c.req.param("id");
      const { url } = c.req.valid("json");
      await showcaseUseCase.removeVideoLink(id, url);
      return c.newResponse(null, 204);
    },
  );

export default showcaseRouter;
