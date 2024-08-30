import useToast from "@/components/toast";
import client from "@/lib/api/client";
import { PaginatedData } from "@/lib/types/paginated-data";
import {
  Showcase,
  ShowcaseCreateInput,
  ShowcaseImageCreateInput,
  ShowcaseUpdateInput,
} from "@/lib/types/showcase";
import { blobToFile } from "@/lib/utils/file";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

export function useAddLink() {
  const { ok } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, url }: { id: string; url: string }) => {
      await client.api.showcases[":id"]["video-links"].append.$post({
        param: { id },
        json: { url },
      });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["showcases", id] });
      ok("Link added successfully");
    },
  });
}
export function useRemoveLink() {
  const { ok } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, url }: { id: string; url: string }) => {
      await client.api.showcases[":id"]["video-links"].remove.$post({
        param: { id },
        json: { url },
      });
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ["showcases", id] });
      ok("Link removed successfully");
    },
  });
}

export function useUpdateShowcase() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: ShowcaseUpdateInput;
    }) => {
      await client.api.showcases[":id"].$put({ param: { id }, json: input });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcases"] });
      ok("Showcase updated successfully");
    },
  });
}

export function useUnpublishShowcase() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await client.api.showcases[":id"].unpublish.$post({ param: { id } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcases"] });
      ok("Successfully unpublished");
    },
  });
}
export function usePublishShowcase() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await client.api.showcases[":id"].publish.$post({ param: { id } });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcases"] });
      ok("Successfully published");
    },
  });
}

export function useCreateShowcase() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ input }: { input: ShowcaseCreateInput }) => {
      const res = await client.api.showcases.$post({ json: input });
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcases"] });
      ok("Showcase created successfully");
    },
  });
}
export function useAddImage() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: Extract<ShowcaseImageCreateInput, { file: Blob }>;
    }) => {
      await client.api.showcases[":id"].images.$post({
        param: { id },
        form: { file: await blobToFile(input.file) },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcases"] });
      ok("Image added successfully");
    },
  });
}
export function useUpdateCoverImage() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({
      id,
      input,
    }: {
      id: string;
      input: Extract<ShowcaseImageCreateInput, { file: Blob }>;
    }) => {
      await client.api.showcases[":id"]["cover-image"].$put({
        param: { id },
        form: { file: await blobToFile(input.file) },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcases"] });
      ok("Cover image updated successfully");
    },
  });
}

export function useAddModel() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ id, modelId }: { id: string; modelId: string }) => {
      await client.api.showcases[":id"].models.$post({
        param: { id },
        json: { modelId },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["showcases"] });
      ok("Model added successfully");
    },
  });
}

export function useGetShowcase({
  id,
  ...opts
}: { id: string } & Omit<
  UseQueryOptions<Showcase, Error, Showcase>,
  "queryKey" | "queryFn"
>) {
  return useQuery({
    ...opts,
    queryKey: ["showcases", id],
    queryFn: async () => {
      const res = await client.api.showcases[":id"].$get({ param: { id } });
      return res.json();
    },
  });
}

export function useGetShowcases({
  page,
  pageSize,
  published,
  ...opts
}: { page?: number; pageSize?: number; published?: boolean } & Omit<
  UseQueryOptions<PaginatedData<Showcase>, Error, PaginatedData<Showcase>>,
  "queryKey" | "queryFn"
>) {
  return useQuery({
    ...opts,
    queryKey: ["showcases", { page, pageSize }],
    queryFn: async () => {
      const res = await client.api.showcases.$get({
        query: {
          page: page?.toString(),
          pageSize: pageSize?.toString(),
          published:
            typeof published === "boolean"
              ? published
                ? "true"
                : "false"
              : undefined,
        },
      });
      const data = await res.json();
      return data;
    },
  });
}
