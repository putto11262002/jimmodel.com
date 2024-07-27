import useToast from "@/components/toast";
import { JobUpdateInput } from "@/db/schemas";
import client from "@/lib/api/client";
import { BookingWithJob, JobCreateInput, JobStatus } from "@/lib/types/job";
import {
  QueryClient,
  UndefinedInitialDataOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

export const useDeleteBooking = ({
  opts,
  _client,
}: {
  opts?: UseMutationOptions<void, Error, { id: string; jobId: string }>;
  _client?: QueryClient;
} = {}) => {
  const queryClient = _client || useQueryClient();
  const { ok, error } = useToast();
  return useMutation({
    ...opts,
    mutationFn: async ({ id }: { id: string; jobId: string }) => {
      await client.api.bookings[":id"].$delete({ param: { id } });
    },

    onSuccess: (_, { jobId }) => {
      ok("Booking deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["jobs", jobId, "bookings"] });
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

export const useGetJob = ({
  jobId,
  _client,
}: {
  opts?: UndefinedInitialDataOptions;
  jobId: string;
  _client?: QueryClient;
}) => {
  const queryClient = _client || useQueryClient();
  return useQuery(
    {
      queryKey: ["jobs", jobId],
      queryFn: async () => {
        const res = await client.api.jobs[":id"].$get({
          param: { id: jobId },
        });
        return res.json();
      },
      throwOnError: true,
    },
    queryClient,
  );
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

export const useAddModel = ({
  opts,
  _client,
}: {
  _client?: QueryClient;
  opts?: UseMutationOptions<void, Error, { jobId: string; modelId: string }>;
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
      onError: () => {
        error("Failed to add model to job");
      },
    },
    queryClient,
  );
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
  status,
}: { page?: string; pageSize?: string; status?: JobStatus } = {}) {
  return useQuery({
    queryKey: ["jobs", { page }],
    queryFn: async () => {
      const res = await client.api.jobs.$get({
        query: {
          page: page?.toString(),
          pageSize: pageSize?.toString(),
          status,
        },
      });
      const data = await res.json();
      return data;
    },
  });
}

export function useGetBookings({
  start,
  end,
  modelIds,
  ...props
}: {
  start?: Date;
  end?: Date;
  modelIds?: string[];
} & Omit<
  UseQueryOptions<BookingWithJob[], Error, BookingWithJob[]>,
  "queryKey" | "queryFn"
>) {
  return useQuery({
    queryKey: ["bookings", { start, end }],
    queryFn: async () => {
      const res = await client.api.bookings.$get({
        query: {
          start: start?.toISOString(),
          end: end?.toISOString(),
          modelIds,
        },
      });
      let { data: bookings } = await res.json();
      return bookings;
    },

    ...props,
  });
}
