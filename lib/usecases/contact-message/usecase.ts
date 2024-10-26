import { DB } from "@/db/config";
import { ContactMessageCreateInput } from "./inputs/contact-message-create-input";
import { ContactMessage } from "@/lib/domains/types/contact-message";
import { ContactMessagesGetFilter } from "./inputs/get-contact-messages-filter";
import { and, count, eq } from "drizzle-orm";
import { withPagination } from "../common/helpers/with-pagination";
import { paginate } from "@/lib/utils/pagination";
import { PaginatedData } from "@/lib/types/paginated-data";
import { NotFoundError } from "@/lib/errors";
import { contactMessageTable } from "@/db/schemas";

export class ContactMessageUseCase {
  private db: DB;

  constructor({ db }: { db: DB }) {
    this.db = db;
  }

  async createContactMessage(
    input: ContactMessageCreateInput
  ): Promise<ContactMessage> {
    return this.db
      .insert(contactMessageTable)
      .values({ ...input, read: false })
      .returning()
      .then((res) => res[0]);
  }

  async getContactMessages({
    page = 1,
    pageSize = 10,
    pagination = true,
    read,
  }: ContactMessagesGetFilter): Promise<PaginatedData<ContactMessage>> {
    const where = and(
      read !== undefined ? eq(contactMessageTable.read, read) : undefined
    );

    const result = await Promise.all([
      withPagination(
        this.db.select().from(contactMessageTable).where(where).$dynamic(),
        { page, pageSize, pagination }
      ),
      ...(pagination
        ? [
            this.db
              .select({ count: count() })
              .from(contactMessageTable)
              .where(where)
              .then((res) => res[0].count),
          ]
        : []),
    ]);
    return paginate({
      data: result[0],
      total: pagination ? result[1] : result[0].length,
      page: pagination ? page : 1,
      pageSize: pagination ? pageSize : result[0].length,
    });
  }

  async getContactMessage(
    id: ContactMessage["id"]
  ): Promise<ContactMessage | null> {
    const contactMessage = await this.db.query.contactMessageTable.findFirst({
      where: eq(contactMessageTable.id, id),
    });
    return contactMessage ?? null;
  }

  async markContactMessagesAsRead(id: ContactMessage["id"]): Promise<void> {
    const updatedRow = await this.db
      .update(contactMessageTable)
      .set({ read: true })
      .where(eq(contactMessageTable.id, id))
      .returning();
    if (updatedRow.length < 1) {
      throw new NotFoundError("Contact message not found");
    }
  }

  async deleteContactMessage(id: ContactMessage["id"]): Promise<void> {
    const deletedRow = await this.db
      .delete(contactMessageTable)
      .where(eq(contactMessageTable.id, id))
      .returning();
    if (!deletedRow) {
      throw new NotFoundError("Contact message not found");
    }
  }
}
