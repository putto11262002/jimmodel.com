"use server";

import { revalidatePath } from "next/cache";
import { JobCreateInput, JobUpdateInput } from "@/db/schemas";
import jobUsecase from "@/lib/usecases/job";
import { auth } from "../auth";
import { intersection } from "lodash";

export const addJobAction = async (input: Omit<JobCreateInput, "ownerId">) => {
  const session = await auth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  if (intersection(session.user.roles, ["admin", "staff"]).length < 1) {
    throw new Error("Forbidden");
  }
  const id = await jobUsecase.addJob({ ...input, ownerId: session.user.id });

  if (!id) {
    throw new Error("Failed to add job");
  }

  revalidatePath("/admin/jobs", "layout");
  return id;
};

export const updateJobAction = async (id: string, input: JobUpdateInput) => {
  const session = await auth();

  if (!session) {
    throw new Error("Unauthorized");
  }

  if (intersection(session.user.roles, ["admin", "staff"]).length < 1) {
    throw new Error("Forbidden");
  }

  const _id = await jobUsecase.update(id, input);

  if (!_id) {
    throw new Error("Failed to update job");
  }

  revalidatePath("/admin/jobs", "layout");
  return _id;
};
