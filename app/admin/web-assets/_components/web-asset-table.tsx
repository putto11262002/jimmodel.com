"use client";

import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import routes from "@/config/routes";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatISODateString } from "@/lib/utils/date";
import { upperFirst } from "lodash";
import { placeholderImage } from "@/config/image";
import { WebAsset } from "@/lib/types/web-asset";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

export default function WebAssetTable({
  webAssets,
  onDelete,
  onUpdate,
  onPublish,
  onUnpublish,
}: {
  webAssets: WebAsset[];
  onDelete?: (id: string) => void;
  onUpdate?: (id: string) => void;
  onPublish?: (id: string) => void;
  onUnpublish?: (id: string) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <span className="sr-only">Image</span>
          </TableHead>
          <TableHead>Tag</TableHead>

          <TableHead>Content Type</TableHead>
          <TableHead>Created At</TableHead>
          <TableHead>
            <span>Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>

      <TableBody>
        {webAssets.length > 0 ? (
          webAssets.map((webAsset, index) => (
            <TableRow key={index}>
              <TableCell>
                <div className="w-[60px]">
                  <AspectRatio className=" col-span-1 relative rounded-md overflow-hidden">
                    <Image
                      src={
                        webAsset.type === "image"
                          ? routes.getFiles(webAsset.fileId)
                          : placeholderImage
                      }
                      alt={webAsset.alt || webAsset.tag}
                      fill
                      className="object-cover"
                    />
                  </AspectRatio>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={"outline"}>{upperFirst(webAsset.tag)}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={"outline"}>{webAsset.contentType}</Badge>
              </TableCell>
              <TableCell>{formatISODateString(webAsset.createdAt)}</TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant={"ghost"} size={"icon"}>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      disabled={!onUpdate}
                      onClick={() => onUpdate && onUpdate(webAsset.id)}
                    >
                      Update
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!onDelete}
                      onClick={() => onDelete && onDelete(webAsset.id)}
                    >
                      Delete
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!onPublish || webAsset.published}
                      onClick={() => onPublish && onPublish(webAsset.id)}
                    >
                      Publish
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      disabled={!onUnpublish || !webAsset.published}
                      onClick={() => onUnpublish && onUnpublish(webAsset.id)}
                    >
                      Unpublish
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={10}
              className="py-4 text-center text-sm text-muted-foreground"
            >
              No web assets
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
