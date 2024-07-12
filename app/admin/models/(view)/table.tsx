"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  TableHead,
  Table,
  TableHeader,
  TableRow,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import UserAvatar from "@/components/user/user-avatar";
import { ModelProfile } from "@/db/schemas/models";
import { User } from "@/db/schemas/users";
import { MoreHorizontal } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
export default function UserTable({ models }: { models: ModelProfile[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>
            <span className="sr-only">Profile Image</span>
          </TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Gender</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {models.map((model) => (
          <TableRow key={model.id}>
            <TableCell>
              <UserAvatar
                user={{
                  name: model.name,
                  image: model.profileImage
                    ? { id: model.profileImage.fileId }
                    : null,
                }}
              />
            </TableCell>
            <TableCell className="hidden sm:table-cell">{model.name}</TableCell>
            <TableCell className="font-medium">{model.gender}</TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button aria-haspopup="true" size="icon" variant="ghost">
                    <MoreHorizontal className="h-4 w-4" />
                    <span className="sr-only">Toggle menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuLabel>Actions</DropdownMenuLabel>
                  <DropdownMenuItem>View Profile</DropdownMenuItem>
                  <Link href={`/admin/models/update/${model.id}/general`}>
                    <DropdownMenuItem>Update</DropdownMenuItem>
                  </Link>
                  <Link href={`/admin/models/update/${model.id}/images`}>
                    <DropdownMenuItem>Upload image</DropdownMenuItem>
                  </Link>
                  <Link href={`/admin/models/update/${model.id}/settings`}>
                    <DropdownMenuItem>Settings</DropdownMenuItem>
                  </Link>
                  <Link href={`/admin/models/${model.id}/blocks/add`}>
                    <DropdownMenuItem>Block</DropdownMenuItem>
                  </Link>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
