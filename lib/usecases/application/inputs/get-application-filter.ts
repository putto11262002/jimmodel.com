import { Application } from "@/lib/domains/types/application/application";

export type GetApplicationFilter = {
  status?: Application["status"];
  notStatus?: Application["status"];
};
