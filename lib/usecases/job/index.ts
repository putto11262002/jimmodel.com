import {
  BookingCreateInput,
  JobCreateInput,
  JobStatus,
  bookingTable,
  jobTable,
  jobToModelTable,
} from "@/db/schemas/jobs";
import { and, count, eq, gte, inArray, lt, lte, ne, or } from "drizzle-orm";
import { getOffset, getPagination, paginate } from "@/lib/utils/pagination";
import { DB } from "@/db";
import { modelProfileColumns } from "@/lib/usecases/model";
import { PaginatedData } from "@/lib/types/paginated-data";
import { Booking, BookingWithJob, Job, JobUpdateInput } from "@/lib/types/job";
import { NotFoundError } from "@/lib/errors/not-found-error";
import { Model } from "@/lib/types/model";
import ConstraintViolationError from "@/lib/errors/contrain-violation-error";
import { renderJobConfirmation } from "./job-confirmation-pdf";

export class JobUsecase {
  private readonly db: DB;
  constructor(db: DB) {
    this.db = db;
  }

  public async getBookingsBetweenRange({
    start,
    end,
    statuses,
  }: {
    start: Date;
    end: Date;
    statuses?: JobStatus[];
  }): Promise<BookingWithJob[]> {
    const whereClause = and(
      start && !end ? gte(bookingTable.start, start.toISOString()) : undefined,
      end && !start ? lte(bookingTable.end, end.toISOString()) : undefined,
      start && end
        ? or(
            and(
              lt(bookingTable.start, start.toISOString()),
              gte(bookingTable.end, start.toISOString()),
            ),
            and(
              gte(bookingTable.start, start.toISOString()),
              lte(bookingTable.start, end.toISOString()),
            ),
          )
        : undefined,
      statuses && statuses.length > 0
        ? inArray(bookingTable, statuses)
        : undefined,
    );
    const bookings = await this.db.query.bookingTable.findMany({
      where: whereClause,
      with: {
        job: {
          with: {
            jobsToModels: {
              with: {
                models: {
                  columns: modelProfileColumns,
                  with: {
                    profileImage: true,
                  },
                },
              },
            },

            owner: {
              with: {
                image: true,
              },
            },
          },
        },
      },
    });
    return bookings.map((booking) => ({
      ...booking,
      job: {
        ...booking.job,
        models: booking.job.jobsToModels.map((jtm) => jtm.models),
      },
    }));
  }

  public async getJobs({
    page = 1,
    pageSize = 10,
    statuses,
    pagination = true,
    jobIds,
  }: {
    page?: number;
    pageSize?: number;
    statuses?: JobStatus[];
    pagination?: boolean;
    jobIds?: string[];
  }): Promise<PaginatedData<Job>> {
    const whereClause = and(
      statuses && statuses.length > 0
        ? inArray(jobTable.status, statuses)
        : undefined,
      jobIds && jobIds.length > 0 ? inArray(jobTable.id, jobIds) : undefined,
    );
    const [rawJobs, counts] = await Promise.all([
      this.db.query.jobTable.findMany({
        where: whereClause,
        with: {
          owner: {
            columns: {
              name: true,
              email: true,
              id: true,
            },
            with: {
              image: true,
            },
          },
          jobsToModels: {
            with: {
              models: {
                columns: modelProfileColumns,
                with: {
                  profileImage: true,
                },
              },
            },
          },
        },
        ...(pagination
          ? {
              offset: getOffset(page, pageSize),
              limit: pageSize,
            }
          : {}),
        orderBy: (jobTable, { desc }) => [desc(jobTable.createdAt)],
      }),
      this.db.select({ count: count() }).from(jobTable).where(whereClause),
    ]);

    const jobs = rawJobs.map((job) => {
      return {
        ...job,
        models: job.jobsToModels.map((jtm) => jtm.models),
      };
    });

    const paginatedJob = getPagination(jobs, page, pageSize, counts[0].count);
    return paginatedJob;
  }

