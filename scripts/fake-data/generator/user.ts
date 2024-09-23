import { UserCreateInput } from "@/lib/usecases";
import { faker } from "@faker-js/faker";

export const generateStaffUserCreateInput = ({
  password = "password",
}: {
  password?: string;
}): UserCreateInput => {
  // HACK: Prevent collision
  const id = Math.random().toString(36).substring(0, 3);
  const userCreateInput: UserCreateInput = {
    name: faker.person.fullName(),
    username: `${faker.internet.userName()}_${id}`,
    email: `${faker.internet.email()}_${id}`,
    roles: ["staff"],
    password,
    confirmPassword: password,
  };
  return userCreateInput;
};
