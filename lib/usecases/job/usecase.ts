import { and, countDistinct, eq, ilike, inArray } from "drizzle-orm";
import { getOffset, paginate } from "@/lib/utils/pagination";
import { bookingTable, jobTable, jobModelTable } from "@/db/schemas";
import { PaginatedData } from "@/lib/types/paginated-data";
import {
  ActionNotAllowedError,
  ConstraintViolationError,
  ForbiddenError,
  NotFoundError,
} from "@/lib/errors";
import { renderJobConfirmation } from "./helpers";
import { User, Booking, Job, Model } from "@/lib/domains";
import {
  GetJobsFilter,
  JobUpdateInput,
  BookingCreateInput,
  GetBookingsFilter,
  JobCreateInput,
} from "./inputs";
import { ModelUseCase } from "../model";
import { getDateRangeWhere } from "../common/helpers/date-range-where";
import { withPagination } from "../common/helpers/with-pagination";
import { UserUseCase } from "../user";
import { EventHub, ReadonlyEventHub } from "@/lib/event-hub";
import { MODEL_PROFILE_IMAGE_UPDATED, ModelEventMap } from "../model/event";
import {
  BOOKING_CREATED,
  BOOKING_DELETED,
  JOB_CREATED,
  JOB_DELETED,
  JOB_MODEL_ADDED,
  JOB_MODEL_REMOVED,
  JOB_STATUS_UPDATED,
  JOB_UPDATED,
  JobEventMap,
} from "./event";
import { DB, TX } from "@/db/config";
import { JOB_STATUS, USER_ROLE } from "@/db/constants";
import { withOptionalTransaction } from "../common/helpers/use-transaction";
import { USER_IMAGE_UPDATED_EVENT, UserEventMap } from "../user/event";
import _ from "lodash";

export class JobUsecase<
  TJobEventMap extends JobEventMap = any,
  TModelEventMap extends ModelEventMap = any,
  TUserEventMap extends UserEventMap = any
