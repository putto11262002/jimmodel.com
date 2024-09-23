import { auth, jobUseCase } from "@/config";
import permissions from "@/config/permission";
import { NotFoundError } from "@/lib/errors";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await auth({ permission: permissions.jobs.getJobById });
  const { id } = await params;
  const job = await jobUseCase.getJob(id);
  if (!job) {
    throw new NotFoundError("Job not found");
  }
  return Response.json(job);
};
