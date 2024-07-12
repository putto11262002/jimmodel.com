import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import modelUseCase, {
  addModel,
  addModelImage,
  deleteModelImage,
  findModelById,
  getModelImages,
  getModelProfiles,
  setProfileImage,
  updateModel,
} from "../usecases/model";
import { z } from "zod";
import { modelImageTypes } from "@/db/schemas";
import * as buffer from "buffer";
import {
  CreateModelSchema,
  ModelBlockCreateInputSchema,
  UpdateModelSchema,
} from "../validators/model";
import { validationMiddleware } from "./middlewares/validator";

export const MODEL_IMAGE_FILE_TYPES = ["image/webp", "image/jpeg", "image/jpg"];

export const MODEL_IMAGE_SIZE_LIMIT = 5_000_000;

const modelRouter = new Hono()
  .post("/models", zValidator("json", CreateModelSchema), async (c) => {
    const model = c.req.valid("json");
    const id = await addModel(model);
    if (!id) {
      throw new Error("failed to add model");
    }
    return c.json({ id });
  })
  .get(
    "/models/profile",
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
      const { page, pageSize, q } = c.req.valid("query");
      const profiles = await getModelProfiles({ page, pageSize, q });
      return c.json(profiles);
    },
  )
  .get("/models/:modelId", async (c) => {
    const id = c.req.param("modelId");
    const model = await findModelById(id);
    if (!model) {
      throw new Error("Model not found");
    }
    return c.json(model);
  })
  .put("/models/:modelId", zValidator("json", UpdateModelSchema), async (c) => {
    const modelId = c.req.param("modelId");
    const input = c.req.valid("json");
    const updatedModelId = await updateModel(modelId, input);
    if (!updatedModelId) {
      throw new Error("Model not found");
    }
    return c.json({ id: updatedModelId });
  })
  .delete("/models/:modelId/images/:fileId", async (c) => {
    await deleteModelImage(c.req.param("modelId"), c.req.param("fileId"));
    return c.newResponse(null, 204);
  })
  .post(
    "models/:modelId/images/profile",
    zValidator("json", z.object({ fileId: z.string() })),
    async (c) => {
      const { fileId } = c.req.valid("json");
      const modelId = c.req.param("modelId");
      await setProfileImage(modelId, fileId);
      c.status(204);
      return c.body(null);
    },
  )
  .get("/models/:modelId/images", async (c) => {
    const modelId = c.req.param("modelId");
    const images = await getModelImages(modelId);
    return c.json(images);
  })
  .post(
    "/models/:modelId/images",
    zValidator(
      "form",
      z.object({
        file: z
          .any()
          .transform((v, ctx) => {
            if (v instanceof Blob) {
              return v;
            }
            ctx.addIssue({
              code: "custom",
              message: "expected File",
              path: ["file"],
            });
            return z.NEVER;
          })
          .refine(
            (v) => v.size <= MODEL_IMAGE_SIZE_LIMIT,
            "File exceeded size limit",
          )
          .refine(
            (v) => MODEL_IMAGE_FILE_TYPES.includes(v.type),
            "Invalid file type",
          ),
        type: z.enum(modelImageTypes),
      }),
    ),
    async (c) => {
      const { file, type } = c.req.valid("form");
      const modelId = c.req.param("modelId");
      await addModelImage(
        modelId,
        new buffer.File([Buffer.from(await file.arrayBuffer())], "", {
          type: file.type,
        }),
        type,
      );
      c.status(204);
      return c.body(null);
    },
  )
  .post(
    "/models/:id/blocks",
    zValidator("json", ModelBlockCreateInputSchema),
    async (c) => {
      const modelId = c.req.param("id");
      const { start, end, reason } = c.req.valid("json");
      await modelUseCase.block(modelId, {
        start: new Date(start),
        end: new Date(end),
        reason,
      });
      return c.newResponse(null, 201);
    },
  )
  .get("/models/:id/blocks", async (c) => {
    const modelId = c.req.param("id");
    const blocks = await modelUseCase.getBlocks({ modelId });
    return c.json(blocks);
  })
  .get(
    "/blocks",
    zValidator(
      "query",
      z.object({
        start: z
          .string()
          .datetime()
          .transform((v) => new Date(v)),
        end: z
          .string()
          .datetime()
          .transform((v) => new Date(v)),
      }),
    ),
    async (c) => {
      const blocks = await modelUseCase.getBlocks();
      return c.json(blocks);
    },
  );

export default modelRouter;
