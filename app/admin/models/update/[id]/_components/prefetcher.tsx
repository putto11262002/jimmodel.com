import client from "@/lib/api/client";
import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";

export default async function Prefetcher({
  modelId,
  children,
}: {
  children: React.ReactNode;
  modelId: string;
}) {
  const queryClient = new QueryClient();
  await queryClient.prefetchQuery({
    queryKey: ["models", modelId],
    queryFn: async () => {
      const res = await client.api.models[":modelId"].$get({
        param: { modelId },
      });
      return res.json();
    },
  });
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      {children}
    </HydrationBoundary>
  );
}
