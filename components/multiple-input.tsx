import { X } from "lucide-react";
import { Button } from "./ui/button";
import { useState } from "react";
import { Input } from "./ui/input";
import { cn } from "@/lib/utils";

export default function MultipleInput({
  value,
  onChange,
  listStyle = "block",
}: {
  value: string[] | undefined | null;
  onChange: (value: string[]) => void;
  listStyle?: "inline" | "block";
}) {
  const [selectedValue, setSelectedValue] = useState<string | undefined>(
    undefined
  );
  return (
    <div className="grid gap-4 w-full">
      <ul
        className={cn(
          listStyle === "inline" && "flex flex-wrap gap-2",
          listStyle === "block" && "grid gap-2"
        )}
      >
        {value?.map((v, index) => (
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
              <X
                onClick={() => onChange(value.filter((_v) => _v !== v))}
                className="h-3.5 w-3.5"
              />
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
            if (selectedValue && !value?.includes(selectedValue)) {
              onChange([...(value ? value : []), selectedValue]);
              setSelectedValue(undefined);
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
