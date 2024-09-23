import { DB, TX } from "@/db/config";

/**
 * Executes a callback function within a transaction context.
 * If a transaction (`tx`) is provided, it uses that transaction;
 * otherwise, it creates a new transaction using the database instance (`db`).
 *
 * This method is useful when you want to ensure that a block of code
 * executes within a transaction, but you may already have an active
 * transaction available or need to create a new one for isolated operations.
 *
 * @param cb - The callback function to execute, which accepts a transaction object.
 * @param db - The database instance to use for creating a new transaction if needed.
 * @param tx - An optional transaction object. If provided, it will be used for the operation.
 * @returns A Promise that resolves when the callback function completes.
 */
export const withTransaction = <T>(
  cb: (tx: TX) => Promise<T>,
  db: DB,
  tx?: TX
) => (tx ? cb(tx) : db.transaction(cb));

/**
 * Executes a callback function using either a provided transaction or the database instance.
 * If a transaction (`tx`) is supplied, it uses that transaction;
 * otherwise, it uses the database instance (`db`) directly.
 *
 * This method is useful when you have operations that may or may not
 * require a transaction. It allows you to write code that can be executed
 * in the context of an existing transaction or directly against the database
 * when no transaction is needed.
 *
 * @param cb - The callback function to execute, which accepts either a transaction object or a database instance.
 * @param db - The database instance to use when no transaction is provided.
 * @param tx - An optional transaction object. If provided, it will be used for the operation.
 * @returns A Promise that resolves when the callback function completes.
 */
export const withOptionalTransaction = <T>(
  cb: (db: TX | DB) => Promise<T>,
  db: DB,
  tx?: TX
) => (tx ? cb(tx) : cb(db));