> {
  private readonly db: DB;
  private readonly modelUseCase: ModelUseCase;
  private readonly userUseCase: UserUseCase;
  private readonly modelEventHub?: ReadonlyEventHub<TModelEventMap>;
  private readonly jobEventHub?: EventHub<TJobEventMap>;
  private readonly userEventHub?: ReadonlyEventHub<TUserEventMap>;
  constructor({
    db,
    modelUseCase,
    userUseCase,
    modelEventHub,
    jobEventHub,
    userEventHub,
  }: {
    db: DB;
    modelUseCase: ModelUseCase;
    userUseCase: UserUseCase;
    modelEventHub?: EventHub<TModelEventMap>;
    jobEventHub?: EventHub<TJobEventMap>;
    userEventHub?: EventHub<TUserEventMap>;
  }) {
    this.db = db;
    this.modelUseCase = modelUseCase;
    this.userUseCase = userUseCase;
    this.modelEventHub = modelEventHub;
    this.jobEventHub = jobEventHub;
    this.userEventHub = userEventHub;

    this.modelEventHub?.on("MODEL_UPDATED", this.onModelUpdated.bind(this));

    this.modelEventHub?.on(
      MODEL_PROFILE_IMAGE_UPDATED,
      this.onModelProfileImageUpdate.bind(this)
    );

    this.userEventHub?.on(
      USER_IMAGE_UPDATED_EVENT,
      this.onUserUpdateImage.bind(this)
    );
  }

  /**
   * Creates a new job entry in the database.
   *
   * This method inserts a new job record using the provided job data
   * and associates it with the specified actor (user) ID.
   *
   * @param job - The job details to be created, following the JobCreateInput structure.
   * @param actorId - The ID of the user (actor) creating the job, which will be set as the owner of the job.
   * @returns A promise that resolves to the unique identifier (ID) of the newly created job.
   */
  public async createJob(
    job: JobCreateInput,
    actorId: User["id"]
  ): Promise<string> {
    const user = await this.userUseCase.getUser(actorId);
    if (!user) {
      throw new NotFoundError("Actor not found");
    }
    const createdJobId = await this.db
      .insert(jobTable)
      .values({
        ...job,
        ownerId: user.id,
        ownerName: user.name,
        ownerImageId: user.imageId,
      })
      .returning({ id: jobTable.id })
      .then((res) => res[0].id);

    this.jobEventHub?.emit(JOB_CREATED, { jobId: createdJobId });

    return createdJobId;
  }

  /**
   * Updates a job record in the database with the provided input.
   *
   * @param id - The ID of the job to update.
   * @param input - An object containing the fields to update.
   * @returns A promise that resolves when the update is complete.
   * @throws {NotFoundError} - If no job with the specified ID exists.
   */
  public async updateJob(id: Job["id"], input: JobUpdateInput): Promise<void> {
    const effectedRows = await this.db
      .update(jobTable)
      .set(input)
      .where(eq(jobTable.id, id))
      .returning({ id: jobTable.id });
    if (effectedRows.length < 1) {
      throw new NotFoundError("Job not found");
    }
    if (input.name) {
      await this.db
        .update(bookingTable)
        .set({ jobName: input.name })
        .where(eq(bookingTable.jobId, id));
    }

    this.jobEventHub?.emit(JOB_UPDATED, { jobId: id, data: input });
  }

  public async deleteJob(id: Job["id"], actorId: User["id"]) {
    const job = await this.getJob(id);
    if (!job) {
      throw new NotFoundError("Job not found");
    }

    await this.db.delete(jobTable).where(eq(jobTable.id, id));

    this.jobEventHub?.emit(JOB_DELETED, { jobId: id });
  }

  /**
   * Retrieves a job from the database by its ID.
   * Returns the job object with associated models if found, otherwise returns null.
   *
   * @param id - The ID of the job to retrieve.
   * @returns A promise that resolves to the Job object or null if not found.
   */
  public async getJob(id: Job["id"], tx?: TX): Promise<Job | null> {
    return withOptionalTransaction(
      async (tx) => {
        const job = await tx.query.jobTable.findFirst({
          where: eq(jobTable.id, id),
          with: {
            jobModels: true,
          },
        });
        if (!job) {
          return null;
        }

        return job;
      },
      this.db,
      tx
    );
  }

  public async getJobs({
    page = 1,
    pageSize = 10,
    status,
    jobIds,
    modelIds,
    ownerIds,
    orderBy = "createdAt",
    orderDir = "desc",
    pagination = true,
    q,
  }: GetJobsFilter): Promise<PaginatedData<Job>> {
    if (modelIds && modelIds.length > 0) {
      const jobWithModelsIds = await this.db.query.jobModelTable
        .findMany({
          where: inArray(jobModelTable.modelId, modelIds),
          columns: { jobId: true },
        })
        .then((res) => res.map((r) => r.jobId));
      jobIds = [...(jobIds || []), ...jobWithModelsIds];
    }
    const jobWhere = and(
      q ? ilike(jobTable.name, `${q}%`) : undefined,
      status ? eq(jobTable.status, status) : undefined,
      jobIds && jobIds.length > 0 ? inArray(jobTable.id, jobIds) : undefined,
      ownerIds && ownerIds.length > 0
        ? inArray(jobTable.ownerId, ownerIds)
        : undefined
    );

    const result = await Promise.all([
      this.db.query.jobTable.findMany({
        where: jobWhere,
        with: {
          jobModels: {},
        },
        offset: pagination ? getOffset(page, pageSize) : 0,
        limit: pagination ? pageSize : 1000,
        orderBy: (jobTable, { desc, asc }) => [
          (orderDir === "asc" ? asc : desc)(jobTable[orderBy]),
        ],
      }),
      ...(pagination
        ? [
            this.db
              .select({ count: countDistinct(jobTable.id) })
              .from(jobTable)
              .where(jobWhere)
              .then((res) => res[0].count),
          ]
        : []),
    ]);

    const paginatedJob = paginate({
      data: result[0],
      page: pagination ? page : 1,
      pageSize: pagination ? pageSize : result[0].length,
      total: pagination ? result[1] : result[0].length,
    });
    return paginatedJob;
  }

  /**
   * Adds a model to a job if there are no existing bookings for that job.
   * If the model does not exist, the method does nothing.
   *
   * @param jobId - The ID of the job to which the model will be added.
   * @param modelId - The ID of the model to be added.
   *
   * @throws {ConstraintViolationError} - If the job already has bookings.
   * @throws {InvalidArgumentError} - If the provided jobId or modelId is invalid (e.g., does not exist).
   */
  public async addModel(
    jobId: Job["id"],
    modelId: Model["id"],
    actorId: User["id"]
  ) {
    const userExist = await this.userUseCase.userExists(actorId);
    if (!userExist) {
      throw new NotFoundError("Actor not found");
    }

    const job = await this.getJob(jobId);
    if (!job) {
      throw new NotFoundError("Job not found");
    }

    if (job.private && job.ownerId !== actorId) {
      throw new ForbiddenError(
        "You do not have permission to add model to this job"
      );
    }

    const [jobWithBookings, model] = await Promise.all([
      this.db.query.jobTable.findFirst({
        where: eq(jobTable.id, jobId),
        columns: { id: true },
        with: {
          bookings: true,
        },
      }),
      this.modelUseCase.getModel(modelId),
    ]);

    if (!jobWithBookings) {
      throw new NotFoundError("Job not found");
    }

    if (jobWithBookings.bookings.length > 0) {
      throw new ConstraintViolationError(
        "Cannot add model to job with bookings"
      );
    }

    if (!model) {
      throw new NotFoundError("Model not found");
    }

    await this.db
      .insert(jobModelTable)
      .values({
        jobId,
        modelId,
        modelName: model.name,
        modelImageId: model.profileImageId,
      })
      .returning();

    this.jobEventHub?.emit(JOB_MODEL_ADDED, { jobId, modelId });
  }

  /**
   * Removes a model from a specified job.
   *
   * @param jobId - The ID of the job from which the model will be removed.
   * @param modelId - The ID of the model to be removed.
   *
   * @throws {NotFoundError} - Thrown if no matching model is found for the given job ID and model ID.
   *
   * This method will delete the association between the job and the model from the database.
   */
  public async removeModel(
    jobId: string,
    modelId: string,
    actorId: User["id"]
  ) {
    const job = await this.getJob(jobId);
    if (!job) {
      throw new NotFoundError("Job not found");
    }
    if (job.private && job.ownerId !== actorId) {
      throw new ForbiddenError(
        "You do not have permission to remove model from this job"
      );
    }
    const deletedRow = await this.db
      .delete(jobModelTable)
      .where(
        and(eq(jobModelTable.jobId, jobId), eq(jobModelTable.modelId, modelId))
      )
      .returning();

    if (deletedRow.length < 1) {
      throw new NotFoundError("Model not found for job");
    }
    this.jobEventHub?.emit(JOB_MODEL_REMOVED, { jobId, modelId });
  }

  // add booking. throw eror if job not foudn or no model is asscoaited with the job
  public async addBooking(
    jobId: Job["id"],
    booking: BookingCreateInput,
    actorId: User["id"]
  ): Promise<string> {
    const userExist = await this.userUseCase.userExists(actorId);
    if (!userExist) {
      throw new NotFoundError("Actor not found");
    }
    const jobWithModels = await this.db.query.jobTable.findFirst({
      where: eq(jobTable.id, jobId),
      columns: {
        id: true,
        status: true,
        name: true,
        private: true,
        ownerId: true,
      },
      with: {
        jobModels: true,
      },
    });

    if (!jobWithModels) {
      throw new NotFoundError("Job not found");
    }

    if (jobWithModels.private && jobWithModels.ownerId !== actorId) {
      throw new ForbiddenError(
        "You do not have permission to add booking to this job"
      );
    }

    if (jobWithModels.jobModels.length < 1) {
      throw new ConstraintViolationError(
        "Models must be added to job before booking can be made"
      );
    }

    const insertedBookingId = await this.db
      .insert(bookingTable)
      .values({
        ...booking,
        jobId,
        status: jobWithModels.status,
        jobName: jobWithModels.name,
        ownerId: actorId,
      })
      .returning({ id: bookingTable.id })
      .then((res) => res[0].id);

    this.jobEventHub?.emit(BOOKING_CREATED, {
      jobId,
      bookingId: insertedBookingId,
    });

    return insertedBookingId;
  }

  // remove booking. throw error if booking not found
  public async removeBooking(
    jobId: string,
    bookingId: string,
    actorId: User["id"]
  ) {
    const job = await this.getJob(jobId);
    if (!job) {
      throw new NotFoundError("Job not found");
    }
    if (job.private && job.ownerId !== actorId) {
      throw new ForbiddenError(
        "You do not have permission to remove booking from this job"
      );
    }
    const deletedRow = await this.db
      .delete(bookingTable)
      .where(and(eq(bookingTable.jobId, jobId), eq(bookingTable.id, bookingId)))
      .returning();
    if (deletedRow.length < 1) {
      throw new NotFoundError("Booking not found for job");
    }

    this?.jobEventHub?.emit(BOOKING_DELETED, { jobId, bookingId });
  }

  // If start is provided and the end is not provided, the method will return all the bookings that ither start on or after the specified date or span the specified date
  // If the end is provide  and the start is not provided, the method will return all the bookings that starts and ends before the specified date
  // if both start and end are provided, the method will return all the bookings that span the specified date i.e. booking that full fall in th range, booking that start before the range but
  // end within the range, booking that start within the range but end after the range, booking that span complete over the range
  public async getBookings({
    start,
    end,
    page = 1,
    pageSize = 20,
    jobIds,
    statuses,
    modelIds,
    type,
    pagination = true,
  }: GetBookingsFilter): Promise<PaginatedData<Booking>> {
    if (modelIds && modelIds.length > 0) {
      const jobWithModelsIds = await this.db.query.jobModelTable
        .findMany({
          where: inArray(jobModelTable.modelId, modelIds),
          columns: { jobId: true },
        })
        .then((res) => res.map((r) => r.jobId));
      jobIds = [...(jobIds || []), ...jobWithModelsIds];
    }

    const where = and(
      type ? eq(bookingTable.type, type) : undefined,
      getDateRangeWhere(bookingTable.start, bookingTable.end, start, end),
      statuses && statuses.length > 0
        ? inArray(bookingTable.status, statuses)
        : undefined,
      jobIds && jobIds.length > 0
        ? inArray(bookingTable.jobId, jobIds)
        : undefined
    );

    const bookingSelect = this.db
      .select({
        id: bookingTable.id,
        start: bookingTable.start,
        end: bookingTable.end,
        status: bookingTable.status,
        notes: bookingTable.notes,
        jobId: bookingTable.jobId,
        type: bookingTable.type,
        createdAt: bookingTable.createdAt,
        updatedAt: bookingTable.updatedAt,
        jobName: bookingTable.jobName,
        ownerId: bookingTable.ownerId,
      })
      .from(bookingTable)
      .where(where)
      .$dynamic();

    const bookingCount = this.db
      .select({ count: countDistinct(bookingTable.id) })
      .from(bookingTable)
      .where(where);

    const [bookings, count] = await Promise.all([
      withPagination(bookingSelect, {
        pagination,
        page,
        pageSize,
      }),
      bookingCount.then((res) => res[0].count),
    ]);

    return paginate({ data: bookings, total: count, pageSize, page });
  }

  private async updateJobStatus(
    filter: { id: Job["id"]; status: Job["status"] | Job["status"][] },
    newStatus: Job["status"],
    actorId: User["id"]
  ) {
    const updatedJob = await this.db.transaction(async (tx) => {
      const job = await this.getJob(filter.id, tx);
      if (!job) {
        throw new NotFoundError("Job not found");
      }
      if (
        _.intersection(
          Array.isArray(filter.status) ? filter.status : [filter.status],
          [job.status]
        ).length < 1
      ) {
        throw new ActionNotAllowedError(
          "Job status does not match the expected status"
        );
      }

      if (job.private && job.ownerId !== actorId) {
        throw new ForbiddenError(
          "You do not have permission to update job status"
        );
      }
      const updatedJob = await tx
        .update(jobTable)
        .set({ status: newStatus })
        .where(and(eq(jobTable.id, filter.id)))
        .returning({ id: jobTable.id });
      if (updatedJob.length > 0) {
        await tx
          .update(bookingTable)
          .set({ status: newStatus })
          .where(eq(bookingTable.jobId, filter.id));
      }
      return updatedJob;
    });

    this.jobEventHub?.emit(JOB_STATUS_UPDATED, {
      jobId: filter.id,
      status: newStatus,
    });
  }

  public async getJobBookings(jobId: string): Promise<Booking[]> {
    const bookings = await this.db.query.bookingTable.findMany({
      where: eq(bookingTable.jobId, jobId),
    });
    return bookings;
  }

  // confirm job. throw error if job not found
  public async confirmJob(jobId: string, actorId: User["id"]) {
    await this.updateJobStatus(
      { id: jobId, status: JOB_STATUS.PENDING },
      JOB_STATUS.CONFIRMED,
      actorId
    );
  }

  // mark job as cancelled. throw erro if job not found
  public async cancelJob(jobId: string, actorId: User["id"]) {
    await this.updateJobStatus(
      { id: jobId, status: JOB_STATUS.CONFIRMED },
      JOB_STATUS.CANCELLED,
      actorId
    );
  }

  // throw eror if job not found
  public async archiveJob(jobId: string, actorId: User["id"]) {
    await this.updateJobStatus(
      { id: jobId, status: [JOB_STATUS.PENDING, JOB_STATUS.CONFIRMED] },
      JOB_STATUS.ARCHIVED,
      actorId
    );
  }

  public async updateJobPermission(
    id: Job["id"],
    _private: boolean,
    actorId: User["id"]
  ) {
    const job = await this.getJob(id);
    if (!job) {
      throw new NotFoundError("Job not found");
    }
    if (job.ownerId !== actorId) {
      throw new ForbiddenError(
        "You do not have permission to update job permission"
      );
    }
    await this.db
      .update(jobTable)
      .set({ private: _private })
      .where(eq(jobTable.id, id))
      .returning({ id: jobTable.id });
  }

  public async generateJobConfirmationSheet(
    jobId: string,
    output: WritableStream<any>
  ) {
    const job = await this.getJob(jobId);
    if (!job) {
      throw new NotFoundError("Job not found");
    }
    const bookings = await this.getJobBookings(jobId);
    await renderJobConfirmation({ job, bookings }, output);
  }

  private async onModelUpdated({
    modelId,
    data,
  }: ModelEventMap["MODEL_UPDATED"]) {
    if (data.name) {
      await this.db
        .update(jobModelTable)
        .set({ modelName: data.name })
        .where(eq(jobModelTable.modelId, modelId));
    }
  }

  private async onModelProfileImageUpdate({
    modelId,
    imageMetadata,
  }: ModelEventMap["MODEL_PROFILE_IMAGE_UPDATED"]) {
    await this.db
      .update(jobModelTable)
      .set({ modelImageId: imageMetadata.id })
      .where(eq(jobModelTable.modelId, modelId));
  }

  private async onUserUpdateImage({
    userId,
    fileId,
  }: UserEventMap[typeof USER_IMAGE_UPDATED_EVENT]) {
    await this.db
      .update(jobTable)
      .set({ ownerImageId: fileId })
      .where(eq(jobTable.ownerId, userId));
  }
}
