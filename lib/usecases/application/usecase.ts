import {
  applicationExperienceTable,
  applicationImageTable,
  applicationTable,
} from "@/db/schemas";
import { ModelUseCase } from "../model";
import { and, count, eq, not } from "drizzle-orm";
import jwt from "jsonwebtoken";
import dayjs from "dayjs";
import {
  GetApplicationFilter,
  CompletedApplication as CompletedApplication,
  GetApplicationsFilter,
  ApplicationUpdateInput,
  ApplicationImageCreateInput,
  ApplicationExperienceCreateInput,
  CompletedApplicationSchema,
  DEFAULT_GET_APPLICATION_FILTER,
} from "./inputs";
import { ActionNotAllowedError, NotFoundError } from "@/lib/errors";
import { FileUseCase } from "../file";
import {
  Application,
  ApplicationImage,
  ApplicationExperience,
} from "@/lib/domains";
import { AppConfig } from "@/config/global";
import { getOffset, paginate } from "@/lib/utils/pagination";
import { getOrderDirFn } from "../common/helpers/get-order-dir-fn";
import { ImageUseCase } from "../image";
import { ModelImageCreateInput } from "../model";
import { v4 as uuid } from "uuid";
import {
  ApplicationSubmissionInput,
  ApplicationSubmissionInputSchema,
} from "./inputs/application-submission-input";
import { ValidationError } from "@/lib/errors/validation-error";
import { FieldsValidationError } from "@/lib/types/validation";
import { DB } from "@/db/config";
import { APPLICATION_STATUS, BOOKING_STATUS } from "@/db/constants";

export class ApplicationUseCase {
  private db: DB;
  private modelUseCase: ModelUseCase;
  private fileUseCase: FileUseCase;
  private secret: string;
  private config: AppConfig;
  private imageUseCase: ImageUseCase;
  constructor({
    db,
    modelUseCase,
    fileUseCase,
    config,
    imageUseCase,
  }: {
    db: DB;
    modelUseCase: ModelUseCase;
    fileUseCase: FileUseCase;
    config: AppConfig;
    imageUseCase: ImageUseCase;
  }) {
    this.db = db;
    this.modelUseCase = modelUseCase;
    this.fileUseCase = fileUseCase;
    // HACK: use a random secret for now
    this.secret = "random";
    this.config = config;
    this.imageUseCase = imageUseCase;
  }

  // generate a token that is valid for a specifc period. The user can use this token to modify the application. when once finalize, the token is invalidated. After a specific period, the token is invalidated and the application is deleted.
  private generatgeApplicationToken(id: Application["id"]): {
    token: string;
    expiredAt: Date;
  } {
    const expiredAt = dayjs().add(1, "hour").toDate();
    const exp = Math.floor(expiredAt.getTime() / 1000);

    const token = jwt.sign({ exp, id }, this.secret);
    return { token, expiredAt };
  }

  private verifyApplicationToken(
    token: string
  ):
    | { state: "expired"; id: string }
    | { state: "invalid" }
    | { state: "valid"; id: string } {
    try {
      const payload = jwt.verify(token, this.secret);
      return { state: "valid", id: (payload as any).id as Application["id"] };
    } catch (e) {
      if (e instanceof jwt.TokenExpiredError) {
        const payload = jwt.decode(token);
        return {
          state: "expired",
          id: (payload as any).id as Application["id"],
        };
      } else {
        return { state: "invalid" };
      }
    }
  }

  getApplicationIdByToken(token: string): Application["id"] | null {
    const result = this.verifyApplicationToken(token);
    if (result.state !== "valid") {
      if (result.state === "expired") {
        // TODO:: Send this to be deleted in the event queue
      }
      return null;
    }
    return result.id;
  }

  // verify the token and get the application id
  // if token expired throw delete the application retrurn null
  // if token is invalid return null
  async getApplicationByToken(token: string): Promise<Application | null> {
    const id = this.getApplicationIdByToken(token);
    if (!id) {
      return null;
    }
    const application = await this._getApplication(id, {
      status: APPLICATION_STATUS.IN_PROGRESS,
    });

    if (!application) {
      return null;
    }

    const isExpired = dayjs(application.expiredAt).isBefore(dayjs());
    if (isExpired) {
      // TODO: send this to be deleted in event queue
    }
    return application;
  }

