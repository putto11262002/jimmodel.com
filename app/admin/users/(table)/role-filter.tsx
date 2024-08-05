"use client";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { userRoles } from "@/db/schemas/users";
import { ListFilter } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import _ from "lodash";
import React from "react";

export default function RoleFilter() {
  const searchParams = useSearchParams();

  const removeParam = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const updated = params.getAll(name).filter((v) => v != value);
      params.delete(name);
      if (updated.length > 0) {
        updated.forEach((v) => params.append(name, v));
      }
      return params.toString();
    },
    [searchParams],
  );

  const appendSearchParam = React.useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.append(name, value);
      return params.toString();
    },
    [searchParams],
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="h-7 gap-1">
          <ListFilter className="h-3.5 w-3.5" />
          <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
            Roles
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Filter by</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {userRoles.map((role) => (
          <Link
            key={role}
            href={
              searchParams.getAll("roles").includes(role)
                ? `/admin/users?${removeParam("roles", role)}`
                : `/admin/users?${appendSearchParam("roles", role)}`
            }
          >
            <DropdownMenuCheckboxItem
              checked={searchParams.getAll("roles").includes(role)}
            >
              {_.upperFirst(role)}
            </DropdownMenuCheckboxItem>
          </Link>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
