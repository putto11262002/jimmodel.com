import useToast from "@/components/toast";
import client from "@/lib/api/client";
import { PaginatedData } from "@/lib/types/paginated-data";
import {
  WebAsset,
  WebAssetCreateInput,
  WebAssetUpdateInput,
} from "@/lib/types/web-asset";
import { blobToFile } from "@/lib/utils/file";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

export function useDeleteWebAsset() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await client.api["web-assets"][":id"].$delete({ param: { id } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["web-assets"] });
      ok("Web asset has been deleted");
    },
  });
}

export function useCreateWebAsset() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ input }: { input: WebAssetCreateInput }) => {
      const res = await client.api["web-assets"].$post({
        form: { ...input, file: await blobToFile(input.file) },
      });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["web-assets"] });
      ok("Web asset has been created");
    },
  });
}
export function useGetWebAssets({
  page,
  pageSize,
  ...opts
}: { page?: number; pageSize?: number } & Omit<
  UseQueryOptions<PaginatedData<WebAsset>, Error, PaginatedData<WebAsset>>,
  "queryKey" | "queryFn"
>) {
  return useQuery({
    ...opts,
    queryKey: ["web-assets", { page }],
    queryFn: async () => {
      const res = await client.api["web-assets"].$get({
        query: { page: page?.toString(), pageSize: pageSize?.toString() },
      });
      return res.json();
    },
  });
}
export function useGetWebAsset({
  id,
  ...opts
}: { id: string } & Omit<
  UseQueryOptions<WebAsset, Error, WebAsset>,
  "queryFn" | "queryKey"
>) {
  return useQuery({
    ...opts,
    queryKey: ["web-assets", id],
    queryFn: async () => {
      const res = await client.api["web-assets"][":id"].$get({ param: { id } });
      return res.json();
    },
  });
}

export function useUpdateWebAssetMetadata() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: WebAssetUpdateInput;
    }) => {
      await client.api["web-assets"][":id"].$put({
        param: { id },
        json: input,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["web-assets"] });
      ok("Web asset has been updated");
    },
  });
}

export function useUnPublishWebAsset() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await client.api["web-assets"][":id"].unpublish.$post({ param: { id } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["web-assets"] });
      ok("Web asset has been unpublished");
    },
  });
}
export function usePublishWebAsset() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await client.api["web-assets"][":id"].publish.$post({ param: { id } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["web-assets"] });
      ok("Web asset has been published");
    },
  });
}
