import useToast from "@/components/toast";
import client from "@/lib/api/client";
import { Application, ApplicationImage } from "@/lib/types/application";
import { PaginatedData } from "@/lib/types/paginated-data";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
export function useRejectApplication() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ applicationId }: { applicationId: string }) => {
      await client.api.applications[":id"].reject.$post({
        param: { id: applicationId },
      });
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["applications", args[1].applicationId],
      });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      ok("Application rejected");
    },
  });
}
export function useApproveApplication() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ applicationId }: { applicationId: string }) => {
      await client.api.applications[":id"].approve.$post({
        param: { id: applicationId },
      });
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["applications", args[1].applicationId],
      });
      queryClient.invalidateQueries({ queryKey: ["applications"] });
      queryClient.invalidateQueries({ queryKey: ["models"] });
      ok("Application approved");
    },
  });
}

export function useGetApplication({
  id,
  ...opts
}: { id: string } & Omit<
  UseQueryOptions<Application>,
  "queryKey" | "queryFn"
>) {
  return useQuery({
    ...opts,
    queryKey: ["applications", id],
    queryFn: async () => {
      const res = await client.api.applications[":id"].$get({
        param: { id: id },
      });
      return res.json();
    },
    enabled: Boolean(id),
    throwOnError: true,
  });
}

export function useGetApplicationImages({
  id,
  ...opts
}: { id: string } & Omit<
  UseQueryOptions<ApplicationImage[], Error, ApplicationImage[]>,
  "queryFn" | "queryKey"
>) {
  return useQuery({
    ...opts,
    queryKey: ["applications", id, "images"],
    queryFn: async () => {
      const res = await client.api.applications[":id"].images.$get({
        param: { id: id },
      });
      return res.json();
    },
  });
}

export function useGetApplications({
  page,
  status,
  ...opts
}: {
  page: number;
  status: string;
} & Omit<
  UseQueryOptions<
    PaginatedData<Application>,
    Error,
    PaginatedData<Application>
  >,
  "queryKey" | "queryFn"
>) {
  return useQuery({
    ...opts,
    queryKey: ["applications", { page, status }],
    queryFn: async () => {
      const res = await client.api.applications.$get({
        query: { page: page.toString(), status },
      });
      return res.json();
    },
  });
}
