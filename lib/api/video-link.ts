import { zValidator } from "@hono/zod-validator";
import { Hono } from "hono";
import { z } from "zod";
import {
  UnsupportedVideoSourceError,
  VideoLinkProcessor,
} from "../video-link/video-link-processor";
const videoLinkRouter = new Hono().basePath("/video-links").post(
  "process",
  zValidator(
    "json",
    z.object({
      url: z.string(),
    }),
  ),
  async (c) => {
    const { url } = c.req.valid("json");
    try {
      const videoLinkProcessor = new VideoLinkProcessor(url);

      return c.json({
        ok: true,
        iframeSrc: videoLinkProcessor.generateIframeSrc(),
        id: videoLinkProcessor.getVideoId(),
      });
    } catch (e) {
      if (e instanceof UnsupportedVideoSourceError) {
        return c.json({
          ok: false,
          iframeSrc: "",
          id: "",
        });
      }
      // handle the erro globally
      throw e;
    }
  },
);
export default videoLinkRouter;
