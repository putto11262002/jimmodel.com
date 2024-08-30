"use client";

import Container from "@/components/container";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import ContactMessageTable from "./_components/contact-message-table";
import {
  useGetContactMessages,
  useMarkContactMessagesARead,
} from "@/hooks/queries/contact-message";
import Loader from "@/components/loader";
import { useViewContactMessage } from "./_components/view-contact-message";
import Pagination from "@/components/public/pagination";
import { ContactMessageFilterQuerySchema } from "@/lib/validators/contact-message";
import FilterSection from "./_components/filter-section";
import { useBreadcrumbSetter } from "@/components/breadcrumb";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";

export default function Page({
  searchParams,
}: {
  searchParams: { page: string; read: string };
}) {
  const session = useSession(permissions.contactMessages.getContactMessages);
  useBreadcrumbSetter([{ label: "Contact Messages" }]);
  const { page, read } = ContactMessageFilterQuerySchema.parse(searchParams);
  const { data, isSuccess } = useGetContactMessages({
    page,
    read,
    enabled: session.status === "authenticated",
  });
  const { view } = useViewContactMessage();
  const { mutate: markAsRead } = useMarkContactMessagesARead();

  if (!isSuccess) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }
  return (
    <Container className="grid gap-4">
      <FilterSection searchParams={searchParams} />
      <Card className="min-w-0">
        <CardHeader>
          <CardTitle>Contact Messages</CardTitle>
        </CardHeader>
        <CardContent>
          <ContactMessageTable
            onView={(contactMessage) => view(contactMessage)}
            onMarkAsRead={({ id }) => markAsRead({ id })}
            contactMessages={data.data}
          />
        </CardContent>
        <CardFooter>
          <div className="ml-auto">
            <Pagination size={"sm"} {...data} path="/admin/contacts" />
          </div>
        </CardFooter>
      </Card>
    </Container>
  );
}
