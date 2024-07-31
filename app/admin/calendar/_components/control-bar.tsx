"use client";
import Link from "next/link";
import { useCalendar } from "./calendar-context";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";

export default function ControlBar() {
  const { now, next, prev, cur } = useCalendar();
  return (
    <div className="flex gap-4 items-center">
      <Button
        onClick={() => prev()}
        className="h-7"
        size={"sm"}
        variant={"outline"}
      >
        <ChevronLeft className="h-3.5 w-3.5 " />
      </Button>
      <Button
        onClick={() => next()}
        className="h-7"
        size={"sm"}
        variant={"outline"}
      >
        <ChevronRight className="h-3.5 w-3.5 " />
      </Button>

      <Button onClick={() => cur()} className="h-7" size={"sm"}>
        <Clock className="h-3.5 w-3.5 " />
        <span className="ml-2">Today</span>
      </Button>
    </div>
  );
}

