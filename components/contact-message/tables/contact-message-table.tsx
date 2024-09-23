import DataTable from "@/components/data-table";
import { Badge } from "@/components/ui/badge";
import { ContactMessage } from "@/lib/domains/types/contact-message";
import { truncate } from "lodash";
import ContactMessageManageDialog from "../contact-message-manage-dialog";
import { Button } from "@/components/ui/button";
import { Edit } from "lucide-react";

export default function ContactMessageTable({
  contactMessages,
}: {
  contactMessages: ContactMessage[];
}) {
  return (
    <DataTable
      border
      rounded
      columns={[
        {
          key: "name",
          header: "Name",
        },
        {
          key: "email",
          header: "Email",
        },
        {
          key: "message",
          header: "Message",
        },
        {
          key: "read",
          header: "Read",
        },
        {
          key: "action",
          hideHeader: true,
        },
      ]}
      data={contactMessages.map((contactMessage) => ({
        name: contactMessage.name,
        email: contactMessage.email,
        message: truncate(contactMessage.message),
        read: (
          <Badge variant="outline">
            {contactMessage.read ? "Read" : "Unread"}
          </Badge>
        ),
        action: (
          <ContactMessageManageDialog
            contactMessage={contactMessage}
            trigger={
              <Button size="icon" variant="ghost">
                <Edit className="icon-md" />
              </Button>
            }
          />
        ),
      }))}
    />
  );
}
