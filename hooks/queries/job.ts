import useToast from "@/components/toast";
import { BookingCreateInput, JobUpdateInput } from "@/db/schemas";
import client from "@/lib/api/client";
import { Booking, Job, JobCreateInput, JobStatus } from "@/lib/types/job";
import { Model } from "@/lib/types/model";
import { PaginatedData } from "@/lib/types/paginated-data";
import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

export const useDeleteBooking = (
  opts?: UseMutationOptions<void, Error, { id: string; jobId: string }>,
) => {
  const queryClient = useQueryClient();
  const { ok, error } = useToast();
  return useMutation({
    ...opts,
    mutationFn: async ({ id, jobId }: { id: string; jobId: string }) => {
      await client.api.bookings[":id"].$delete({ param: { id } });
    },
    onSuccess: (_, { jobId }) => {
      ok("Booking deleted successfully");

      queryClient.invalidateQueries({ queryKey: ["jobs", jobId, "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
    onError: () => {
      error("Failed to delete booking");
    },
  });
};

export const useDeleteModel = ({
  opts,
  _client,
}: {
  opts?: UseMutationOptions<void, Error, { modelId: string; jobId: string }>;
  _client?: QueryClient;
} = {}) => {
  const queryClient = _client || useQueryClient();
  const { ok, error } = useToast();
  return useMutation(
    {
      ...opts,
      mutationFn: async ({
        modelId,
        jobId,
      }: {
        jobId: string;
        modelId: string;
      }) => {
        await client.api.jobs[":id"].models[":modelId"].$delete({
          param: { id: jobId, modelId },
        });
      },
      onSuccess: (_, { jobId }) => {
        ok("Model deleted successfully");
        queryClient.invalidateQueries({ queryKey: ["jobs", jobId] });
      },
      onError: () => {
        error("Failed to delete model");
      },
    },
    queryClient,
  );
};
export const useGetJobModels = ({
  jobId,
  ...opts
}: { jobId: string } & Omit<
  UseQueryOptions<Model[], Error, Model[]>,
  "queryFn" | "queryKey"
>) => {
  return useQuery({
    ...opts,
    queryKey: ["jobs", jobId, "models"],
    queryFn: async () => {
      const res = await client.api.jobs[":id"].models.$get({
        param: { id: jobId },
      });
      return res.json();
    },
  });
};

export const useGetJob = ({
  jobId,
  ...opts
}: {
  jobId: string;
} & Omit<UseQueryOptions<Job, Error, Job>, "queryKey" | "queryFn">) => {
  return useQuery({
    ...opts,
    queryKey: ["jobs", jobId],
    queryFn: async () => {
      const res = await client.api.jobs[":id"].$get({
        param: { id: jobId },
      });
      return res.json();
    },
  });
};

export const useUpdateJob = ({
  opts,
}: {
  opts?: UseMutationOptions<
    { id: string },
    Error,
    { jobId: string; formData: JobUpdateInput }
  >;
} = {}) => {
  const { ok, error } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    ...opts,
    mutationFn: async ({
      jobId,
      formData,
    }: {
      jobId: string;
      formData: JobUpdateInput;
    }) => {
      const res = await client.api.jobs[":id"].$put({
        param: { id: jobId },
        json: formData,
      });
      const data = await res.json();
      return data;
    },
    onSuccess: (...args) => {
      ok("Job updated successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      opts?.onSuccess?.(...args);
    },
    onError: (...args) => {
      error(args[0].message);
      opts?.onError?.(...args);
    },
  });
};

export const useAddJob = ({
  _client,
  opts,
}: {
  _client?: QueryClient;
  opts?: UseMutationOptions<
    { id: string },
    Error,
    { input: Omit<JobCreateInput, "ownerId"> }
  >;
} = {}) => {
  const queryClient = _client || useQueryClient();
  const { ok, error } = useToast();
  return useMutation(
    {
      ...opts,
      mutationFn: async ({
        input,
      }: {
        input: Omit<JobCreateInput, "ownerId">;
      }) => {
        const res = await client.api.jobs.$post({ json: input });
        return res.json();
      },
      onSuccess: (...args) => {
        ok("Job added successfully");
        queryClient.invalidateQueries({ queryKey: ["jobs"] });
        opts?.onSuccess && opts?.onSuccess(...args);
      },
      onError: (...args) => {
        error("Failed to add job");
        opts?.onError && opts?.onError(...args);
      },
    },
    queryClient,
  );
};

export const useAddModel = (
  opts?: UseMutationOptions<void, Error, { jobId: string; modelId: string }>,
) => {
  const queryClient = useQueryClient();
  const { ok, error } = useToast();
  return useMutation({
    ...opts,
    mutationFn: async ({
      modelId,
      jobId,
    }: {
      modelId: string;
      jobId: string;
    }) => {
      await client.api.jobs[":id"].models.$post({
        param: { id: jobId },
        json: { modelId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
      ok("Model successfully added to job");
    },
  });
};

export const useConfrirmJob = () => {
  const queryClient = useQueryClient();
  const { ok, error } = useToast();
  return useMutation({
    mutationFn: async ({ jobId }: { jobId: string }) => {
      await client.api.jobs[":id"].confirm.$post({ param: { id: jobId } });
    },
    onSuccess: () => {
      ok("Job confirmed successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => {
      error("Failed to confirm job");
    },
  });
};

export const useCancelJob = () => {
  const queryClient = useQueryClient();
  const { ok, error } = useToast();
  return useMutation({
    mutationFn: async ({ jobId }: { jobId: string }) => {
      await client.api.jobs[":id"].cancel.$post({ param: { id: jobId } });
    },
    onSuccess: () => {
      ok("Job cancelled successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => {
      error("Failed to cancel job");
    },
  });
};

export const useArchive = () => {
  const queryClient = useQueryClient();
  const { ok, error } = useToast();
  return useMutation({
    mutationFn: async ({ jobId }: { jobId: string }) => {
      await client.api.jobs[":id"].archive.$post({ param: { id: jobId } });
    },
    onSuccess: () => {
      ok("Job archived successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs"] });
    },
    onError: () => {
      error("Failed to archive job");
    },
  });
};

export function useGetJobs({
  page,
  pageSize,
  statuses,
  ...opts
}: { page?: number; pageSize?: number; statuses?: JobStatus[] } & Omit<
  UseQueryOptions<PaginatedData<Job>, Error, PaginatedData<Job>>,
  "queryFn" | "queryKey"
> = {}) {
  return useQuery({
    ...opts,
    queryKey: ["jobs", { page, statuses }],
    queryFn: async () => {
      const res = await client.api.jobs.$get({
        query: {
          page: page?.toString(),
          pageSize: pageSize?.toString(),
          statuses,
        },
      });
      const data = await res.json();
      return data;
    },
  });
}

export function useGetJobBookings({
  jobId,
  ...props
}: {
  jobId: string;
} & Omit<
  UseQueryOptions<Booking[], Error, Booking[]>,
  "queryKey" | "queryFn"
>) {
  return useQuery({
    ...props,
    queryKey: ["jobs", jobId, "bookings"],
    queryFn: async () => {
      const res = await client.api.jobs[":id"].bookings.$get({
        param: { id: jobId },
      });
      let data = await res.json();
      return data;
    },
  });
}

export function useGetConflictingBookings({
  start,
  end,
  jobId,
  ...opts
}: {
  start: Date;
  end: Date;
  jobId: string;
} & Omit<
  UseQueryOptions<Booking[], Error, Booking[]>,
  "queryFn" | "queryKey"
>) {
  return useQuery({
    ...opts,
    queryKey: ["bookings", "conflicting", { start, end, jobId }],
    queryFn: async () => {
      const res = await client.api.jobs[":id"].bookings.conflicts.$get({
        param: { id: jobId },
        query: { start: start.toISOString(), end: end.toISOString() },
      });
      const data = await res.json();
      return data;
    },
  });
}

export function useAddBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      jobId,
      data,
    }: {
      jobId: string;
      data: BookingCreateInput;
    }) => {
      const res = await client.api.jobs[":id"].bookings.$post({
        json: data,
        param: { id: jobId },
      });
      return res.json();
    },
    onSuccess: (_, { jobId }) => {
      queryClient.invalidateQueries({ queryKey: ["bookings"] });
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId, "bookings"] });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
    },
  });
}
