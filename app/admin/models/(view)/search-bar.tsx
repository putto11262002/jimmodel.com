"use client";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function SearchBar() {
  return (
    <div className="flex items-center">
      <div></div>
      <div className="ml-auto flex items-center gap-2">
        <Link href="/admin/models/add">
          <Button size="sm" className="h-7 gap-1">
            <PlusCircle className="h-3.5 w-3.5" />
            <span className="sr-only sm:not-sr-only sm:whitespace-nowrap">
              Add model
            </span>
          </Button>
        </Link>
      </div>
    </div>
  );
}
