"use client";
import { ContactMessage } from "@/lib/domains";
import React from "react";

export type ContactMessagePreviewContext = {
  selected: ContactMessage | null;
  setSelected: (message: ContactMessage) => void;
  clearSelected: () => void;
};

export const contactMessagePreviewContext =
  React.createContext<ContactMessagePreviewContext>({
    selected: null,
    setSelected: () => {},
    clearSelected: () => {},
  });

export const useContactMessagePreview = () =>
  React.useContext(contactMessagePreviewContext);

export const ContactMessagePreviewProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const [selected, setSelected] = React.useState<ContactMessage | null>(null);

  const clearSelected = React.useCallback(() => {
    setSelected(null);
  }, []);

  return (
    <contactMessagePreviewContext.Provider
      value={{ selected, setSelected, clearSelected }}
    >
      {children}
    </contactMessagePreviewContext.Provider>
  );
};
