import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ModelBlock, ModelBlockWithPartialModel } from "@/lib/types/model";
import { formatISODateString } from "@/lib/utils/date";
import { CircleCheck } from "lucide-react";

export default function BlockTable({
  blocks,
}: {
  blocks: ModelBlockWithPartialModel[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Start</TableHead>
          <TableHead>End</TableHead>
          <TableHead>Model</TableHead>
          <TableHead>Reason</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {blocks.length > 0 ? (
          blocks.map((block, index) => (
            <TableRow key={index}>
              <TableCell>{formatISODateString(block.start)}</TableCell>
              <TableCell>{formatISODateString(block.end)}</TableCell>
              <TableCell>{block.model.name}</TableCell>
              <TableCell>{block.reason}</TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="py-4">
              <p className="flex items-center justify-center text-center  gap-2">
                <CircleCheck className="h-4 w-4 text-green-800" />{" "}
                <span>No Conflicting Blocks</span>
              </p>
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
