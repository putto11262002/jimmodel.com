import { DB } from "@/db";
import { UserRole, userTable } from "@/db/schemas/users";
import ConstraintViolationError from "../errors/contrain-violation-error";
import { or, eq, count } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { UserWithoutSecrets, UserCreateInput } from "../types/user";
import { FileUseCase } from "./file";
import { getOffset, getPagination } from "../utils/pagination";
import { PaginatedData } from "../types/paginated-data";

interface IUserUsecase {
  getById(id: string): Promise<UserWithoutSecrets | null>;
  addImage(userId: string, file: Blob): Promise<void>;
  getAll({}: {
    page?: number;
    pageSize?: number;
  }): Promise<PaginatedData<UserWithoutSecrets>>;
}
export class UserUsecase implements IUserUsecase {
  private db: DB;
  private fileUseCase: FileUseCase;
  constructor(db: DB, fileUseCase: FileUseCase) {
    this.db = db;
    this.fileUseCase = fileUseCase;
  }
  public async getById(id: string): Promise<UserWithoutSecrets | null> {
    const user = await this.db.query.userTable.findFirst({
      columns: {
        password: false,
      },
      with: {
        image: true,
      },
      where: eq(userTable.id, id),
    });
    if (!user) {
      return null;
    }
    return user;
  }

  async addImage(userId: string, file: Blob): Promise<void> {
    const existingImage = await this.db
      .update(userTable)
      .set({ imageId: null })
      .where(eq(userTable.id, userId))
      .returning({ imageId: userTable.id });

    if (existingImage?.length > 0 && existingImage[0]?.imageId) {
      await this.fileUseCase.deleteFile(existingImage[0].imageId);
    }

    const newFile = await this.fileUseCase.writeFile(file);
    await this.db
      .update(userTable)
      .set({ imageId: newFile.id })
      .where(eq(userTable.id, userId));
  }

  async getAll(
    { page = 1, pageSize = 10 }: { page?: number; pageSize?: number } = {
      page: 1,
      pageSize: 10,
    },
  ) {
    const [users, userCount] = await Promise.all([
      this.db.query.userTable.findMany({
        limit: pageSize,
        offset: getOffset(page, pageSize),
        columns: {
          password: false,
        },
        with: {
          image: true,
        },
      }),
      this.db.select({ count: count() }).from(userTable),
    ]);
    const paginatedData = getPagination(
      users,
      page,
      pageSize,
      userCount[0].count,
    );
    return paginatedData;
  }

  async createUser(input: UserCreateInput): Promise<void> {
    const existingUser = await this.db.query.userTable.findFirst({
      where: or(
        eq(userTable.email, input.email),
        eq(userTable.username, input.username),
      ),
    });

    if (existingUser) {
      throw new ConstraintViolationError("User already exists");
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(input.password, salt);

    await this.db.insert(userTable).values({
      username: input.username,
      email: input.email,
      name: input.name,
      password: hashedPassword,
      roles: input.roles,
    });
  }
  async updateUserRole(userId: string, roles: UserRole[]) {
    await this.db
      .update(userTable)
      .set({ roles: roles })
      .where(eq(userTable.id, userId))
      .returning({ updatedId: userTable.id });
  }

  async resetPassword(userId: string, newPassword: string): Promise<void> {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);
    await this.db
      .update(userTable)
      .set({ password: hashedPassword })
      .where(eq(userTable.id, userId))
      .returning({ updatedId: userTable.id });
  }

  async findByUsernameOrEmail(
    usernameOrEmail: string,
  ): Promise<UserWithoutSecrets | null> {
    const user = await this.db.query.userTable.findFirst({
      where: or(
        eq(userTable.username, usernameOrEmail),
        eq(userTable.email, usernameOrEmail),
      ),
      columns: { password: false },
      with: {
        image: true,
      },
    });
    if (!user) {
      return null;
    }
    return user;
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

  // async getUsers({
  //   roles,
  //   page,
  //   pageSize = 10,
  // }: {
  //   roles: UserRole[];
  //   page: number;
  //   pageSize?: number;
  // }) {
  //   const whereClause = and(
  //     ...[...(roles.length > 0 ? [arrayContains(userTable.roles, roles)] : [])],
  //   );
  //   const offset = (page - 1) * pageSize;
  //   const [users, userCounts] = await Promise.all([
  //     this.db
  //       .select()
  //       .from(userTable)
  //       .where(whereClause)
  //       .offset(offset)
  //       .limit(pageSize),
  //     this.db.select({ total: count() }).from(userTable).where(whereClause),
  //   ]);
  //   const paginated = paginate({
  //     data: users,
  //     page,
  //     pageSize,
  //     total: userCounts[0].total,
  //   });
  //
  //   return paginated;
  // }
}
