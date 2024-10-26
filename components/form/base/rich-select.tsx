"use client";
import { cn } from "@/lib/utils";
import { Button, ButtonProps } from "@/components/ui/button";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import * as React from "react";
import { CaretSortIcon, CheckIcon } from "@radix-ui/react-icons";
import useSWR from "swr";
import { Loader2, PlusCircle } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { values } from "lodash";
import { Checkbox } from "@/components/ui/checkbox";
import { BoxSize } from "@/components/shared/types/box";

type Option = { label: string; value: string };

type RichSelectBaseProps = Omit<
  ButtonProps,
  "onChange" | "value" | "defaultValue" | "size"
> & {
  data:
    | ((args: { q?: string; values?: string[] }) => Promise<Option[]>)
    | Option[];
  label?: string;
  limit?: number;
  size?: BoxSize;
};

export type SingleRichSelectProps = RichSelectBaseProps & {
  mode: "single";
  onChange?: (value: string | undefined) => void;
  defaultValue?: string;
};

export type MultipleRichSelectProps = RichSelectBaseProps & {
  mode: "multiple";
  onChange?: (value: string[]) => void;
  defaultValue?: string[];
};

export type RichSelectProps = RichSelectBaseProps & {
  mode: "single" | "multiple";
  onChange?: (value: any) => void;
  defaultValue?: any;
};

function RichSelect(props: SingleRichSelectProps): JSX.Element;
function RichSelect(props: MultipleRichSelectProps): JSX.Element;

function RichSelect(props: RichSelectProps) {
  const {
    data,
    className,
    label,
    limit = 3,
    mode,
    onChange,
    defaultValue,
    ...buttonProps
  } = props;

  const [open, setOpen] = React.useState(false);
  const [searchTerm, setSearchTerm] = React.useState("");
  const [q, setQ] = React.useState("");
  const [selected, setSelected] = React.useState<Option[]>([]);

  const timeoutRef = React.useRef<number | null>(null);

  React.useEffect(() => {
    if (!searchTerm) return;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      setQ(searchTerm);
    }, 1000);
  }, [searchTerm]);

  const {
    data: _options,
    isLoading,
    error,
  } = useSWR(
    open
      ? {
          q: typeof data === "function" ? q : "",
        }
      : undefined,
    async ({ q }) => {
      if (typeof data !== "function") return data;
      const options = await data({ q });
      return options;
    }
  );

  const { data: defaultOptions } = useSWR(
    defaultValue ? { values: [defaultValue] } : undefined,
    async ({ values }) => {
      if (typeof data !== "function") return data;
      const options = await data({ values });
      const _default = options.find((v) => v.value === defaultValue);
      if (_default) setSelected([_default]);
      return options;
    }
  );

  const addValue = React.useCallback(
    (option: Option) => {
      setSelected((prev) => {
        let updated;
        if (mode === "single") {
          updated = [option];
        } else {
          const exists = prev.find((v) => v.value === option.value);
          if (exists) {
            updated = prev;
          } else {
            updated = [...prev, option];
          }
        }
        handleChange(updated);
        return updated;
      });
    },
    [mode]
  );

  const removeValue = React.useCallback((option: Option) => {
    setSelected((prev) => {
      const updated = prev.filter((v) => v.value !== option.value);
      handleChange(updated);
      return updated;
    });
  }, []);

  const clear = React.useCallback(() => {
    setSelected([]);
    handleChange([]);
  }, []);

  const handleChange = React.useCallback(
    (v: Option[]) => {
      if (!onChange) return;
      if (mode === "single") {
        (onChange as Exclude<SingleRichSelectProps["onChange"], undefined>)(
          v[0]?.value
        );
      }
      if (mode === "multiple") {
        (onChange as Exclude<MultipleRichSelectProps["onChange"], undefined>)(
          v.map((v) => v.value)
        );
      }
    },
    [mode, onChange, selected]
  );

  const options = _options || defaultOptions;

  // Rest of your component implementation remains the same
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          {...buttonProps}
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn("items-center gap-2", className)}
        >
          <div className="flex items-center gap-2">
            <PlusCircle className="icon-sm" />
            {label && <span>{label}</span>}
          </div>
          {selected && selected.length > 0 && (
            <>
              <Separator orientation="vertical" />
              <div className="flex items-center gap-1">
                {selected.map(({ label }, index) => (
                  <div
                    className="px-1.5 py-0.5 rounded border bg-accent"
                    key={index}
                  >
                    {label}
                  </div>
                ))}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="w-[200px] p-0">
        <Command filter={() => 1}>
          <CommandInput
            onValueChange={setSearchTerm}
            onInput={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            value={searchTerm}
            placeholder="Search..."
            className="h-9"
          />
          <CommandList>
            {isLoading && (
              <CommandGroup>
                <CommandItem className="justify-center">
                  <Loader2 className="animate-spin icon-sm" />
                </CommandItem>
              </CommandGroup>
            )}
            {!isLoading &&
              options &&
              (options.length > 0 ? (
                <div className="max-h-60 overflow-y-auto no-scrollbar">
                  <CommandGroup>
                    {options.map((option, index) => {
                      const isSelected = selected.find(
                        (v) => v.value === option.value
                      );
                      return (
                        <CommandItem
                          onSelect={() =>
                            isSelected ? removeValue(option) : addValue(option)
                          }
                          key={index}
                          value={option.value}
                        >
                          <Checkbox
                            value={option.value}
                            checked={Boolean(isSelected)}
                          />
                          <span className="ml-2">{option.label}</span>
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                </div>
              ) : (
                <CommandGroup>
                  <CommandItem className="justify-center text-sm text-muted-foreground">
                    No result
                  </CommandItem>
                </CommandGroup>
              ))}
            {selected.length > 0 && (
              <>
                <CommandSeparator />
                <CommandGroup>
                  <CommandItem
                    onSelect={() => clear()}
                    className="justify-center"
                  >
                    Clear
                  </CommandItem>
                </CommandGroup>
              </>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export default RichSelect;
