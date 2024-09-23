import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import useMultipleValue from "./use-multiple-value";

export default function MultipleSelect<T extends string>({
  options,
  value,
  onChange,
  defaultValue,
  transform,
}: {
  options: { label?: string; value: T }[];
  value?: T[] | undefined | null;
  onChange?: (value: string[]) => void;
  defaultValue?: T[];
  transform?: (value: T) => string;
}) {
  const [selectedValue, setSelectedValue] = useState<T>("" as T);
  const { selectedValues, onAdd, onRemove } = useMultipleValue({
    defaultValue,
    value: value ?? undefined,
    onChange,
  });

  return (
    <div className="grid gap-4 w-full">
      <ul className="flex flex-wrap gap-2">
        {selectedValues?.map((v, index) => (
          <li
            key={index}
            className="py-2 px-4 border rounded-lg text-sm flex items-center gap-2"
          >
            <span>{transform ? transform(v) : v}</span>
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
        <Select
          value={selectedValue}
          onValueChange={(v) => setSelectedValue(v as T)}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map(({ label, value }, index) => (
              <SelectItem key={index} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Button
          type="button"
          onClick={() => {
            if (selectedValue) {
              onAdd(selectedValue);
              setSelectedValue("" as T);
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