  public async addJob(job: JobCreateInput): Promise<string | null> {
    const createdJob = await this.db
      .insert(jobTable)
      .values(job)
      .returning({ id: jobTable.id });
    return createdJob?.[0].id;
  }

  public async addModel(jobId: string, modelId: string) {
    const job = await this.db.query.jobTable.findFirst({
      where: eq(jobTable.id, jobId),
    });

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    const bookings = await this.db
      .select({ id: bookingTable.id })
      .from(bookingTable)
      .where(eq(bookingTable.jobId, jobId));

    if (bookings.length > 0) {
      throw new ConstraintViolationError(
        "No more models can be added as this job alread has an associated bookings",
      );
    }

    await this.db.insert(jobToModelTable).values({
      jobId,
      modelId,
    });
  }

  public async removeModel(jobId: string, modelId: string) {
    await this.db
      .delete(jobToModelTable)
      .where(
        and(
          eq(jobToModelTable.jobId, jobId),
          eq(jobToModelTable.modelId, modelId),
        ),
      );
  }

  public async getById(id: string): Promise<Job | null> {
    const job = await this.db.query.jobTable.findFirst({
      where: (jobTable, { eq }) => eq(jobTable.id, id),
      with: {
        owner: {
          columns: {
            name: true,
            email: true,
            id: true,
          },
          with: {
            image: true,
          },
        },
        jobsToModels: {
          with: {
            models: {
              columns: modelProfileColumns,
              with: {
                profileImage: true,
              },
            },
          },
        },
      },
    });
    if (!job) {
      return null;
    }

    return (
      {
        ...job,
        models: job.jobsToModels.map((jtm) => jtm.models),
      } || null
    );
  }

  public async update(id: string, job: JobUpdateInput): Promise<string | null> {
    const updatedJob = await this.db
      .update(jobTable)
      .set(job)
      .where(eq(jobTable.id, id))
      .returning({ id: jobTable.id });

    if (updatedJob.length < 1) {
      return null;
    }

    return updatedJob[0].id;
  }

  public async addBooking(jobId: string, booking: BookingCreateInput) {
    const job = await this.db.query.jobTable.findFirst({
      where: eq(jobTable.id, jobId),
      columns: {
        status: true,
      },
    });

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    const jobModels = await this.db
      .select({ modelId: jobToModelTable.modelId })
      .from(jobToModelTable)
      .where(eq(jobToModelTable.jobId, jobId));

    if (jobModels.length < 1) {
      throw new ConstraintViolationError(
        "Models must be added to job before booking can be made",
      );
    }

    const res = await this.db
      .insert(bookingTable)
      .values({ ...booking, jobId, status: job.status })
      .returning({ id: bookingTable.id });

    return res[0];
  }

  public async getModels(jobId: string): Promise<Model[]> {
    const models = await this.db.query.jobToModelTable.findMany({
      where: eq(jobToModelTable.jobId, jobId),
      with: {
        models: {
          with: {
            profileImage: true,
          },
        },
      },
    });
    return models.map((jtm) => jtm.models);
  }

  public async removeBooking(bookingId: string) {
    await this.db.delete(bookingTable).where(eq(bookingTable.id, bookingId));
  }

