import client from "@/lib/api/client";
import { useSuspenseQuery } from "@tanstack/react-query";

export default function useGetModel({ modelId }: { modelId: string }) {
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
