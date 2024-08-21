"use client";
import Avatar from "@/components/avatar";
import Loader from "@/components/loader";
import SearchModelDialog from "@/components/model/search-model-dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserAvatar from "@/components/user/user-avatar";
import permissions from "@/config/permission";
import {
  useAddModel,
  useDeleteModel,
  useGetJobModels,
} from "@/hooks/queries/job";
import useSession from "@/hooks/use-session";
import { Plus, X } from "lucide-react";

export default function Page({ params: { id } }: { params: { id: string } }) {
  const session = useSession(permissions.jobs.getJobModels);
  const { data: models, isSuccess } = useGetJobModels({
    jobId: id,
    enabled: session.status === "authenticated",
  });

  const { mutate: deleteModel } = useDeleteModel();
  const { mutate: addModel } = useAddModel();
  if (!isSuccess) {
    return <Loader />;
  }
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center">
          <CardTitle>Models</CardTitle>
          <SearchModelDialog
            onSelect={(modelId) => addModel({ jobId: id, modelId: modelId })}
            selected={models || []}
          >
            <Button
              variant={"outline"}
              size={"icon"}
              className="h-7 w-7 ml-auto"
            >
              <Plus className="h-3.5 w-3.5" />
            </Button>
          </SearchModelDialog>
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead></TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {models.length > 0 ? (
              models.map((model) => (
                <TableRow className="hover:bg-background" key={model.id}>
                  <TableCell className="flex items-center gap-2">
                    <Avatar
                      name={model.name}
                      fileId={model.profileImage?.id}
                      size={"small"}
                    />
                    <span className="ml-2 font-medium">{model.name}</span>
                  </TableCell>
                  <TableCell className="pr-0" align="right">
                    <Button
                      onClick={() =>
                        deleteModel({ modelId: model.id, jobId: id })
                      }
                      className="h-7 w-7"
                      size={"icon"}
                      variant={"ghost"}
                    >
                      <X className="w-3.5 h-3.5" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  className="py-4 text-center text-muted-foreground"
                  colSpan={3}
                >
                  No models
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