  public async createApplication(): Promise<{
    token: string;
    expiredAt: Date;
  }> {
    const applicationId = uuid();
    const { token, expiredAt } = this.generatgeApplicationToken(applicationId);
    await this.db
      .insert(applicationTable)
      .values({
        status: APPLICATION_STATUS.IN_PROGRESS,
        expiredAt: expiredAt.toISOString(),
        id: applicationId,
      })
      .returning({ id: applicationTable.id })
      .then((res) => res[0].id);

    return { token, expiredAt };
  }

  public async safeValidateApplication(token: string): Promise<
    | { ok: true; application: Application; errors: undefined }
    | {
        ok: false;
        application: Application;
        errors: FieldsValidationError<
          CompletedApplication & { images: string }
        >;
      }
  > {
    let ok = true;
    let errors:
      | FieldsValidationError<CompletedApplication & { images: string }>
      | undefined = {};
    const application = await this.getApplicationByToken(token);
    if (!application) {
      throw new NotFoundError("Application not found");
    }
    const applicationValidation =
      CompletedApplicationSchema.safeParse(application);
    if (!applicationValidation.success) {
      ok = false;
      errors = applicationValidation.error.flatten().fieldErrors;
    }

    const images = await this.getImages(application.id);
    if (images.length < 3) {
      ok = false;
      errors.images = ["At least 3 images are required"];
    }

    if (ok) {
      return { ok: true, application, errors: undefined };
    } else {
      return { ok: false, errors, application };
    }
  }

  public async submitApplication(
    token: string,
    input: ApplicationSubmissionInput
  ) {
    const inputValidaiton = ApplicationSubmissionInputSchema.safeParse(input);
    if (!inputValidaiton.success) {
      throw new ValidationError(inputValidaiton.error.flatten().fieldErrors);
    }

    const res = await this.safeValidateApplication(token);
    if (!res.ok) {
      throw new ActionNotAllowedError("Cannot submit application");
    }
    await this.db
      .update(applicationTable)
      .set({ status: APPLICATION_STATUS.SUBMITTED, submittedAt: new Date() })
      .where(eq(applicationTable.id, res.application.id));
  }

  /**
   * Mark application as approved and create a new model record
   * */
  public async approveApplication(id: Application["id"]) {
    const application = await this._getApplication(id);

    if (!application) {
      throw new NotFoundError("Application not found");
    }

    if (application.status !== APPLICATION_STATUS.SUBMITTED) {
      throw new ActionNotAllowedError(
        "Cannot approve application that is not submitted"
      );
    }

    // 1. Mark application as approved
    // 2. Create a new model record
    // 3. Add experiences to the model
    // 4. Add images to the model
    // 4. Add close up image to the model profile
    await this.db.transaction(async (tx) => {
      const validation = CompletedApplicationSchema.safeParse(application);
      if (!validation.success) {
        throw new ValidationError(
          validation.error.flatten().fieldErrors,
          "Application is not completed"
        );
      }

      const modelId = await this.modelUseCase.createModel(
        {
          ...validation.data,
          bookingStatus:
            application.country && application.country === this.config.country
              ? BOOKING_STATUS.LOCAL
              : BOOKING_STATUS.DIRECT_BOOKING,
        },
        tx
      );

      const experiences = await this.getApplicationExperiences(id);
      await this.modelUseCase.addExperience(modelId, experiences, tx);

      const images = await this.getImages(id);

      await Promise.all(
        images.map((image) => {
          const input: ModelImageCreateInput = {
            fileId: image.fileId,
            type: "application",
          };
          return this.modelUseCase.addModelImage(modelId, input, tx);
        })
      );

      await tx
        .update(applicationTable)
        .set({ status: APPLICATION_STATUS.APPROVED, modelId })
        .where(eq(applicationTable.id, id));
    });
  }

  public async updateApplication(
    token: string,
    input: ApplicationUpdateInput
  ): Promise<void> {
    const application = await this.getApplicationByToken(token);
    if (!application) {
      throw new NotFoundError("Application not found");
    }
    await this.db
      .update(applicationTable)
      .set(input)
      .where(eq(applicationTable.id, application.id));
  }

  /**
   * Mark applcaition as rejected
   * */
  public async rejectApplication(id: string) {
    const application = await this._getApplication(id);
    if (!application) {
      throw new NotFoundError("Application not found");
    }

    if (application.status !== APPLICATION_STATUS.SUBMITTED) {
      throw new ActionNotAllowedError(
        "Cannot reject application that is not submitted"
      );
    }

    await this.db
      .update(applicationTable)
      .set({ status: APPLICATION_STATUS.REJECTED })
      .where(eq(applicationTable.id, id));
  }

