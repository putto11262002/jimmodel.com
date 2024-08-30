import { Hono } from "hono";
import { jobUsecase } from "../usecases";
import { zValidator } from "@hono/zod-validator";
import { z } from "zod";
import {
  BookingCreateInputSchema,
  JobCreateInputSchema,
  JobFilterQuerySchema,
  JobUpdateInputSchema,
} from "../validators/job";
import { authMiddleware } from "./middlewares/auth";
import { jobStatuses } from "@/db/schemas";
import {
  stringToBoolean,
  stringToDate,
  stringToNumberOrError,
} from "../validators/req-query";
import permissions from "@/config/permission";
import { NotFoundError } from "../errors/not-found-error";

const jobRouter = new Hono()
  .post(
    "/jobs",
    authMiddleware(permissions.jobs.createJob),
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
    authMiddleware(permissions.jobs.getJobs),
    zValidator("query", JobFilterQuerySchema),
    async (c) => {
      const { page, pageSize, statuses, jobIds, pagination } =
        c.req.valid("query");
      const jobs = await jobUsecase.getJobs({
        page,
        pageSize,
        statuses,
        jobIds,
        pagination,
      });
      return c.json(jobs);
    },
  )
  .get("/jobs/:id", authMiddleware(permissions.jobs.getJobById), async (c) => {
    const id = c.req.param("id");
    const job = await jobUsecase.getById(id);
    if (!job) {
      throw new Error("Job not found");
    }
    return c.json(job);
  })
  .put(
    "/jobs/:id",
    authMiddleware(permissions.jobs.updateJobById),
    zValidator("json", JobUpdateInputSchema),
    async (c) => {
      const id = c.req.param("id");
      const job = c.req.valid("json");
      const updateJobId = await jobUsecase.update(id, job);
      if (!updateJobId) {
        throw new NotFoundError("Job not found");
      }
      return c.json({ id: updateJobId });
    },
  )
  .get(
    "/jobs/:id/models",
    authMiddleware(permissions.jobs.getJobModels),
    async (c) => {
      const id = c.req.param("id");
      const models = await jobUsecase.getModels(id);
      return c.json(models);
    },
  )
  .post(
    "/jobs/:id/models",
    authMiddleware(permissions.jobs.addModels),
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
  .delete(
    "/jobs/:id/models/:modelId",
    authMiddleware(permissions.jobs.removeModel),
    async (c) => {
      const jobId = c.req.param("id");
      const modelId = c.req.param("modelId");
      await jobUsecase.removeModel(jobId, modelId);
      return c.newResponse(null, 204);
    },
  )

  .post(
    "/jobs/:id/bookings",
    authMiddleware(permissions.jobs.getJobs),
    zValidator("json", BookingCreateInputSchema),
    async (c) => {
      const booking = c.req.valid("json");
      const jobId = c.req.param("id");
      const res = await jobUsecase.addBooking(jobId, booking);
      return c.json(res);
    },
  )
  .get(
    "/bookings",
    authMiddleware(permissions.jobs.getBookings),
    zValidator(
      "query",
      z.object({
        page: stringToNumberOrError.optional(),
        pageSize: stringToNumberOrError.optional(),
        start: stringToDate.optional(),
        end: stringToDate.optional(),
        pagination: stringToBoolean.optional(),
        statuses: z
          .enum(jobStatuses)
          .transform((v) => [v])
          .or(z.array(z.enum(jobStatuses)))
          .optional(),
      }),
    ),
    async (c) => {
      const { page, pageSize, start, end, pagination, statuses } =
        c.req.valid("query");
      const bookings = await jobUsecase.getBookings({
        page,
        pageSize,
        start,
        end,
        pagination,
        statuses,
      });
      return c.json(bookings);
    },
  )
  .get(
    "/bookings-with-job",
    authMiddleware(permissions.jobs.getBookingsWithJob),
    zValidator(
      "query",
      z.object({
        page: stringToNumberOrError.optional(),
        pageSize: stringToNumberOrError.optional(),
        start: stringToDate.optional(),
        end: stringToDate.optional(),
        pagination: stringToBoolean.optional(),
        statuses: z
          .enum(jobStatuses)
          .transform((v) => [v])
          .or(z.array(z.enum(jobStatuses)))
          .optional(),
      }),
    ),
    async (c) => {
      const { page, pageSize, start, end, pagination, statuses } =
        c.req.valid("query");
      const bookings = await jobUsecase.getBookingsWithJob({
        page,
        pageSize,
        start,
        end,
        pagination,
        statuses,
      });
      return c.json(bookings);
    },
  )

  .get(
    "/jobs/:id/bookings",
    authMiddleware(permissions.jobs.getJobBookings),
    async (c) => {
      const jobId = c.req.param("id");
      const bookings = await jobUsecase.getJobBookings(jobId);
      return c.json(bookings);
    },
  )
  .get(
    "/jobs/:id/bookings/conflicts",
    authMiddleware(permissions.jobs.getConflictingBookings),
    zValidator(
      "query",
      z.object({
        start: stringToDate,
        end: stringToDate,
      }),
    ),
    async (c) => {
      const { start, end } = c.req.valid("query");
      const jobId = c.req.param("id");
      const conflicts = await jobUsecase.getConflictingBookings(jobId, {
        start,
        end,
      });
      return c.json(conflicts);
    },
  )
  .delete(
    "/bookings/:id",
    authMiddleware(permissions.jobs.removeBooking),
    async (c) => {
      const bookingId = c.req.param("id");
      await jobUsecase.removeBooking(bookingId);
      return c.newResponse(null, 204);
    },
  )
  .post(
    "/jobs/:id/confirm",
    authMiddleware(permissions.jobs.confirmJob),
    async (c) => {
      await jobUsecase.confirmJob(c.req.param("id"));
      return c.newResponse(null, 204);
    },
  )
  .post(
    "/jobs/:id/archive",
    authMiddleware(permissions.jobs.archiveJob),
    async (c) => {
      await jobUsecase.archiveJob(c.req.param("id"));
      return c.newResponse(null, 204);
    },
  )
  .post(
    "/jobs/:id/cancel",
    authMiddleware(permissions.jobs.cancelJob),
    async (c) => {
      await jobUsecase.cancelJob(c.req.param("id"));
      return c.newResponse(null, 204);
    },
  );
export default jobRouter;
