import { ContactMessage } from "@/lib/domains";
import ContactMessageCard from "./contact-message-card";
import SearchParamsForm from "@/components/shared/search-params-form";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Pagination } from "@/lib/types/paginated-data";
import { ContactMessagesGetFilter } from "@/lib/usecases";

export default function ContactMessageList({
  messages,
  currentFilter,
  pagination,
}: {
  messages: ContactMessage[];
  pagination: Pagination;
  currentFilter: ContactMessagesGetFilter;
}) {
  return (
    <div className="flex flex-col h-full overflow-y-hidden">
      <div className="flex justify-between items-center gap-4 px-3 py-2 border-b">
        <SearchParamsForm
          obj={{ page: pagination.page - 1, read: currentFilter.read }}
          button={
            <Button disabled={!pagination.hasPrev} size="sm" variant="ghost">
              <ChevronLeft className="icon-sm" />
            </Button>
          }
        />
        <SearchParamsForm
          obj={{ page: pagination.page + 1, read: currentFilter.read }}
          button={
            <Button disabled={!pagination.hasNext} size="sm" variant="ghost">
              <ChevronRight className="icon-sm" />
            </Button>
          }
        />
      </div>

      <div className="grow overflow-y-scroll no-scrollbar">
        {messages.length > 0 ? (
          <div className="flex flex-col gap-2 px-3 py-4">
            {messages.map((contact, index) => (
              <ContactMessageCard contactMessage={contact} key={index} />
            ))}
          </div>
        ) : (
          <div className="flex justify-center items-center h-full text-sm text-muted-foreground">
            No messages found
          </div>
        )}
      </div>
    </div>
  );
}