  public async getConflictingBookings(
    jobId: string,
    {
      start,
      end,
    }: {
      start: Date;
      end: Date;
    },
  ): Promise<Booking[]> {
    const job = await this.db.query.jobTable.findFirst({
      where: and(eq(jobTable.id, jobId)),
      with: {
        jobsToModels: true,
      },
    });

    if (!job) {
      throw new NotFoundError("Job not found");
    }

    const jobModelIds = job.jobsToModels.map((jtm) => jtm.modelId);
    console.log(jobModelIds);

    // Get jobs with overlapping models
    const overlappingJobs = await this.db
      .select({ id: jobTable.id })
      .from(jobTable)
      .innerJoin(jobToModelTable, eq(jobTable.id, jobToModelTable.jobId))
      .where(
        and(
          ne(jobTable.status, "cancelled"),
          jobModelIds.length > 0
            ? inArray(jobToModelTable.modelId, jobModelIds)
            : undefined,
        ),
      );

    const overlappingJobIds = overlappingJobs.map((j) => j.id);

    const where = and(
      start && !end ? gte(bookingTable.start, start.toISOString()) : undefined,
      end && !start ? lte(bookingTable.end, end.toISOString()) : undefined,
      start && end
        ? or(
            and(
              lt(bookingTable.start, start.toISOString()),
              gte(bookingTable.end, start.toISOString()),
            ),
            and(
              gte(bookingTable.start, start.toISOString()),
              lte(bookingTable.start, end.toISOString()),
            ),
          )
        : undefined,
      overlappingJobIds.length > 0
        ? inArray(bookingTable.jobId, overlappingJobIds)
        : undefined,
    );
    const bookings = await this.db.query.bookingTable.findMany({
      where,
    });
    return bookings;
  }

  public async getBookingsWithJob({
    start,
    end,
    page,
    pageSize,
    pagination = false,
    jobIds,
    statuses,
  }: {
    page?: number;
    pageSize?: number;
    start?: Date;
    end?: Date;
    jobIds?: string[];
    pagination?: boolean;
    statuses?: JobStatus[];
  }): Promise<PaginatedData<BookingWithJob>> {
    const bookingWhere = and(
      start && !end ? gte(bookingTable.start, start.toISOString()) : undefined,
      end && !start ? lte(bookingTable.end, end.toISOString()) : undefined,
      start && end
        ? or(
            and(
              lt(bookingTable.start, start.toISOString()),
              gte(bookingTable.end, start.toISOString()),
            ),
            and(
              gte(bookingTable.start, start.toISOString()),
              lte(bookingTable.start, end.toISOString()),
            ),
          )
        : undefined,
      jobIds && jobIds.length > 0
        ? inArray(bookingTable.jobId, jobIds)
        : undefined,
      statuses && statuses.length > 0
        ? inArray(bookingTable.status, statuses)
        : undefined,
    );

    page = page ?? 1;
    pageSize = pageSize ?? 10;
    const result = await Promise.all([
      this.db.query.bookingTable.findMany({
        with: {
          job: {
            with: {
              owner: {
                with: {
                  image: true,
                },
              },
              jobsToModels: {
                with: {
                  models: {
                    columns: modelProfileColumns,
                    with: {
                      profileImage: true,
                    },
                  },
                },
              },
            },
          },
        },
        where: bookingWhere,
        ...(pagination
          ? {
              offset: getOffset(page, pageSize),
            }
          : {}),
      }),

      ...(pagination
        ? [
            this.db
              .select({ count: count() })
              .from(bookingTable)
              .where(bookingWhere),
          ]
        : []),
    ]);

    const paginatedBooking = paginate({
      data: result[0].map((booking) => ({
        ...booking,
        job: {
          ...booking.job,
          models: booking.job.jobsToModels.map((jtm) => jtm.models),
        },
      })),
      page: pagination ? page : 1,
      pageSize: pagination ? pageSize : result[0].length,
      total: pagination ? result?.[1]?.[0].count : result[0].length,
    });

    return paginatedBooking;
  }

