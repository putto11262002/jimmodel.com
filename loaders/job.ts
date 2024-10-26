import { jobUseCase } from "@/config";
import { GetBookingsFilter, GetJobsFilter } from "@/lib/usecases/job/inputs";
import { notFound } from "next/navigation";
import { cache } from "react";

export const getJobs = cache(async (filter: GetJobsFilter) => {
  return jobUseCase.getJobs(filter);
});

export const getJobOrThrow = cache(async (id: string) => {
  const job = await jobUseCase.getJob(id);
  if (!job) {
    notFound();
  }
  return job;
});

export const getBookings = cache(async (filter: GetBookingsFilter) => {
  return jobUseCase.getBookings(filter);
});
