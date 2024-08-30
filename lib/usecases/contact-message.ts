import { DB } from "@/db";
import {
  ContactMesasgeCreateInput,
  ContactMessage,
} from "../types/contact-messasge";
import { contactMessageTable } from "@/db/schemas";
import { PaginatedData } from "../types/paginated-data";
import { and, count, desc, eq } from "drizzle-orm";
import { getOffset, paginate } from "../utils/pagination";
import { NotFoundError } from "../errors/not-found-error";

export class ContactMesageUseCase {
  private db: DB;
  constructor({ db }: { db: DB }) {
    this.db = db;
  }
  public async createContactMessaage(
    input: ContactMesasgeCreateInput,
  ): Promise<{ id: string }> {
    const result = await this.db
      .insert(contactMessageTable)
      .values({ ...input, name: `${input.firstName} ${input.lastName}` })
      .returning({ id: contactMessageTable.id });
    return result?.[0];
  }

  public async getContactMessage(id: string): Promise<ContactMessage | null> {
    const contactMessage = await this.db.query.contactMessageTable.findFirst({
      where: eq(contactMessageTable.id, id),
    });
    if (!contactMessage) {
      return null;
    }
    return contactMessage;
  }

  public async getContactMessages({
    page,
    pageSize,
    read,
    from,
    to,
  }: {
    page?: number;
    pageSize?: number;
    read?: boolean;
    from?: Date;
    to?: Date;
  }): Promise<PaginatedData<ContactMessage>> {
    const where = and(
      typeof read === "boolean"
        ? eq(contactMessageTable.read, read)
        : undefined,
    );
    page = page || 1;
    pageSize = pageSize || 10;
    const [contactMessages, counts] = await Promise.all([
      this.db.query.contactMessageTable.findMany({
        where,
        limit: pageSize,
        offset: getOffset(page, pageSize),
        orderBy: [desc(contactMessageTable.createdAt)],
      }),
      this.db.select({ count: count() }).from(contactMessageTable).where(where),
    ]);
    const paginated = paginate({
      page,
      pageSize,
      total: counts[0].count,
      data: contactMessages,
    });
    return paginated;
  }

  public async markAsRead(id: string): Promise<void> {
    const contactMessage = await this.db.query.contactMessageTable.findFirst({
      where: eq(contactMessageTable.id, id),
    });
    if (!contactMessage) {
      throw new NotFoundError("Contact message not found");
    }
    await this.db
      .update(contactMessageTable)
      .set({ read: true })
      .where(eq(contactMessageTable.id, id));
  }
}
