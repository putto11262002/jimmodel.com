import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import useMultipleValue from "./use-multiple-value";

export default function MultipleInput({
  value,
  onChange,
  listStyle = "block",
  defaultValue = [],
}: {
  value?: string[] | undefined | null;
  onChange?: (value: string[]) => void;
  listStyle?: "inline" | "block";
  defaultValue?: string[];
}) {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined
  );

  const { selectedValues, onRemove, onAdd } = useMultipleValue({
    defaultValue,
    value: value ?? undefined,
    onChange,
  });

  return (
    <div className="grid gap-4 w-full">
      <ul
        className={cn(
          listStyle === "inline" && "flex flex-wrap gap-2",
          listStyle === "block" && "grid gap-2"
        )}
      >
        {selectedValues.map((v, index) => (
          <li
            key={index}
            className="py-2 px-4 border rounded-md text-sm flex items-center justify-between gap-1"
          >
            <span>{v}</span>
            <Button
              type="button"
              size={"icon"}
              variant={"ghost"}
              className="h-5 w-5"
            >
              <X onClick={() => onRemove(v)} className="h-3.5 w-3.5" />
            </Button>
          </li>
        ))}
      </ul>
      <div className="inline-flex items-center space-x-2 ">
        <Input
          onChange={(e) => setSelectedValue(e.target.value)}
          value={selectedValue}
        />
        <Button
          type="button"
          onClick={() => {
            if (selectedValue && selectedValue.length > 0) {
              onAdd(selectedValue);
              setSelectedValue("");
            }
          }}
          variant={"outline"}
          className="h-9"
        >
          Add
        </Button>
      </div>
    </div>
  );
}
