import Link from "next/link";
import { CalendarProvider } from "./_components/calendar-context";
import { Button } from "../../../components/ui/button";
import { ChevronLeft, ChevronRight, Clock } from "lucide-react";
import dayjs from "dayjs";
import { SheetProvider } from "./_components/day-sheet-provider";
import ControlBar from "./_components/control-bar";

export default function Layout({ children }: { children: React.ReactNode }) {

  return (
    <CalendarProvider>
        <SheetProvider/>
      <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 ">
        <div>
        <ControlBar/>
       
        </div>
        {children}
      </main>
    </CalendarProvider>
  );
}
