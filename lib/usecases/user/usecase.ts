import { DB } from "@/db/config";
import {
  ActionNotAllowedError,
  ConstraintViolationError,
  ForbiddenError,
  NotFoundError,
} from "@/lib/errors";
import { or, eq, count, and, arrayOverlaps, ilike } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { getOffset, paginate } from "@/lib/utils/pagination";
import { FileUseCase } from "../file";
import { UserWithoutSecrets } from "@/lib/domains";
import { ImageUseCase } from "../image";
import { withPagination } from "../common/helpers/with-pagination";
import {
  GetUsersFilter,
  RootUserCreateInput,
  UserCreateInput,
  UserRolesUpdateInput,
} from "./inputs";
import { EventHub } from "@/lib/event-hub";
import { USER_IMAGE_UPDATED_EVENT, UserEventMap } from "./event";
import { userTable } from "@/db/schemas";
import crypto from "crypto";

const random = (bytes: number) => {
  if (bytes <= 0) {
    throw new RangeError("Number of bytes must be a positive integer.");
  }
  const buffer = crypto.randomBytes(bytes);
  return Array.from(buffer); // Convert Buffer to Array
};

bcrypt.setRandomFallback(random);

const userWithSecretsColumns = {
  password: false,
} as const;

const userWithoutSecretsSelect = {
  id: userTable.id,
  name: userTable.name,
  username: userTable.username,
  email: userTable.email,
  roles: userTable.roles,
  imageId: userTable.imageId,
  createdAt: userTable.createdAt,
  updatedAt: userTable.updatedAt,
} as const;

export class UserUseCase<TUserEventMap extends UserEventMap = any> {
  private db: DB;
  private fileUseCase: FileUseCase;
  private imageUseCase: ImageUseCase;
  private userEventHub?: EventHub<TUserEventMap>;
  constructor({
    db,
    fileUseCase,
    imageUseCase,
    userEventHub,
  }: {
    db: DB;
    fileUseCase: FileUseCase;
    imageUseCase: ImageUseCase;
    userEventHub?: EventHub<TUserEventMap>;
  }) {
    this.db = db;
    this.fileUseCase = fileUseCase;
    this.imageUseCase = imageUseCase;
    this.userEventHub = userEventHub;
  }

  public async createRootUser(input: RootUserCreateInput): Promise<string> {
    const user = await this.db.query.userTable.findFirst({
      where: arrayOverlaps(userTable.roles, ["root"]),
    });
    if (user) {
      throw new ConstraintViolationError("Root user already exists");
    }
    const existingUser = await this.db.query.userTable.findFirst({
      where: or(
        eq(userTable.email, input.email),
        eq(userTable.username, input.username)
      ),
      columns: { id: true },
    });

    if (existingUser) {
      throw new ConstraintViolationError("User already exists");
    }
    const hashedPassword = await this.hashPassword(input.password);

    return this.db
      .insert(userTable)
      .values({
        roles: ["root"],
        username: input.username,
        email: input.email,
        name: input.name,
        password: hashedPassword,
      })
      .returning({ id: userTable.id })
      .then((res) => res[0].id);
  }

  async createUser(input: UserCreateInput): Promise<string> {
    const existingUser = await this.db.query.userTable.findFirst({
      where: or(
        eq(userTable.email, input.email),
        eq(userTable.username, input.username)
      ),
      columns: { id: true },
    });

    if (existingUser) {
      throw new ConstraintViolationError("User already exists");
    }

    const hashedPassword = await this.hashPassword(input.password);

    const createdUser = await this.db
      .insert(userTable)
      .values({
        roles: input.roles || [],
        username: input.username,
        email: input.email,
        name: input.name,
        password: hashedPassword,
      })
      .returning(userWithoutSecretsSelect)
      .then((res) => res[0].id);
    return createdUser;
  }

  public async getUser(id: string): Promise<UserWithoutSecrets | null> {
    const user = await this.db.query.userTable.findFirst({
      columns: userWithSecretsColumns,
      where: eq(userTable.id, id),
    });
    if (!user) {
      return null;
    }
    return user;
  }

