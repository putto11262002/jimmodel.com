import { format } from "date-fns";
import { UseCalendarBaseReturnType } from "./use-calendar";
import { ToggleGroup, ToggleGroupItem } from "../ui/toggle-group";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "../ui/button";

export default function DefaultControl({
  mode,
  ref,
  next,
  previous,
  start,
  end,
  setMode,
  today,
}: UseCalendarBaseReturnType) {
  return (
    <div className="py-2 px-4 bg-background border-b flex items-center justify-between">
      {/* <ControlBar /> */}
      <div className="flex items-center gap-2">
        <p className="font-semibold">
          {mode === "month"
            ? format(ref, "MMM yyyy")
            : `${format(start, "dd MMM")} - ${format(end, "dd MMM")}`}
        </p>
        <Button
          onClick={() => previous()}
          className=""
          variant="outline"
          size={"xs"}
        >
          <ChevronLeft className="icon-sm" />
        </Button>

        <Button
          onClick={() => next()}
          className=""
          variant="outline"
          size={"xs"}
        >
          <ChevronRight className="icon-sm" />
        </Button>
        <Button onClick={() => today()} size="xs">
          Today
        </Button>
      </div>
      <div>
        <ToggleGroup
          className="hidden lg:flex"
          size="sm"
          type="single"
          value={mode}
          onValueChange={(value) => setMode(value as any)}
          variant="outline"
        >
          <ToggleGroupItem value="week" aria-label="Toggle bold">
            Week
          </ToggleGroupItem>

          <ToggleGroupItem value="month" aria-label="Toggle italic">
            Month
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
}
