import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { X } from "lucide-react";

export default function TalentTable({
  talents,
  onRemove,
}: {
  talents: string[];
  onRemove?: (args: { index: number; value: string }) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Talent</TableHead>
          {onRemove && (
            <TableHead>
              <span className="sr-only">Remove</span>
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {talents.length > 0 ? (
          talents.map((talent, index) => (
            <TableRow key={index}>
              <TableCell>{talent}</TableCell>
              {onRemove && (
                <TableCell align="right">
                  <Button
                    onClick={() => onRemove({ index, value: talent })}
                    className="h-7 w-7"
                    variant={"ghost"}
                    size={"icon"}
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={2}
              className="text-center text-muted-foreground py-4"
            >
              No talents added
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
