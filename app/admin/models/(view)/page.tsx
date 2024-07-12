import {
  dehydrate,
  HydrationBoundary,
  QueryClient,
} from "@tanstack/react-query";
import client from "@/lib/api/client";
import PageContent from "./_page";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string[] | string; roles: string[] | string };
}) {
  // Use zod to validate and clean search params
  const page = searchParams?.page
    ? parseInt(
        Array.isArray(searchParams.page)
          ? searchParams.page?.[0]
          : searchParams.page,
        10,
      ) || 1
    : 1;

  const queryClient = new QueryClient();

  await queryClient.prefetchQuery({
    queryKey: ["models", { page }],
    queryFn: async () => {
      const res = await client.api.models.profile.$get({
        query: { page: page.toString(), pageSize: (5).toString() },
      });
      const data = await res.json();
      return data;
    },
  });

  return (
    <>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <PageContent />
      </HydrationBoundary>
    </>
  );
}
