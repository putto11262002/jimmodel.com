import { X } from "lucide-react";
import { Button } from "./ui/button";
import { Command, CommandItem, CommandList } from "./ui/command";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";
import { useState } from "react";

export default function MultipleSelect<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T[] | undefined | null;
  onChange: (value: string[]) => void;
}) {
  const [selectedValue, setSelectedValue] = useState<T | undefined>(undefined);
  return (
    <div className="grid gap-4 w-full">
      <ul className="flex flex-wrap gap-2">
        {value?.map((v, index) => (
          <li
            key={index}
            className="py-1 px-2 border rounded-md text-sm flex items-center gap-1"
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
        <Select onValueChange={(v) => setSelectedValue(v as T)}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {options.map((option, index) => (
              <SelectItem key={index} value={option}>
                {option}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
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
