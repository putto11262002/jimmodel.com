"use server";

import { revalidatePath } from "next/cache";
import { BaseActionResult } from "../common";

export const revalidatePublicSite = async (): Promise<BaseActionResult> => {
  revalidatePath("/", "layout");
  return { status: "success", message: "Revalidation public site started" };
};
