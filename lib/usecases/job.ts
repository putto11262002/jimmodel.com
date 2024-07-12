import {
  BookingCreateInput,
  JobCreateInput,
  JobStatus,
  bookingTable,
  jobTable,
  jobToModelTable,
} from "../../db/schemas/jobs";
import { and, count, eq, gte, inArray, lte, or } from "drizzle-orm";
import { getOffset, getPagination } from "../utils/pagination";
import db, { DB } from "../../db/client";
import { ModelProfile } from "@/db/schemas";
import { getModelProfiles } from "./model";
import { PaginatedData } from "../types/paginated-data";
import { BookingWithJob, Job, JobUpdateInput } from "../types/job";

export class JobUsecase {
  private readonly db: DB;
  constructor(db: DB) {
    this.db = db;
  }

  public async getBookingsBetweenRange({
    start,
    end,
    status,
  }: {
    start: Date;
    end: Date;
    status?: JobStatus[];
  }): Promise<BookingWithJob[]> {
    const bookings = await this.db.query.bookingTable.findMany({
      where: or(
        and(
          lte(bookingTable.start, end.toISOString()),
          gte(bookingTable.start, start.toISOString()),
        ),
        and(
          lte(bookingTable.end, end.toISOString()),
          gte(bookingTable.end, start.toISOString()),
        ),
      ),
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
    page,
    pageSize,
  }: {
    page: number;
    pageSize: number;
  }): Promise<PaginatedData<Job>> {
    const whereClause = or();
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
    await this.db.insert(bookingTable).values(booking);
  }

  public async removeBooking(bookingId: string) {
    await this.db.delete(bookingTable).where(eq(bookingTable.id, bookingId));
  }

  public async getBookings(
    jobId: string,
    opts?: {
      page?: number;
      pageSize?: number;
    },
  ) {
    const page = opts?.page || 1;
    const pageSize = opts?.pageSize || 10;
    const [bookings, counts] = await Promise.all([
      this.db
        .select()
        .from(bookingTable)
        .where(eq(bookingTable.jobId, jobId))
        .offset(getOffset(page, pageSize))
        .limit(pageSize),
      this.db
        .select({ count: count() })
        .from(bookingTable)
        .where(eq(bookingTable.jobId, jobId)),
    ]);

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
    const conflicts = await this.db.query.bookingTable.findMany({
      where: or(
        and(
          lte(bookingTable.start, end.toISOString()),
          gte(bookingTable.start, start.toISOString()),
        ),
        and(
          lte(bookingTable.end, end.toISOString()),
          gte(bookingTable.end, start.toISOString()),
        ),
      ),
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
