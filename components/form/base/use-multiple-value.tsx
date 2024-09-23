import { useEffect, useState } from "react";

function useMultipleValue<T>({
  defaultValue,
  value,
  onChange,
}: {
  defaultValue?: T[];
  value?: T[];
  onChange?: (value: T[]) => void;
}) {
  const [internalValues, setInternalValues] = useState<T[]>(defaultValue || []);

  // Sync internal state with value prop when it changes
  useEffect(() => {
    if (value !== undefined) {
      setInternalValues(value);
    }
  }, [value]);

  function onAdd(item: T) {
    if (value) {
      // For controlled component, call onChange
      if (!value.includes(item)) {
        onChange?.([...value, item]);
      }
    } else {
      // For uncontrolled component, update internal state
      setInternalValues((prev) => {
        if (!prev.includes(item)) {
          const newState = [...prev, item];
          onChange?.(newState);
          return newState;
        }
        return prev;
      });
    }
  }

  function onRemove(item: T) {
    if (value) {
      // For controlled component, call onChange
      onChange?.(value.filter((v) => v !== item));
    } else {
      // For uncontrolled component, update internal state
      setInternalValues((prev) => {
        const newState = prev.filter((v) => v !== item);
        onChange?.(newState);
        return newState;
      });
    }
  }

  return {
    selectedValues: value ?? internalValues,
    onAdd,
    onRemove,
  };
}

export default useMultipleValue;
