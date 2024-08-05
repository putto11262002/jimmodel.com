import seedRootUser from "./root-user";
async function seed(...fns: (() => Promise<void>)[]) {
  await Promise.all(fns.map((fn) => fn()));
  console.log("Seed completed");
  process.exit(0);
}

seed(seedRootUser);
