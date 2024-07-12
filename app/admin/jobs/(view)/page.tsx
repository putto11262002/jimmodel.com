import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { PageContent } from "./_page";
import { Suspense } from "react";

export default async function Page({
  searchParams,
}: {
  searchParams: { page?: string[] | string; roles: string[] | string };
}) {
  return (
    <>
      <Card x-chunk="dashboard-06-chunk-0">
        <CardHeader>
          <CardTitle>Jobs</CardTitle>
        </CardHeader>
        <Suspense>
          <PageContent />
        </Suspense>
      </Card>
    </>
  );
}
