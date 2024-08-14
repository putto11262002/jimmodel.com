import { DB } from "..";
import seedRootUser from "./root-user";

// Add seed functions here
const seedFns: ((db: DB) => Promise<void>)[] = [seedRootUser];

async function seed(db: DB) {
  await Promise.all(seedFns.map((fn) => fn(db)));
}

export default seed;