  public async getNonRootUser(id: string): Promise<UserWithoutSecrets> {
    const user = await this.db.query.userTable.findFirst({
      columns: userWithSecretsColumns,
      where: and(eq(userTable.id, id)),
    });
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (user.roles.includes("root")) {
      throw new ForbiddenError("Forbidden to perform this action on root user");
    }
    return user;
  }

  public async getRootUser(): Promise<UserWithoutSecrets> {
    const user = await this.db.query.userTable.findFirst({
      where: arrayOverlaps(userTable.roles, ["root"]),
    });
    if (!user) {
      throw new NotFoundError("Root user not found");
    }
    return user;
  }

  async updateProfileImage(userId: string, file: Blob): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    await this._updateProfileImage(user, file);
  }

  async _updateProfileImage(
    user: UserWithoutSecrets,
    file: Blob
  ): Promise<void> {
    const fileMetadata = await this.imageUseCase.upload(file, {
      format: "jpeg",
      resize: { width: 200, height: 200 },
    });

    await this.db
      .update(userTable)
      .set({ imageId: fileMetadata.id })
      .where(eq(userTable.id, user.id));

    if (user.imageId) {
      await this.fileUseCase.delete(user.imageId);
    }
    this.userEventHub?.emit(USER_IMAGE_UPDATED_EVENT, {
      userId: user.id,
      fileId: fileMetadata.id,
    });
  }

  async getUsers({
    page = 1,
    pageSize = 20,
    roles,
    pagination = true,
    q,
  }: GetUsersFilter) {
    const where = and(
      q && q.length > 0 ? ilike(userTable.name, `%${q}%`) : undefined,
      roles && roles.length > 0
        ? arrayOverlaps(userTable.roles, roles)
        : undefined
    );

    const result = await Promise.all([
      withPagination(
        this.db
          .select(userWithoutSecretsSelect)
          .from(userTable)
          .where(where)
          .limit(pageSize)
          .offset(getOffset(page, pageSize))
          .$dynamic(),
        { page, pageSize, pagination }
      ),
      ...(pagination
        ? [this.db.select({ count: count() }).from(userTable).where(where)]
        : []),
    ]);

    return paginate({
      data: result[0],
      page: pagination ? page : 0,
      pageSize: pagination ? pageSize : 0,
      total: pagination ? result[1][0].count : 0,
    });
  }

  async updateUserRoles(userId: string, input: UserRolesUpdateInput) {
    const user = await this.getUser(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (user.roles.includes("root")) {
      throw new ActionNotAllowedError("Cannot modify root user roles");
    }

    await this.db
      .update(userTable)
      .set({ roles: input.roles })
      .where(eq(userTable.id, userId))
      .returning({ updatedId: userTable.id });
  }

  async resetPassword(
    userId: string,
    newPassword: string,
    actorId: string
  ): Promise<void> {
    const user = await this.getUser(userId);
    if (!user) {
      throw new NotFoundError("User not found");
    }
    if (user.roles.includes("root") && actorId !== userId) {
      throw new ActionNotAllowedError("Cannot modify root user password");
    }
    const hashedPassword = await this.hashPassword(newPassword);
    await this.db
      .update(userTable)
      .set({ password: hashedPassword })
      .where(eq(userTable.id, userId));
  }

  public async userExists(userId: string): Promise<boolean> {
    const user = await this.db.query.userTable.findFirst({
      where: eq(userTable.id, userId),
      columns: { id: true },
    });
    return !!user;
  }

  async findByUsernameOrEmail(
    usernameOrEmail: string
  ): Promise<UserWithoutSecrets | null> {
    const user = await this.db.query.userTable.findFirst({
      where: or(
        eq(userTable.username, usernameOrEmail),
        eq(userTable.email, usernameOrEmail)
      ),
      columns: userWithSecretsColumns,
      with: {
        image: true,
      },
    });
    if (!user) {
      return null;
    }
    return user;
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  async comparePassword(userId: string, password: string): Promise<boolean> {
    const users = await this.db
      .select({ password: userTable.password })
      .from(userTable)
      .where(eq(userTable.id, userId))
      .limit(1);
    if (users.length < 1) {
      return Promise.resolve(true);
    }
    const hashedPassword = users[0].password;
    return bcrypt.compare(password, hashedPassword);
  }
}
