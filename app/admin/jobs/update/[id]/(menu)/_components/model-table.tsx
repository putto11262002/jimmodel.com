import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import UserAvatar from "@/components/user/user-avatar";
import { useDeleteModel } from "@/hooks/queries/job";
import { Job } from "@/lib/types/job";
import { CircleX } from "lucide-react";

export default function ModelTable({ job }: { job: Job }) {
  const { mutate: deleteModel } = useDeleteModel();
  return (
    <Table className="p-0">
      <TableHeader hidden>
        <TableRow>
          <TableHead></TableHead>
          <TableHead></TableHead>
          <TableHead></TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {job.models.length > 0 ? (
          job.models.map((model) => (
            <TableRow className="hover:bg-background" key={model.id}>
              <TableCell>
                <div className="relative w-[32px] h-[32px] rounded overflow-hidden">
                  <UserAvatar
                    size={"small"}
                    user={{
                      name: model.name,
                      image: model.image ? { id: model.image.fileId } : null,
                    }}
                  />
                </div>
              </TableCell>
              <TableCell className="pl-0">{model.name}</TableCell>
              <TableCell className="pr-0" align="right">
                <Button
                  onClick={() =>
                    deleteModel({ modelId: model.id, jobId: job.id })
                  }
                  className="h-6 w-6 rounded-full"
                  size={"icon"}
                  variant={"ghost"}
                >
                  <CircleX className="w-4 h-4" />
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
  );
}
