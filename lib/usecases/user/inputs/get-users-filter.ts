import { USER_ROLES } from "@/db/constants";
import { ignoreError } from "@/lib/utils/validator";
import { User, UserWithoutSecrets } from "@/lib/domains";
import { z } from "zod";

export type GetUsersFilter = {
  page?: number;
  pageSize?: number;
  pagination?: boolean;
  q?: string;
  roles?: UserWithoutSecrets["roles"];
  userIds?: User["id"][];
};

export const GetUsersFilterSchema = z.object({
  page: ignoreError(z.number().int().positive()),
  pageSize: ignoreError(z.number().int().positive()),
  pagination: ignoreError(z.boolean()),
  q: ignoreError(z.string()),
  roles: ignoreError(z.array(z.enum(USER_ROLES))),
  userIds: ignoreError(z.array(z.string())),
});
