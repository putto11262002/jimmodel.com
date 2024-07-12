import useToast from "@/components/toast";
import { ModelUpdateInput } from "@/db/schemas";
import client from "@/lib/api/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function useUpdateModel() {
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
