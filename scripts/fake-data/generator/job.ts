import { BookingCreateInput, JobCreateInput } from "@/lib/usecases";
import { faker } from "@faker-js/faker";
import { maybe } from "./utils";
import { addMonths, startOfMonth } from "date-fns";
import { BOOKING_TYPES, JOB_STATUS } from "@/db/constants";

export const generateJobCreateInput = (): JobCreateInput => {
  const jobCreateInput: JobCreateInput = {
    name: faker.lorem.words({ min: 2, max: 4 }),
    product: faker.commerce.product(),
    client: faker.company.name(),
    clientAddress: faker.location.streetAddress(),
    personInCharge: faker.person.fullName(),
    mediaReleased: maybe(
      faker.helpers.arrayElement([
        "TVC",
        "Print",
        "Runway",
        "Digital",
        "Social Media",
      ]),
      undefined
    ),
    periodReleased: maybe(
      faker.helpers.arrayElement(["1 month", "3 months", "6 months", "1 year"]),
      undefined
    ),
    territoriesReleased: maybe(faker.location.country(), undefined),
    termsOfPayment: maybe(faker.lorem.words(), undefined),
    contractDetails: maybe(
      faker.lorem.sentence({ max: 50, min: 10 }),
      undefined,
      0.3
    ),
    status: faker.helpers.arrayElement([
      JOB_STATUS.PENDING,
      JOB_STATUS.CONFIRMED,
    ]),
  };
  return jobCreateInput;
};

export const generateBookingInput = (): BookingCreateInput => {
  const startThisMonth = startOfMonth(new Date());
  const endOfNextMonth = addMonths(startThisMonth, 2);
  const start = faker.date.between({
    from: startThisMonth,
    to: endOfNextMonth,
  });
  const end = faker.date.between({ from: start, to: endOfNextMonth });
  const bookingCreateInput: BookingCreateInput = {
    start: start.toISOString(),
    end: end.toISOString(),
    type: faker.helpers.arrayElement(BOOKING_TYPES),
  };
  return bookingCreateInput;
};