  public async getBookings({
    start,
    end,
    page,
    pageSize,
    pagination = false,
    jobIds,
    statuses,
  }: {
    page?: number;
    pageSize?: number;
    start?: Date;
    end?: Date;
    jobIds?: string[];
    pagination?: boolean;
    statuses?: JobStatus[];
  }): Promise<PaginatedData<Booking | BookingWithJob>> {
    const bookingWhere = and(
      start && !end ? gte(bookingTable.start, start.toISOString()) : undefined,
      end && !start ? lte(bookingTable.end, end.toISOString()) : undefined,
      start && end
        ? or(
            and(
              lt(bookingTable.start, start.toISOString()),
              gte(bookingTable.end, start.toISOString()),
            ),
            and(
              gte(bookingTable.start, start.toISOString()),
              lte(bookingTable.start, end.toISOString()),
            ),
          )
        : undefined,
      jobIds && jobIds.length > 0
        ? inArray(bookingTable.jobId, jobIds)
        : undefined,
      statuses && statuses.length > 0
        ? inArray(bookingTable.status, statuses)
        : undefined,
    );

    page = page ?? 1;
    pageSize = pageSize ?? 10;
    const result = await Promise.all([
      this.db.query.bookingTable.findMany({
        where: bookingWhere,
        ...(pagination
          ? {
              offset: getOffset(page, pageSize),
            }
          : {}),
      }),

      ...(pagination
        ? [
            this.db
              .select({ count: count() })
              .from(bookingTable)
              .where(bookingWhere),
          ]
        : []),
    ]);

    const paginatedBooking = paginate({
      data: result[0],
      page: pagination ? page : 1,
      pageSize: pagination ? pageSize : result[0].length,
      total: pagination ? result?.[1]?.[0].count : result[0].length,
    });

    return paginatedBooking;
  }

  public async checkConflicts({
    start,
    end,
    models,
  }: {
    start: Date;
    end: Date;
    models: string[];
  }) {
    const whereClause = and(
      start && !end ? gte(bookingTable.start, start.toISOString()) : undefined,
      end && !start ? lte(bookingTable.end, end.toISOString()) : undefined,
      start && end
        ? or(
            and(
              lt(bookingTable.start, start.toISOString()),
              gte(bookingTable.end, start.toISOString()),
            ),
            and(
              gte(bookingTable.start, start.toISOString()),
              lte(bookingTable.start, end.toISOString()),
            ),
          )
        : undefined,
    );

    const conflicts = await this.db.query.bookingTable.findMany({
      where: whereClause,
      with: {
        job: {
          with: {
            jobsToModels: {
              where: (_models, { inArray }) => inArray(_models.modelId, models),
            },
          },
        },
      },
    });

    return conflicts;
  }

  public async confirmJob(jobId: string) {
    this.db.transaction(async (tx) => {
      const confirmedJob = await tx
        .update(jobTable)
        .set({ status: "confirmed" })
        .where(and(eq(jobTable.id, jobId), eq(jobTable.status, "pending")))
        .returning({ id: jobTable.id });
      if (confirmedJob.length > 0) {
        await tx
          .update(bookingTable)
          .set({ status: "confirmed" })
          .where(eq(bookingTable.jobId, jobId));
      }
    });
  }

  public async cancelJob(jobId: string) {
    this.db.transaction(async (tx) => {
      const cancelledJob = await tx
        .update(jobTable)
        .set({ status: "cancelled" })
        .where(and(eq(jobTable.id, jobId), eq(jobTable.status, "confirmed")))
        .returning({ id: jobTable.id });
      if (cancelledJob.length > 0) {
        await tx
          .update(bookingTable)
          .set({ status: "cancelled" })
          .where(eq(bookingTable.jobId, jobId));
      }
    });
  }

  public async archiveJob(jobId: string) {
    this.db.transaction(async (tx) => {
      const cancelledJob = await tx
        .update(jobTable)
        .set({ status: "archived" })
        .where(and(eq(jobTable.id, jobId), eq(jobTable.status, "pending")))
        .returning({ id: jobTable.id });
      if (cancelledJob.length > 0) {
        await tx
          .update(bookingTable)
          .set({ status: "archived" })
          .where(eq(bookingTable.jobId, jobId));
      }
    });
  }

  public async getJobBookings(jobId: string): Promise<Booking[]> {
    const bookings = await this.db.query.bookingTable.findMany({
      where: eq(bookingTable.jobId, jobId),
    });
    return bookings;
  }

  public async generateJobConfirmationSheet(
    jobId: string,
    output: WritableStream<any>,
  ) {
    const job = await this.getById(jobId);
    if (!job) {
      throw new NotFoundError("Job not found");
    }
    const bookings = await this.getJobBookings(job.id);
    renderJobConfirmation({ ...job, bookings }, output);
  }
}