  // assuming forienfg kety on child table is set to on delete cascade
  public async deleteApplication(id: string) {
    await this.db.transaction(async (tx) => {
      const deletedImages = await tx
        .delete(applicationImageTable)
        .where(eq(applicationImageTable.applicationId, id))
        .returning({ fileId: applicationImageTable.fileId });
      await Promise.all(
        deletedImages.map(({ fileId }) => this.fileUseCase.delete(fileId, tx))
      );
      const deletedApplication = await tx
        .delete(applicationTable)
        .where(eq(applicationTable.id, id))
        .returning({ id: applicationTable.id });

      if (!deletedApplication) {
        throw new NotFoundError("Application not found");
      }
    });
  }

  /**
   * Get all applications
   * */
  public async getApplications({
    page = DEFAULT_GET_APPLICATION_FILTER.page,
    pageSize = DEFAULT_GET_APPLICATION_FILTER.pageSize,
    pagination = DEFAULT_GET_APPLICATION_FILTER.pagination,
    status,
    orderBy = DEFAULT_GET_APPLICATION_FILTER.orderBy,
    orderDir = DEFAULT_GET_APPLICATION_FILTER.orderDir,
  }: GetApplicationsFilter = DEFAULT_GET_APPLICATION_FILTER) {
    const whereClause = and(
      status ? eq(applicationTable.status, status) : undefined,
      not(eq(applicationTable.status, APPLICATION_STATUS.IN_PROGRESS))
    );

    const result = await Promise.all([
      this.db.query.applicationTable.findMany({
        offset: pagination ? getOffset(page, pageSize) : undefined,
        limit: pagination ? pageSize : 100,
        where: whereClause,
        orderBy: [getOrderDirFn(orderDir)(applicationTable[orderBy])],
      }),

      ...(pagination
        ? [
            this.db
              .select({ count: count() })
              .from(applicationTable)
              .where(whereClause),
          ]
        : []),
    ]);

    return paginate({
      data: result[0],
      page: pagination ? page : 1,
      pageSize: pagination ? pageSize : result[0].length,
      total: pagination ? result[1][0].count : result[0].length,
    });
  }

  async getApplication(id: Application["id"]): Promise<Application | null> {
    return this._getApplication(id, {
      notStatus: APPLICATION_STATUS.IN_PROGRESS,
    });
  }

  private async _getApplication(
    id: Application["id"],
    { status, notStatus }: GetApplicationFilter = {}
  ) {
    const application = await this.db.query.applicationTable.findFirst({
      where: and(
        eq(applicationTable.id, id),
        status ? eq(applicationTable.status, status) : undefined,
        notStatus ? not(eq(applicationTable.status, notStatus)) : undefined
      ),
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
    token: string,
    input: ApplicationExperienceCreateInput
  ) {
    const application = await this.getApplicationByToken(token);
    if (!application) {
      throw new NotFoundError("Application not found");
    }
    await this.db.insert(applicationExperienceTable).values({
      ...input,
      applicationId: application.id,
    });
  }

  public async getApplicationExperienceByToken(token: string) {
    const id = this.getApplicationIdByToken(token);
    if (!id) {
      return null;
    }
    return this.getApplicationExperiences(id);
  }

  public async getApplicationExperiences(
    applicationId: Application["id"]
  ): Promise<ApplicationExperience[]> {
    return this.db.query.applicationExperienceTable.findMany({
      where: eq(applicationExperienceTable.applicationId, applicationId),
    });
  }

  public async addImage(token: string, input: ApplicationImageCreateInput) {
    const application = await this.getApplicationByToken(token);
    if (!application) {
      throw new NotFoundError("Application not found");
    }
    const imageMetadata = await this.imageUseCase.upload(input.file, {
      format: "jpeg",
    });

    await this.db.insert(applicationImageTable).values({
      applicationId: application.id,
      fileId: imageMetadata.id,
      type: input.type,
      width: imageMetadata.metadata.width,
      height: imageMetadata.metadata.height,
    });
  }

  async getImages(
    applicationId: Application["id"]
  ): Promise<ApplicationImage[]> {
    const images = await this.db.query.applicationImageTable.findMany({
      where: eq(applicationImageTable.applicationId, applicationId),
    });
    return images;
  }

  async getImagesByToken(token: string): Promise<ApplicationImage[] | null> {
    const id = this.getApplicationIdByToken(token);
    if (!id) {
      return null;
    }
    return this.getImages(id);
  }
}
