import useToast from "@/components/toast";
import { ModelCreateInput, ModelUpdateInput } from "@/lib/types/model";
import client from "@/lib/api/client";
import {
  Model,
  ModelBlock,
  ModelBlockCreateInput,
  ModelBlockWithModelProfile,
  ModelExperience,
  ModelExperienceCreateInput,
  ModelImage,
  ModelProfile,
} from "@/lib/types/model";
import { PaginatedData } from "@/lib/types/paginated-data";
import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
  useSuspenseQuery,
} from "@tanstack/react-query";

export function useSuspenseGetModel({ modelId }: { modelId: string }) {
  return useSuspenseQuery({
    queryKey: ["models", modelId],
    queryFn: async () => {
      const res = await client.api.models[":modelId"].$get({
        param: { modelId },
      });
      const data = await res.json();
      return data;
    },
  });
}

export function useGetModel({
  modelId,
  ...opts
}: { modelId: string } & Omit<
  UseQueryOptions<Model, Error, Model>,
  "queryFn" | "queryKey"
>) {
  return useQuery({
    ...opts,
    queryKey: ["models", modelId],
    queryFn: async () => {
      const res = await client.api.models[":modelId"].$get({
        param: { modelId },
      });
      const data = await res.json();
      return data;
    },
  });
}

export async function usePrefetchModel({
  modelId,
  opts,
}: {
  modelId: string;
  opts?: Parameters<QueryClient["prefetchQuery"]>;
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    ...opts,
    queryKey: ["models", modelId],
    queryFn: async () => {
      const res = await client.api.models[":modelId"].$get({
        param: { modelId },
      });
      const data = await res.json();
      return data;
    },
  });
  return queryClient;
}

export function useUpdateModel() {
  const { ok, error } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      modelId,
      input,
    }: {
      modelId: string;
      input: ModelUpdateInput;
    }) => {
      await client.api.models[":modelId"].$put({
        param: { modelId },
        json: input,
      });
    },
    onSuccess: (_, { modelId }) => {
      queryClient.invalidateQueries({ queryKey: ["models", modelId] });
      ok("Successfully updated model");
    },
    onError: () => {
      error("Failed to update model");
    },
  });
}

export function useCreateModelBlock({
  opts,
}: {
  opts?: UseMutationOptions<
    void,
    Error,
    { modelId: string; input: Omit<ModelBlockCreateInput, "modelId"> }
  >;
} = {}) {
  const { ok, error } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    ...opts,
    mutationFn: async ({
      modelId,
      input,
    }: {
      modelId: string;
      input: Omit<ModelBlockCreateInput, "modelId">;
    }) => {
      await client.api.models[":id"].blocks.$post({
        json: input,
        param: { id: modelId },
      });
    },
    onSuccess: (...args) => {
      ok("Model block Successfully add");
      queryClient.invalidateQueries({
        queryKey: ["models", args[1].modelId, "blocks"],
      });
      queryClient.invalidateQueries({
        queryKey: ["calendar"],
      });
    },
    onError: (...args) => {
      error(args[0].message);
    },
  });
}

export function useGetModelBlocks({
  modelId,
  page,
  pageSize,
  ...opts
}: { modelId: string; page?: number; pageSize?: number } & Omit<
  UseQueryOptions<PaginatedData<ModelBlock>, Error, PaginatedData<ModelBlock>>,
  "queryFn" | "queryKey"
>) {
  return useQuery({
    ...opts,
    queryKey: ["models", modelId, "blocks"],
    queryFn: async () => {
      const res = await client.api.models[":id"].blocks.$get({
        param: { id: modelId },
        query: { page: page?.toString(), pageSize: pageSize?.toString() },
      });
      const data = await res.json();
      return data;
    },
    throwOnError: true,
  });
}

export function useDeleteBlock({
  opts,
}: {
  opts?: UseMutationOptions<ModelBlock, Error, { blockId: string }>;
} = {}) {
  const { ok, error } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ blockId }: { blockId: string }) => {
      const res = await client.api.blocks[":id"].$delete({
        param: { id: blockId },
      });
      const block = await res.json();
      return block;
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["models", args[0].modelId, "blocks"],
      });
      queryClient.invalidateQueries({ queryKey: ["calendar"] });
      ok("Successfully deleted block");
      opts?.onSuccess?.(...args);
    },
    onError: (...args) => {
      error(args[0].message);
      opts?.onError?.(...args);
    },
  });
}

