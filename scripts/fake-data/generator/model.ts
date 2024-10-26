import {
  BOOKING_STATUSES,
  COUNTRIES,
  ETHNICITIES,
  EYE_COLORS,
  GENDERS,
  HAIR_COLORS,
} from "@/db/constants";
import {
  ModelBlockCreateInput,
  ModelCreateInput,
  ModelExperienceCreateInput,
} from "@/lib/usecases";
import { faker } from "@faker-js/faker";
import { addMonths, startOfMonth } from "date-fns";
import { callNTimes, maybe, randomBetween } from "./utils";

export const generateModelCreateInput = (): ModelCreateInput => {
  const model: ModelCreateInput = {
    name: faker.person.fullName(),
    gender: faker.helpers.arrayElement(GENDERS),
    dateOfBirth: faker.date.birthdate().toISOString(),
    phoneNumber: faker.phone.number(),
    email: faker.internet.email(),
    nationality: faker.helpers.arrayElement(COUNTRIES),
    ethnicity: faker.helpers.arrayElement(ETHNICITIES),
    height: faker.number.int({ min: 150, max: 200 }),
    weight: faker.number.int({ min: 40, max: 100 }),
    bust: faker.number.int({ min: 70, max: 120 }),
    chest: faker.number.int({ min: 70, max: 120 }),
    waist: faker.number.int({ min: 50, max: 100 }),
    shoeSize: faker.number.int({ min: 35, max: 45 }),
    braSize: faker.helpers.arrayElement(["A", "B", "C", "D", "DD"]),
    hairColor: faker.helpers.arrayElement(HAIR_COLORS),
    eyeColor: faker.helpers.arrayElement(EYE_COLORS),
    bookingStatus: faker.helpers.arrayElement(BOOKING_STATUSES),
  };
  return model;
};

export const generateModelExperienceCreateInput =
  (): ModelExperienceCreateInput => {
    const modelExperience: ModelExperienceCreateInput = {
      year: faker.date.past().getFullYear(),
      product: faker.commerce.productName(),
      country: faker.helpers.arrayElement(COUNTRIES),
      media: faker.helpers.arrayElement([
        "TV",
        "Print",
        "Runway",
        "Digital",
        "Social Media",
      ]),
    };
    return modelExperience;
  };

export const generateModelBlockCreateInput = (): ModelBlockCreateInput => {
  const startOfThisMonth = startOfMonth(new Date());
  const endOfNextMonth = addMonths(startOfThisMonth, 2);
  const start = faker.date
    .between({ from: startOfThisMonth, to: endOfNextMonth })
    .toISOString();
  const end = faker.date
    .between({ from: start, to: endOfNextMonth })
    .toISOString();
  const modelBlock: ModelBlockCreateInput = {
    start,
    end,
    reason: faker.lorem.sentence(),
  };
  return modelBlock;
};

type GenerateModel = {
  model: ModelCreateInput;
  experiences: ModelExperienceCreateInput[];
  blocks: ModelBlockCreateInput[];
};

export const generateModel = async ({
  n,
  onModel,
}: {
  n: number;
  onModel: (model: GenerateModel) => Promise<void>;
}) => {
  const promises: Promise<void>[] = [];

  for (let i = 0; i < n; i++) {
    const model = generateModelCreateInput();
    const modelExperience = maybe(
      callNTimes(randomBetween(1, 3), generateModelExperienceCreateInput),
      []
    );
    const modelBlock = maybe([generateModelBlockCreateInput()], []);

    // Push the promise to the array
    promises.push(
      onModel({ model, experiences: modelExperience, blocks: modelBlock })
    );
  }

  // Await all promises to ensure all callbacks have completed
  await Promise.all(promises);
};
