import { Hono } from "hono";
import jobUsecase from "../usecases/job";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  BookingCreateInputSchema,
  JobCreateInputSchema,
  JobUpdateInputSchema,
} from "../validators/job";
import { stringToNumber, stringToNumberOrDefault } from "./util";
import { authMiddleware } from "./middlewares/auth";
import { HTTPException } from "hono/http-exception";
import { validationMiddleware } from "./middlewares/validator";
import { jobStatuses } from "@/db/schemas";

const jobRouter = new Hono()
  .post(
    "/jobs",
    authMiddleware(["admin", "staff"]),
    zValidator("json", JobCreateInputSchema.omit({ ownerId: true })),
    async (c) => {
      const input = c.req.valid("json");
      const session = c.get("session");
      const id = await jobUsecase.addJob({
        ...input,
        ownerId: session.user.id,
      });
      if (!id) {
        throw new Error("Failed to create job");
      }
      return c.json({ id });
    },
  )
  .get(
    "/jobs",
    zValidator(
      "query",
      z.object({
        page: stringToNumber.optional(),
        pageSize: stringToNumber.optional(),
        status: z.enum(jobStatuses).optional(),
      }),
    ),
    async (c) => {
      const { page, pageSize, status } = c.req.valid("query");
      const jobs = await jobUsecase.getJobs({
        page,
        pageSize,
        statuses: status ? [status] : undefined,
      });
      return c.json(jobs);
    },
  )
  .get("/jobs/:id", async (c) => {
    const id = c.req.param("id");
    const job = await jobUsecase.getById(id);
    if (!job) {
      throw new Error("Job not found");
    }
    return c.json(job);
  })
  .put("/jobs/:id", zValidator("json", JobUpdateInputSchema), async (c) => {
    const id = c.req.param("id");
    const job = c.req.valid("json");
    const updateJobId = await jobUsecase.update(id, job);
    if (!updateJobId) {
      throw new HTTPException(404, { message: "Job not found" });
    }
    return c.json({ id: updateJobId });
  })
  .get("/jobs/:id/models", async (c) => {
    const id = c.req.param("id");
    const models = await jobUsecase.getModels(id);
    return c.json(models);
  })
  .post(
    "/jobs/:id/models",
    zValidator(
      "json",
      z.object({
        modelId: z.string(),
      }),
    ),
    async (c) => {
      const id = c.req.param("id");
      const { modelId } = c.req.valid("json");
      await jobUsecase.addModel(id, modelId);
      return c.text("", 201);
    },
  )
  .delete("/jobs/:id/models/:modelId", async (c) => {
    const jobId = c.req.param("id");
    const modelId = c.req.param("modelId");
    await jobUsecase.removeModel(jobId, modelId);
    return c.newResponse(null, 204);
  })
  .post(
    "/bookings",
    zValidator("json", BookingCreateInputSchema),
    async (c) => {
      const booking = c.req.valid("json");
      const res = await jobUsecase.addBooking(booking);
      return c.json(res);
    },
  )
  .get(
    "/bookings",
    zValidator(
      "query",
      z.object({
        page: z
          .string()
          .transform((v) => {
            const parsed = parseInt(v, 10);
            if (isNaN(parsed)) {
              undefined;
            }
            return parsed;
          })
          .optional(),
        pageSize: z
          .string()
          .transform((v) => {
            const parsed = parseInt(v, 10);
            if (isNaN(parsed)) {
              return undefined;
            }
            return parsed;
          })
          .optional(),
        jobIds: z.string().or(z.array(z.string())).optional(),
        start: z
          .string()
          .datetime()
          .transform((s) => new Date(s))
          .optional(),
        end: z
          .string()
          .datetime()
          .transform((s) => new Date(s))
          .optional(),
        modelIds: z.string().or(z.array(z.string())).optional(),
      }),
    ),
    async (c) => {
      const { page, pageSize, start, end, jobIds, modelIds } =
        c.req.valid("query");
      const bookings = await jobUsecase.getBookings({
        page,
        pageSize,
        start,
        end,
        jobIds: Array.isArray(jobIds) ? jobIds : jobIds ? [jobIds] : undefined,
        modelIds: Array.isArray(modelIds)
          ? modelIds
          : modelIds
            ? [modelIds]
            : undefined,
      });
      return c.json(bookings);
    },
  )
  .get(
    "/bookings/conflicts",
    zValidator(
      "query",
      z.object({
        start: z
          .string()
          .datetime()
          .transform((s) => new Date(s)),
        end: z
          .string()
          .datetime()
          .transform((s) => new Date(s)),
        models: z
          .string()
          .transform((v) => [v])
          .or(z.array(z.string())),
      }),
    ),
    async (c) => {
      const { start, end, models } = c.req.valid("query");
      const conflicts = await jobUsecase.checkConflicts({ start, end, models });
      return c.json(conflicts);
    },
  )
  .delete("/bookings/:id", async (c) => {
    const bookingId = c.req.param("id");
    await jobUsecase.removeBooking(bookingId);
    return c.newResponse(null, 204);
  })
  .post("/jobs/:id/confirm", async (c) => {
    await jobUsecase.confirmJob(c.req.param("id"));
    return c.newResponse(null, 204);
  })
  .post("/jobs/:id/archive", async (c) => {
    await jobUsecase.archiveJob(c.req.param("id"));
    return c.newResponse(null, 204);
  })
  .post("/jobs/:id/cancel", async (c) => {
    await jobUsecase.cancelJob(c.req.param("id"));
    return c.newResponse(null, 204);
  })
  .get(
    "/bookings/range",
    validationMiddleware(
      "query",
      z.object({
        start: z
          .string()
          .datetime()
          .transform((s) => new Date(s)),
        end: z
          .string()
          .datetime()
          .transform((s) => new Date(s)),
      }),
    ),
    async (c) => {
      const { start, end } = c.req.valid("query");
      const bookings = await jobUsecase.getBookingsBetweenRange({ start, end });
      return c.json(bookings);
    },
  );

export default jobRouter;
