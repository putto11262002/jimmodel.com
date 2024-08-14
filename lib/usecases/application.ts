import { DB } from "@/db";
import {
  ApplicationCreateInput,
  ApplicationExperienceCreateInput,
  ApplicationImageCreateInput,
  ApplicationStatus,
} from "../types/application";
import {
  applicationExperienceTable,
  applicationImageTable,
  applicationTable,
} from "@/db/schemas/application";
import { ModelUseCase } from "./model";
import { and, asc, count, eq, inArray } from "drizzle-orm";
import { NotFoundError } from "../errors/not-found-error";
import { getOffset, getPagination } from "../utils/pagination";
import { FileUseCase } from "./file";
import ConstraintViolationError from "../errors/contrain-violation-error";

export class ApplictionUseCase {
  private db: DB;
  private modelUseCase: ModelUseCase;
  private fileUseCase: FileUseCase;
  constructor({
    db,
    modelUseCase,
    fileUseCase,
  }: {
    db: DB;
    modelUseCase: ModelUseCase;
    fileUseCase: FileUseCase;
  }) {
    this.db = db;
    this.modelUseCase = modelUseCase;
    this.fileUseCase = fileUseCase;
  }

  public async createApplication(input: ApplicationCreateInput) {
    const createdApplication = await this.db
      .insert(applicationTable)
      .values(input)
      .returning({ id: applicationTable.id });
    if (createdApplication.length < 1) {
      throw new Error("Failed to create application");
    }

    if (input.experiences && input.experiences.length > 0) {
      await this.db.insert(applicationExperienceTable).values(
        input.experiences.map((exp) => ({
          ...exp,
          applicationId: createdApplication[0].id,
        })),
      );
    }

    return { id: createdApplication[0].id };
  }

  /**
   * Mark application as approved and create a new model record
   * */
  public async approveApplication(id: string) {
    const application = await this.db.query.applicationTable.findFirst({
      with: {
        images: true,
        experiences: true,
      },
      where: eq(applicationTable.id, id),
    });

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    if (application.status !== "pending") {
      throw new ConstraintViolationError("Invalid operation");
    }

    await this.db.transaction(async (tx) => {
      await tx
        .update(applicationTable)
        .set({ status: "approved" })
        .where(eq(applicationTable.id, id));

      const { id: modelId } = await this.modelUseCase.createModel(
        {
          ...application,
        },
        tx,
      );

      if (application.experiences && application.experiences.length > 0) {
        await this.modelUseCase.addExperience(
          modelId,
          application.experiences,
          tx,
        );
      }

      if (application.images && application.images.length > 0) {
        await Promise.all(
          application.images.map((image) =>
            this.modelUseCase.addModelImage(
              modelId,
              {
                fileId: image.fileId,
                type: "application",
              },
              tx,
            ),
          ),
        );
      }
    });
  }

  /**
   * Mark applcaition as rejected
   * */
  public async rejectApplication(id: string) {
    const application = await this.db.query.applicationTable.findFirst({
      where: eq(applicationTable.id, id),
    });

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    if (application.status !== "pending") {
      throw new ConstraintViolationError("Invalid operation");
    }

    await this.db
      .update(applicationTable)
      .set({ status: "rejected" })
      .where(eq(applicationTable.id, id));
  }

  /**
   * Get all applications
   * */
  public async getApplications(
    {
      page = 1,
      pageSize = 10,
      statuses,
    }: { page?: number; pageSize?: number; statuses?: ApplicationStatus[] } = {
      statuses: ["pending"],
      page: 1,
      pageSize: 10,
    },
  ) {
    const whereClause = and(
      statuses && statuses.length > 0
        ? inArray(applicationTable.status, statuses)
        : undefined,
    );
    const [applications, counts] = await Promise.all([
      this.db.query.applicationTable.findMany({
        offset: getOffset(page, pageSize),
        limit: pageSize,
        where: whereClause,
        orderBy: [asc(applicationTable.createdAt)],
        with: {
          experiences: true,
        },
      }),

      this.db
        .select({ count: count() })
        .from(applicationTable)
        .where(whereClause),
    ]);

    const paginatedApplications = getPagination(
      applications,
      page,
      pageSize,
      counts[0].count,
    );

    return paginatedApplications;
  }

  async getApplication(id: string) {
    const application = await this.db.query.applicationTable.findFirst({
      where: eq(applicationTable.id, id),
      with: {
        experiences: true,
      },
    });

    if (!application) {
      return null;
    }

    return application;
  }

  public async addExperience(
    applicationId: string,
    input: ApplicationExperienceCreateInput,
  ) {
    const application = await this.db.query.applicationTable.findFirst({
      where: eq(applicationTable.id, applicationId),
    });
    if (!application) {
      throw new NotFoundError("Application not found");
    }
    await this.db.insert(applicationExperienceTable).values({
      ...input,
      applicationId,
    });
  }

  public async addImage(
    applicationId: string,
    image: ApplicationImageCreateInput,
  ) {
    let fileId: string;
    if ("file" in image) {
      const { id } = await this.fileUseCase.writeFile(image.file);
      fileId = id;
    } else {
      fileId = image.fileId;
    }

    await this.db.insert(applicationImageTable).values({
      applicationId,
      fileId: fileId,
      type: image.type,
    });
  }

  public async getImages(applicationId: string) {
    const images = await this.db
      .select()
      .from(applicationImageTable)
      .where(eq(applicationImageTable.applicationId, applicationId));
    return images;
  }
}
