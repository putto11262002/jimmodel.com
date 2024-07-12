import useToast from "@/components/toast";
import { ModelUpdateInput } from "@/db/schemas/models";
import client from "@/lib/api/client";
import { ModelBlockCreateInput } from "@/lib/types/model";
import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
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
