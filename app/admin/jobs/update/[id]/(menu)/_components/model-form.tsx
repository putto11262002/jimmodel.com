"use client";
import { Circle, CircleCheck, CircleX, Loader, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  CommandInput,
  CommandItem,
  CommandList,
  CommandGroup,
  Command,
} from "@/components/ui/command";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/api/client";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ModelProfile } from "@/db/schemas";
import { PaginatedData } from "@/lib/types/paginated-data";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import Image from "next/image";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddModel, useDeleteModel, useGetJob } from "@/hooks/queries/job";
import UserAvatar from "@/components/user/user-avatar";

export default function ModelForm({ jobId }: { jobId: string }) {
  const { data } = useGetJob({ jobId });

  const { mutate: addModel } = useAddModel();

  const { mutate: deleteModel } = useDeleteModel();

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle>Models</CardTitle>
          <SearchModelDialog
            onSelect={(id) => addModel({ jobId, modelId: id })}
            selected={data?.models || []}
          >
            <Button
              variant={"outline"}
              size={"icon"}
              className="h-6 w-6 ml-auto"
            >
              <Plus className="h-4 w-4" />
            </Button>
          </SearchModelDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table className="p-0">
          <TableHeader hidden>
            <TableRow>
              <TableHead></TableHead>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data?.models?.map((model) => (
              <TableRow className="hover:bg-background" key={model.id}>
                <TableCell>
                  <div className="relative w-[32px] h-[32px] rounded overflow-hidden">
                    <UserAvatar
                      size={"small"}
                      user={{
                        name: model.name,
                        image: model.profileImage
                          ? { id: model.profileImage.fileId }
                          : null,
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell className="pl-0">{model.name}</TableCell>
                <TableCell className="pr-0" align="right">
                  <Button
                    onClick={() =>
                      deleteModel({ modelId: model.id, jobId: jobId })
                    }
                    className="h-6 w-6 rounded-full"
                    size={"icon"}
                    variant={"ghost"}
                  >
                    <CircleX className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

function SearchModelDialog({
  children,
  onSelect,
  selected,
}: {
  children: React.ReactNode;
  onSelect: (model: string) => void;
  selected: { id: string }[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: ["models", "profile", searchTerm],
    queryFn: async ({ signal }) => {
      await new Promise((resolve, reject) => {
        let timer = setTimeout(resolve, 1000);
        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject();
        });
      });

      const res = await client.api.models.profile.$get(
        {
          query: { q: searchTerm, pageSize: "5" },
        },
        {
          init: { signal },
        },
      );
      const data = await res.json();
      return data;
    },
    enabled: searchTerm.length > 0,
  });

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="p-0">
          <div>
            <input
              className="py-3 px-4 rounded-lg outline-none focus:outline-none w-full bg-muted"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="py-2 px-2">
              {isFetching ? (
                <div className="flex justify-center py-4">
                  <Loader className="w-4 h-4 animate-spin" />
                </div>
              ) : data && data.data.length > 0 ? (
                data?.data?.map((model, index) => {
                  const isSelected =
                    selected.findIndex((m) => model.id === m.id) !== -1;
                  return (
                    <div
                      onClick={() => onSelect(model.id)}
                      key={index}
                      className="py-2 px-4 flex items-center gap-2 hover:bg-muted rounded"
                    >
                      <Image
                        src={
                          model.profileImage
                            ? `/files/${model.profileImage?.fileId}`
                            : "/placeholder.svg"
                        }
                        alt="Model profile"
                        className="object-cover w-[32px] h-[32px] rounded"
                        height={32}
                        width={32}
                      />
                      <span className="text-sm">{model.name}</span>

                      <Checkbox className="ml-auto" checked={isSelected} />
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-muted-foreground py-4 text-sm">
                  No results
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
