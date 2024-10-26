"use client";
import Form, { FormProps } from "next/form";
import React, { useCallback, useRef, useState } from "react";
import { Button, ButtonProps } from "../ui/button";
import { Loader2 } from "lucide-react";

type AutoFormContext = {
  pending: boolean;
  onChange: () => void;
};
const autoFormContext = React.createContext<AutoFormContext>({
  pending: false,
  onChange: () => {},
});

export const useAutoForm = () => React.useContext(autoFormContext);

interface Props extends FormProps {
  autoSubmit?: boolean;
}

const AutoForm = React.forwardRef<HTMLFormElement, Props>(
  ({ autoSubmit = true, ...props }, ref) => {
    const formRef = useRef<HTMLFormElement | null>(null); // Internal ref for the form
    const timeoutRef = useRef<number | null>(null); // Ref to track the timeout ID
    const [pending, setPending] = useState(false); // State to track the form pending status

    const handleChange = useCallback(() => {
      // Clear the previous timeout if it exists
      if (!autoSubmit) return;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setPending(true); // Set the pending state to true

      // Set a new timeout to delay the form submission by 1 second
      timeoutRef.current = window.setTimeout(() => {
        if (formRef.current) {
          formRef.current.requestSubmit(); // Submit the form after the delay
        }
        setPending(false); // Set the pending state to false
      }, 1000);
    }, []); // No dependencies, so the function is memoized and won't change on re-renders

    return (
      <autoFormContext.Provider value={{ pending, onChange: handleChange }}>
        <Form
          ref={formRef} // Use the internal ref for the Form component
          {...props}
          replace={autoSubmit}
        />
      </autoFormContext.Provider>
    );
  }
);

export default AutoForm;

export const AutoFormPendingIcon = React.forwardRef<
  HTMLButtonElement,
  ButtonProps
>((props, ref) => {
  const { pending } = useAutoForm();
  if (!pending) return null;
  return (
    <Button {...props} ref={ref} type="button">
      <Loader2 className="animate-spin icon-sm" />
    </Button>
  );
});
