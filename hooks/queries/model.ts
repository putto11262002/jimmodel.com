import useToast from "@/components/toast";
import { ModelCreateInput, ModelUpdateInput } from "@/db/schemas/models";
import client from "@/lib/api/client";
import {
  ModelBlock,
  ModelBlockCreateInput,
  ModelBlockWithPartialModel,
  ModelExperienceCreateInput,
} from "@/lib/types/model";
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

export function useGetModel({ modelId }: { modelId: string }) {
  return useQuery({
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

export function useBlockModel({
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
    },
    onError: (...args) => {
      error(args[0].message);
    },
  });
}

export function useGetModelBlocks({ modelId }: { modelId: string }) {
  return useQuery({
    queryKey: ["models", modelId, "blocks"],
    queryFn: async () => {
      const res = await client.api.models[":id"].blocks.$get({
        param: { id: modelId },
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

export function useGetModelExperiences({ modelId }: { modelId: string }) {
  return useQuery({
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
}: {
  page?: number;
  q?: string | undefined;
}) {
  return useQuery({
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
  ...props
}: {
  start?: Date;
  end?: Date;
  modelIds: string[];
} & Omit<
  UseQueryOptions<
    ModelBlockWithPartialModel[],
    Error,
    ModelBlockWithPartialModel[],
    (
      | string
      | {
          start: any;
          end: any;
        }
    )[]
  >,
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
          include: ["model"],
        },
      });
      const data = (await res.json()) as ModelBlockWithPartialModel[];
      return data;
    },
  });
}
