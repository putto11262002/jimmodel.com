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
  ModelCreateInputSchema,
  ModelBlockCreateInputSchema,
  ModelExperienceCreateInputSchema,
  UpdateModelSchema,
} from "../validators/model";
import { validationMiddleware } from "./middlewares/validator";
import { imageValidator } from "../validators/file";
import { stringToNumber, stringToNumberOrDefault } from "./util";

export const MODEL_IMAGE_FILE_TYPES = ["image/webp", "image/jpeg", "image/jpg"];

export const MODEL_IMAGE_SIZE_LIMIT = 5_000_000;

const modelRouter = new Hono()
  .post("/models", zValidator("json", ModelCreateInputSchema), async (c) => {
    const model = c.req.valid("json");
    const id = await addModel(model);
    if (!id) {
      throw new Error("failed to add model");
    }
    return c.json({ id });
  })
  .get(
    "/models",
    zValidator(
      "query",
      z.object({
        page: stringToNumber.optional(),
        pageSize: stringToNumber.optional(),
        q: z.string().optional(),
      }),
    ),
    async (c) => {
      const { page, pageSize, q } = c.req.valid("query");
      const profiles = await modelUseCase.getModels({ page, pageSize, q });
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
    await modelUseCase.removeImage(
      c.req.param("modelId"),
      c.req.param("fileId"),
    );
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
        file: imageValidator(),
        type: z.enum(modelImageTypes),
      }),
    ),
    async (c) => {
      const { file, type } = c.req.valid("form");
      const modelId = c.req.param("modelId");
      await addModelImage(modelId, file, type);
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
    const blocks = await modelUseCase.getBlocks({ modelIds: [modelId] });
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
          .transform((v) => new Date(v))
          .optional(),
        end: z
          .string()
          .datetime()
          .transform((v) => new Date(v))
          .optional(),
        include: z
          .enum(["model"])
          .or(z.array(z.enum(["model"])))
          .optional(),
        modelIds: z
          .string()
          .transform((v) => [v])
          .or(z.array(z.string()))
          .optional(),
      }),
    ),
    async (c) => {
      const { start, end, include, modelIds } = c.req.valid("query");
      const blocks = await modelUseCase.getBlocks({
        start,
        end,
        modelIds,
        include: {
          model: Array.isArray(include)
            ? include?.includes("model")
            : include === "model",
        },
      });
      return c.json(blocks);
    },
  )
  .delete("/blocks/:id", async (c) => {
    const id = c.req.param("id");
    const block = await modelUseCase.removeBlock(id);
    return c.json(block);
  })
  .get("/models/:id/experiences", async (c) => {
    const modelId = c.req.param("id");
    const experiences = await modelUseCase.getExperiences(modelId);
    return c.json(experiences);
  })
  .post(
    "/models/:id/experiences",
    zValidator("json", ModelExperienceCreateInputSchema),
    async (c) => {
      const input = c.req.valid("json");
      const id = c.req.param("id");
      await modelUseCase.addExperience(id, input);
      return c.newResponse(null, 201);
    },
  )
  .delete("/models/:id/experiences/:experienceId", async (c) => {
    const id = c.req.param("id");
    const experienceId = c.req.param("experienceId");
    await modelUseCase.removeExperience(id, experienceId);
    return c.newResponse(null, 204);
  });

export default modelRouter;
