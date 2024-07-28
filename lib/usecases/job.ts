import {
  BookingCreateInput,
  JobCreateInput,
  JobStatus,
  bookingTable,
  jobTable,
  jobToModelTable,
} from "../../db/schemas/jobs";
import { and, count, eq, gte, inArray, lt, lte, or } from "drizzle-orm";
import { getOffset, getPagination } from "../utils/pagination";
import db, { DB } from "../../db/client";
import {
  fileInfoTable,
  modelImageTable,
  ModelProfile,
  modelTable,
  userTable,
} from "@/db/schemas";
import { getModelProfiles } from "./model";
import { PaginatedData } from "../types/paginated-data";
import { BookingWithJob, Job, JobUpdateInput } from "../types/job";
import { alias } from "drizzle-orm/pg-core";

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
                  columns: {
                    name: true,
                    id: true,
                    email: true,
                  },
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
  }: {
    page?: number;
    pageSize?: number;
    statuses?: JobStatus[];
  }): Promise<PaginatedData<Job>> {
    const whereClause = and(
      statuses && statuses.length > 0
        ? inArray(jobTable.status, statuses)
        : undefined,
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
                columns: {
                  id: true,
                  name: true,
                },
                with: {
                  profileImage: true,
                },
              },
            },
          },
        },
        offset: getOffset(page, pageSize),
        limit: pageSize,
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
    if (createdJob.length < 1) {
      return null;
      job;
    }
    return createdJob[0].id;
  }

  public async addModel(jobId: string, modelId: string) {
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
              columns: {
                id: true,
                name: true,
                email: true,
              },
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

  public async getModels(
    jobId: string,
  ): Promise<PaginatedData<ModelProfile> | null> {
    const jobModels = await this.db
      .select()
      .from(jobToModelTable)
      .where(eq(jobToModelTable.jobId, jobId));

    if (jobModels.length < 1) {
      return null;
    }

    const modelProfiles = await getModelProfiles({
      ids: jobModels.map((m) => m.modelId),
    });

    return modelProfiles;
  }

  public async addBooking(booking: BookingCreateInput) {
    const res = await this.db
      .insert(bookingTable)
      .values(booking)
      .returning({ id: bookingTable.id });
    return res[0];
  }

  public async removeBooking(bookingId: string) {
    await this.db.delete(bookingTable).where(eq(bookingTable.id, bookingId));
  }

  public async getBookings({
    jobIds,
    page = 1,
    pageSize = 10,
    start,
    end,
    modelIds,
  }: {
    jobIds?: string[] | undefined;
    page?: number;
    pageSize?: number;
    start?: Date;
    end?: Date;
    modelIds?: string[] | undefined;
  }): Promise<PaginatedData<BookingWithJob>> {
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
      jobIds && jobIds.length > 0 ? inArray(jobTable.id, jobIds) : undefined,
      modelIds && modelIds.length > 0
        ? inArray(jobToModelTable.modelId, modelIds)
        : undefined,
    );

    const [rows, counts] = await Promise.all([
      this.db
        .select()
        .from(bookingTable)
        .where(where)
        .innerJoin(jobTable, eq(jobTable.id, bookingTable.jobId))
        .innerJoin(userTable, eq(userTable.id, jobTable.ownerId))
        .leftJoin(fileInfoTable, eq(fileInfoTable.id, userTable.id))
        .leftJoin(jobToModelTable, eq(jobTable.id, jobToModelTable.jobId))
        .leftJoin(modelTable, eq(modelTable.id, jobToModelTable.modelId))
        .leftJoin(modelImageTable, eq(modelTable.id, modelImageTable.modelId)),

      this.db
        .select({ count: count() })
        .from(bookingTable)
        .where(where)
        .innerJoin(jobTable, eq(bookingTable.jobId, jobTable.id))
        .innerJoin(userTable, eq(jobTable.ownerId, userTable.id))
        .leftJoin(fileInfoTable, eq(userTable.imageId, fileInfoTable.id))
        .leftJoin(jobToModelTable, eq(jobTable.id, jobToModelTable.jobId))
        .leftJoin(modelTable, eq(modelTable.id, jobToModelTable.modelId))
        .leftJoin(modelImageTable, eq(modelTable.id, modelImageTable.modelId)),
    ]);
    let jobs = new Map<string, Job>();
    let bookings: BookingWithJob[] = [];
    rows.forEach((row) => {
      if (!jobs.has(row.jobs.id)) {
        jobs.set(row.jobs.id, {
          ...row.jobs,
          owner: { ...row.users, image: row.files },
          models: [],
        });
      }
      if (row.models?.id) {
        jobs.get(row.jobs.id)?.models?.push({
          id: row.models.id,
          name: row.models.name,
          profileImage: row.model_images,
        });
      }
      bookings.push({
        ...row.bookings,
        job: jobs.get(row.jobs.id)!,
      });
    });

    const paginatedBookings = getPagination(
      bookings,
      page,
      pageSize,
      counts[0].count,
    );
    return paginatedBookings;
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
    await this.db
      .update(jobTable)
      .set({ status: "confirmed" })
      .where(and(eq(jobTable.id, jobId), eq(jobTable.status, "pending")))
      .returning({ id: jobTable.id });
  }

  public async cancelJob(jobId: string) {
    await this.db
      .update(jobTable)
      .set({ status: "cancelled" })
      .where(and(eq(jobTable.id, jobId), eq(jobTable.status, "confirmed")));
  }

  public async archiveJob(jobId: string) {
    await this.db
      .update(jobTable)
      .set({ status: "archived" })
      .where(and(eq(jobTable.id, jobId), eq(jobTable.status, "pending")));
  }
}

const jobUsecase = new JobUsecase(db);

export default jobUsecase;
