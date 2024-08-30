import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import {
  WebAssetCreateInputSchema,
  WebAssetFilterQuerySchema,
  WebAssetUpdateInputSchema,
} from "../validators/web-asset";
import { webAssetUseCase } from "../usecases";
import { z } from "zod";
import { stringToNumberOrError } from "../validators/req-query";
import { webAssetTags, webAssetTypes } from "../constants/web-asset";
import { NotFoundError } from "../errors/not-found-error";

const webAssetRouter = new Hono()
  .basePath("web-assets")
  .post("/", zValidator("form", WebAssetCreateInputSchema), async (c) => {
    const input = c.req.valid("form");
    const webAsset = await webAssetUseCase.createWebAsset(input);
    return c.json(webAsset);
  })
  .get("/", zValidator("query", WebAssetFilterQuerySchema), async (c) => {
    const query = c.req.valid("query");
    const results = await webAssetUseCase.getWebAssets(query);
    return c.json(results);
  })
  .delete("/:id", async (c) => {
    const id = c.req.param("id");
    await webAssetUseCase.removeWebAsset(id);
    return c.newResponse(null, 204);
  })
  .put("/:id", zValidator("json", WebAssetUpdateInputSchema), async (c) => {
    const input = c.req.valid("json");
    const id = c.req.param("id");
    await webAssetUseCase.updateWebAssetMetadata(id, input);
    return c.newResponse(null, 204);
  })
  .get("/:id", async (c) => {
    const id = c.req.param("id");
    const webAsset = await webAssetUseCase.getWebAsset(id);
    if (!webAsset) {
      throw new NotFoundError("Web asset not found");
    }
    return c.json(webAsset);
  })
  .post("/:id/publish", async (c) => {
    const id = c.req.param("id");
    await webAssetUseCase.publish(id);
    return c.newResponse(null, 204);
  })
  .post("/:id/unpublish", async (c) => {
    const id = c.req.param("id");
    await webAssetUseCase.unpublish(id);
    return c.newResponse(null, 204);
  });

export default webAssetRouter;
