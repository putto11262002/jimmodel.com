import useToast from "@/components/toast";
import client from "@/lib/api/client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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
      ok("Application approved");
    },
  });
}

export function useGetApplication({ id }: { id: string }) {
  return useQuery({
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

export function useGetApplicationImages({ id }: { id: string }) {
  return useQuery({
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
}: {
  page: number;
  status: string;
}) {
  return useQuery({
    queryKey: ["applications", { page, status }],
    queryFn: async () => {
      const res = await client.api.applications.$get({
        query: { page: page.toString(), status },
      });
      return res.json();
    },
  });
}
