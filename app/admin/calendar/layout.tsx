import { CalendarProvider } from "./_components/calendar-context";
import { SheetProvider } from "./_components/day-sheet-provider";
import ControlBar from "./_components/control-bar";
import { BreakcrumbSetter } from "@/components/breadcrumb";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <CalendarProvider>
		<BreakcrumbSetter breadcrumbs={[{label: "Calendar"}]}/>
      <SheetProvider />
      <div className="flex flex-col h-[calc(100vh-theme(spacing.14))]">
        <div className="py-2 px-4 bg-background border-b">
          <ControlBar />
        </div>
        <div className="grow">{children}</div>
      </div>
    </CalendarProvider>
  );
}
