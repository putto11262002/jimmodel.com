import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ContactMessage } from "@/lib/types/contact-messasge";
import { formatISODateString } from "@/lib/utils/date";
import { truncate } from "lodash";
import { MoreHorizontal } from "lucide-react";

export default function ContactMessageTable({
  contactMessages,
  onMarkAsRead,
  onView,
}: {
  contactMessages: ContactMessage[];
  onMarkAsRead?: (contactMessage: ContactMessage) => void;
  onView?: (contactMessage: ContactMessage) => void;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Name</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Message</TableHead>
          <TableHead>Submitted At</TableHead>
          <TableHead>
            <span className="sr-only">Actions</span>
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contactMessages.length > 0 ? (
          contactMessages.map((contactMessage, index) => (
            <TableRow key={index}>
              <TableCell>{contactMessage.name}</TableCell>
              <TableCell>{contactMessage.email}</TableCell>
              <TableCell>{truncate(contactMessage.message)}</TableCell>
              <TableCell>
                {formatISODateString(contactMessage.createdAt)}
              </TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size={"icon"}>
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuItem
                      disabled={!onView}
                      onClick={() => onView && onView(contactMessage)}
                    >
                      View
                    </DropdownMenuItem>
                    {!contactMessage.read && (
                      <DropdownMenuItem
                        disabled={!onMarkAsRead}
                        onClick={() =>
                          onMarkAsRead && onMarkAsRead(contactMessage)
                        }
                      >
                        Mark as read
                      </DropdownMenuItem>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell
              colSpan={10}
              className="py-4 text-center text-muted-foreground text-sm"
            >
              No messages found
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}
