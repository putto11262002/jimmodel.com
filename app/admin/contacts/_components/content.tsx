"use client";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ContactMessageCard from "./contact-message-card";
import ContactMessagePreview from "./contact-message-preview";
import SearchParamsForm from "@/components/shared/search-params-form";
import { ContactMessage } from "@/lib/domains";
import { ContactMessagesGetFilter } from "@/lib/usecases";
import { Pagination } from "@/lib/types/paginated-data";
import { useContactMessagePreview } from "./contect-message-context";
import { cn } from "@/lib/utils";
import ContactMessageList from "./contact-message-list";

export default function ContactMessagePageContent({
  messages,
  currentFilter,
  pagination,
}: {
  messages: ContactMessage[];
  currentFilter: ContactMessagesGetFilter;
  pagination: Pagination;
}) {
  const { selected } = useContactMessagePreview();
  return (
    <>
      <div className="hidden md:block overflow-x-hidden h-full">
        <div className={cn("grid grid-cols-[2fr_3fr] items-stretch h-full ")}>
          <div className="h-full border-r overflow-y-hidden ">
            <ContactMessageList
              messages={messages}
              currentFilter={currentFilter}
              pagination={pagination}
            />
          </div>

          <ContactMessagePreview />
        </div>
      </div>

      <div className="block md:hidden overflow-x-hidden  h-full ">
        <div
          className={cn(
            "grid grid-cols-[100%_100%] items-stretch h-full transition-transform duration-300 delay-75",
            !selected ? "translate-x-0" : "translate-x-[-100%]"
          )}
        >
          <div className="h-full border-r overflow-y-hidden ">
            <ContactMessageList
              messages={messages}
              currentFilter={currentFilter}
              pagination={pagination}
            />
          </div>

          <ContactMessagePreview />
        </div>
      </div>
    </>
  );
}
