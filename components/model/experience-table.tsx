import { ModelExperience } from "@/lib/types/model";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "../ui/table";
import { Button } from "../ui/button";
import { X } from "lucide-react";

export default function ExperienceTable({
  experiences,
  onRemove,
}: {
  experiences: Omit<ModelExperience, "modelId">[];
  onRemove?: (args: { index: number; id: string }) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Year</TableHead>
          <TableHead>Product</TableHead>
          <TableHead>Media</TableHead>
          <TableHead>Country</TableHead>
          <TableHead>Details</TableHead>
          {onRemove && (
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          )}
        </TableRow>
      </TableHeader>
      <TableBody>
        {experiences.length > 0 ? (
          experiences.map((experience, index) => (
            <TableRow key={index}>
              <TableCell className="whitespace-nowrap">
                {experience.year}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {experience.product}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {experience.media}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {experience.country}
              </TableCell>
              <TableCell className="whitespace-nowrap">
                {experience.details}
              </TableCell>
              {onRemove && (
                <TableCell>
                  <Button
                    onClick={() => onRemove({ index, id: experience.id })}
                    className=""
                    variant={"ghost"}
                    size={"icon"}
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </TableCell>
              )}
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={10}
              className="py-4 text-muted-foreground text-center"
            >
              No experiences
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
