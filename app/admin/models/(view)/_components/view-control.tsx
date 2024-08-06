"use client";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  removeAllParams,
  removeParam,
  setParam,
} from "@/lib/utils/search-param";
import { zodResolver } from "@hookform/resolvers/zod";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";

const searchForm = z.object({
  q: z.string().optional(),
});

export default function ViewControl() {
  const form = useForm({ resolver: zodResolver(searchForm) });
  const searchParam = useSearchParams();
  const router = useRouter();
  return (
    <div className="flex items-center">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            const params = new URLSearchParams(searchParam.toString());
            data.q
              ? setParam("q", [data.q], params)
              : removeAllParams("q", params);
            router.push(`/admin/models?${params.toString()}`);
          })}
        >
          <div className="flex items-center gap-2">
            <Input
              defaultValue={searchParam.get("q") || ""}
              type="search"
              {...form.register("q")}
              className="h-7  px-2 text-sm"
            />
            <Button size={"sm"} className="h-7 ">
              <Search className="h-3.5 w-3.5 mr-1" />
              <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
                Search
              </span>
            </Button>
          </div>
        </form>
      </Form>
      <div className="ml-auto flex items-center gap-2">
        <Link href="/admin/models/add">
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add model
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
