import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { placeholderImage } from "@/config/image";
import routes from "@/config/routes";
import { Showcase } from "@/lib/types/showcase";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ShowcaseTable({
  showcases,
}: {
  showcases: Showcase[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <span className="sr-only">Cover Image</span>
          </TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {showcases.length > 0 ? (
          showcases.map((showcase, index) => (
            <TableRow key={index}>
              <TableCell>
                <Image
                  width={65}
                  height={65}
                  className="w-[65] h-[65px] object-cover rounded"
                  alt={showcase.title}
                  src={
                    showcase.coverImageId
                      ? routes.getFiles(showcase.coverImageId)
                      : placeholderImage
                  }
                />
              </TableCell>
              <TableCell>{showcase.title}</TableCell>
              <TableCell>
                <Badge variant={"outline"}>
                  {showcase.published ? "Published" : "Draft"}
                </Badge>
              </TableCell>
              <TableCell>
                <Link href={`/admin/showcases/${showcase.id}/update`}>
                  <Button className="" size={"icon"} variant={"ghost"}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </Link>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell className="text-center text-sm text-muted-foreground py-4">
              No showcases found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
