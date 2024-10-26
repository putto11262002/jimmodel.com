"use client";
import { removeShowcaseLinkAction } from "@/actions/showcase";
import DataTable from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Showcase } from "@/lib/domains";
import { truncate, upperFirst } from "lodash";
import { X } from "lucide-react";
import Link from "next/link";
import { useActionState } from "react";

export default function ShowcaseLinkList({ showcase }: { showcase: Showcase }) {
  const [state, action, pending] = useActionState(removeShowcaseLinkAction, {
    status: "idle",
  });
  return (
    <DataTable
      columns={[
        { key: "url", header: "URL" },
        { key: "platform", header: "Platform" },
        { key: "actions", header: "Actions", hideHeader: true },
      ]}
      data={showcase.links.map((link) => ({
        url: (
          <Link href={link.url} className="text-sm underline">
            {truncate(link.url)}
          </Link>
        ),
        platform: <Badge>{upperFirst(link.platform)}</Badge>,
        actions: (
          <form action={action}>
            <input type="hidden" name="id" value={showcase.id} />
            <input type="hidden" name="linkId" value={link.id} />
            <Button size="icon" variant="ghost">
              <X className="icon-sm" />
            </Button>
          </form>
        ),
      }))}
    />
  );
}
