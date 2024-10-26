import { z } from "zod";
import { UserRolesUpdateInput } from "./type";

export const UserRolesInputSchema = z.object({
  roles: z.array(z.enum(["admin", "staff", "IT"])),
});
