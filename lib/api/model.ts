import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { modelUseCase } from "../usecases";
import { z } from "zod";
import { modelImageTypes } from "@/db/schemas";
import {
  ModelCreateInputSchema,
  ModelBlockCreateInputSchema,
  ModelExperienceCreateInputSchema,
  UpdateModelSchema,
} from "../validators/model";
import { imageValidator } from "../validators/file";
import { authMiddleware } from "./middlewares/auth";
import permissions from "@/config/permission";
import {
  stringArray,
  stringToBoolean,
  stringToDate,
  stringToNumber,
} from "../validators/req-query";

const modelRouter = new Hono()
  .post(
    "/models",
    authMiddleware(permissions.models.createModel),
    zValidator("json", ModelCreateInputSchema),
    async (c) => {
      const model = c.req.valid("json");
      const result = await modelUseCase.createModel(model);
      return c.json(result);
    },
  )
  .get(
    "/models",
    authMiddleware(permissions.models.getModels),
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
  .get(
    "/models/:modelId",
    authMiddleware(permissions.models.getModelById),
    async (c) => {
      const id = c.req.param("modelId");
      const model = await modelUseCase.getById(id);
      if (!model) {
        throw new Error("Model not found");
      }
      return c.json(model);
    },
  )
  .put(
    "/models/:modelId",
    authMiddleware(permissions.models.updateModelById),
    zValidator("json", UpdateModelSchema),
    async (c) => {
      const modelId = c.req.param("modelId");
      const input = c.req.valid("json");
      const updatedModelId = await modelUseCase.updateModel(modelId, input);
      if (!updatedModelId) {
        throw new Error("Model not found");
      }
      return c.json({ id: updatedModelId });
    },
  )
  .delete(
    "/models/:modelId/images/:fileId",
    authMiddleware(permissions.models.removeModelImageById),
    async (c) => {
      await modelUseCase.removeImage(
        c.req.param("modelId"),
        c.req.param("fileId"),
      );
      return c.newResponse(null, 204);
    },
  )
  .post(
    "models/:modelId/images/profile",
    authMiddleware(permissions.models.setProfileImageById),
    zValidator("json", z.object({ fileId: z.string() })),
    async (c) => {
      const { fileId } = c.req.valid("json");
      const modelId = c.req.param("modelId");
      await modelUseCase.setProfileImage(modelId, fileId);
      c.status(204);
      return c.body(null);
    },
  )
  .get(
    "/models/:modelId/images",
    authMiddleware(permissions.models.getModelImagesById),
    async (c) => {
      const modelId = c.req.param("modelId");
      const images = await modelUseCase.getModelImages(modelId);
      return c.json(images);
    },
  )
  .post(
    "/models/:modelId/images",
    authMiddleware(permissions.models.addModelImage),
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
      await modelUseCase.addModelImage(modelId, { file: file, type });
      c.status(204);
      return c.body(null);
    },
  )
  .post(
    "/models/:id/blocks",
    authMiddleware(permissions.models.addModelBlock),
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
  .get(
    "/models/:id/blocks",
    zValidator(
      "query",
      z.object({
        page: stringToNumber.optional(),
        pageSize: stringToNumber.optional(),
      }),
    ),
    authMiddleware(permissions.models.getModelBlocks),
    async (c) => {
      const modelId = c.req.param("id");
      const res = c.req.valid("query");

      console.log(res);
      const blocks = await modelUseCase.getBlocks({
        modelIds: [modelId],
      });

      return c.json(blocks);
    },
  )
  .get(
    "/blocks-with-model-profile",
    authMiddleware(permissions.models.getBlocksWithModel),
    zValidator(
      "query",
      z.object({
        start: stringToDate.optional(),
        end: stringToDate.optional(),
        modelIds: stringArray.optional(),
        pagination: stringToBoolean.optional(),
        page: stringToNumber.optional(),
        pageSize: stringToNumber.optional(),
      }),
    ),
    async (c) => {
      const { start, end, modelIds, pagination, page, pageSize } =
        c.req.valid("query");
      const blocks = await modelUseCase.getBlocksWithModelProfile({
        start,
        end,
        modelIds,
        pagination,
        page,
        pageSize,
      });
      return c.json(blocks);
    },
  )
  .get(
    "/blocks",
    authMiddleware(permissions.models.getBlocks),
    zValidator(
      "query",
      z.object({
        start: stringToDate.optional(),
        end: stringToDate.optional(),
        modelIds: stringArray.optional(),
        pagination: stringToBoolean.optional(),
        page: stringToNumber.optional(),
        pageSize: stringToNumber.optional(),
      }),
    ),
    async (c) => {
      const { page, pageSize, start, end, modelIds, pagination } =
        c.req.valid("query");
      const blocks = await modelUseCase.getBlocks({
        start,
        end,
        modelIds,
        pagination,
        page,
        pageSize,
      });
      return c.json(blocks);
    },
  )
  .delete(
    "/blocks/:id",
    authMiddleware(permissions.models.removeModelBlockById),
    async (c) => {
      const id = c.req.param("id");
      const block = await modelUseCase.removeBlock(id);
      return c.json(block);
    },
  )
  .get(
    "/models/:id/experiences",
    authMiddleware(permissions.models.getModelExperiences),
    async (c) => {
      const modelId = c.req.param("id");
      const experiences = await modelUseCase.getExperiences(modelId);
      return c.json(experiences);
    },
  )
  .post(
    "/models/:id/experiences",
    authMiddleware(permissions.models.addModelExperience),
    zValidator("json", ModelExperienceCreateInputSchema),
    async (c) => {
      const input = c.req.valid("json");
      const id = c.req.param("id");
      await modelUseCase.addExperience(id, input);
      return c.newResponse(null, 201);
    },
  )
  .delete(
    "/models/:id/experiences/:experienceId",
    authMiddleware(permissions.models.removeModelExperience),
    async (c) => {
      const id = c.req.param("id");
      const experienceId = c.req.param("experienceId");
      await modelUseCase.removeExperience(id, experienceId);
      return c.newResponse(null, 204);
    },
  );

export default modelRouter;
