"use client";
import KeyValueItem from "@/components/key-value/key-value-item";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ContactMessage } from "@/lib/types/contact-messasge";
import { createContext, useContext, useState } from "react";

type ViewContactMessageContext = {
  target: ContactMessage | null;
  view: (contactMessage: ContactMessage) => void;
  clear: () => void;
};

const viewContactMessageContext = createContext<ViewContactMessageContext>({
  target: null,
  view: () => {},
  clear: () => {},
});

export const useViewContactMessage = () =>
  useContext(viewContactMessageContext);

export default function ViewContactMessageProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [target, setTarget] = useState<ContactMessage | null>(null);

  const view = (contactMessage: ContactMessage) => {
    setTarget(contactMessage);
  };

  const clear = () => {
    setTarget(null);
  };

  return (
    <viewContactMessageContext.Provider value={{ target, view, clear }}>
      <ContactMessageSheet />
      {children}
    </viewContactMessageContext.Provider>
  );
}

const ContactMessageSheet = () => {
  const { target, clear } = useViewContactMessage();
  return (
    <Sheet open={target !== null} onOpenChange={(open) => !open && clear()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Contact Message</SheetTitle>
        </SheetHeader>
        <div className="py-4 grid gap-4">
          <KeyValueItem _key="Name" value={target?.name} />
          <KeyValueItem _key="Phone" value={target?.phone} />
          <KeyValueItem _key="Email" value={target?.email} />
          <p>{target?.message}</p>
        </div>
      </SheetContent>
    </Sheet>
  );
};