export function useGetModelExperiences({
  modelId,
  ...opts
}: { modelId: string } & Omit<
  UseQueryOptions<ModelExperience[], Error, ModelExperience[]>,
  "queryFn" | "queryKey"
>) {
  return useQuery({
    ...opts,
    queryKey: ["models", modelId, "experiences"],
    queryFn: async () => {
      const res = await client.api.models[":id"].experiences.$get({
        param: { id: modelId },
      });
      return res.json();
    },
  });
}

export function useAddModelExperience() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({
      modelId,
      input,
    }: {
      modelId: string;
      input: ModelExperienceCreateInput;
    }) => {
      await client.api.models[":id"].experiences.$post({
        param: { id: modelId },
        json: input,
      });
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["models", args[1].modelId, "experiences"],
      });
      ok("Experience added successfully");
    },
  });
}

export function useRemoveModelExperience() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({
      modelId,
      experienceId,
    }: {
      modelId: string;
      experienceId: string;
    }) => {
      await client.api.models[":id"].experiences[":experienceId"].$delete({
        param: { id: modelId, experienceId },
      });
    },
    onSuccess: (...args) => {
      queryClient.invalidateQueries({
        queryKey: ["models", args[1].modelId, "experiences"],
      });
      ok("Experience removed successfully");
    },
  });
}

export function useRemoveModelImage() {
  const { ok } = useToast();
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({
      modelId,
      fileId,
    }: {
      fileId: string;
      modelId: string;
    }) => {
      await client.api.models[":modelId"].images[":fileId"].$delete({
        param: { modelId: modelId, fileId: fileId },
      });
    },
    onSuccess: (_, { modelId }) => {
      queryClient.invalidateQueries({
        queryKey: ["models", modelId, "images"],
      });
      ok("Image deleted successfully");
    },
  });
}

export function useCreateModel() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (input: ModelCreateInput) => {
      const res = await client.api.models.$post({
        json: input,
      });
      return res.json();
    },
    onSuccess: ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["models"] });
    },
  });
}

export function useGetModels({
  page,
  q,
  ...opts
}: {
  page?: number;
  q?: string | undefined;
} & Omit<
  UseQueryOptions<
    PaginatedData<ModelProfile>,
    Error,
    PaginatedData<ModelProfile>
  >,
  "queryKey" | "queryFn"
>) {
  return useQuery({
    ...opts,
    queryKey: ["models", { page, q }],
    queryFn: async () => {
      const res = await client.api.models.$get({
        query: { page: page?.toString(), q },
      });
      const data = await res.json();
      return data;
    },
  });
}

export function useGetBlock({
  start,
  end,
  modelIds,
  page,
  pageSize,
  pagination,
  ...props
}: {
  start?: Date;
  end?: Date;
  modelIds?: string[];
  page?: number;
  pageSize?: number;
  pagination?: boolean;
} & Omit<
  UseQueryOptions<PaginatedData<ModelBlock>, Error, PaginatedData<ModelBlock>>,
  "queryKey" | "queryFn"
>) {
  return useQuery({
    ...props,
    queryKey: ["blocks", { start, end }],
    queryFn: async () => {
      const res = await client.api.blocks.$get({
        query: {
          start: start?.toISOString(),
          end: end?.toISOString(),
          modelIds,
          page: page?.toString(),
          pageSize: pageSize?.toString(),
          pagination: pagination ? "true" : "false",
        },
      });
      const data = res.json();
      return data;
    },
  });
}

export function useGetBlockWithModeProfile({
  start,
  end,
  modelIds,
  page,
  pageSize,
  pagination,
  ...props
}: {
  start?: Date;
  end?: Date;
  page?: number;
  pageSize?: number;
  pagination?: boolean;
  modelIds?: string[];
} & Omit<
  UseQueryOptions<
    PaginatedData<ModelBlockWithModelProfile>,
    Error,
    PaginatedData<ModelBlockWithModelProfile>
  >,
  "queryKey" | "queryFn"
>) {
  return useQuery({
    ...props,
    queryKey: ["blocks", { start, end }],
    queryFn: async () => {
      const res = await client.api["blocks-with-model-profile"].$get({
        query: {
          start: start?.toISOString(),
          end: end?.toISOString(),
          modelIds,
          page: page?.toString(),
          pageSize: pageSize?.toString(),
          pagination: pagination ? "true" : "false",
        },
      });
      const data = res.json();
      return data;
    },
  });
}

export function useGetModelImages({
  modelId,
  ...opts
}: { modelId: string } & Omit<
  UseQueryOptions<ModelImage[], Error, ModelImage[]>,
  "queryFn" | "queryKey"
>) {
  return useQuery({
    ...opts,
    queryKey: ["models", modelId, "images"],
    queryFn: async () => {
      const res = await client.api.models[":modelId"].images.$get({
        param: { modelId },
      });
      const images = await res.json();
      return images;
    },
  });
}
