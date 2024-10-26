import Header, { HeaderBreadcrumb } from "@/components/shared/header";
import { auth } from "@/config";
import permissions from "@/config/permission";
import routes from "@/config/routes";
import { SearchParamsObj } from "@/lib/types/search-param";
import { ContactMessagesGetFilterSchema } from "@/lib/usecases/contact-message/inputs/get-contact-messages-filter";
import { validateSearchParamObj } from "@/lib/utils/search-param";
import { getContactMessages } from "@/loaders/contact-message";
import ContactMessagePageContent from "./_components/content";

const breadcrumb: HeaderBreadcrumb[] = [
  {
    label: "Admin",
    href: routes.admin.main,
  },
  {
    label: "Contact Messages",
    href: routes.admin.contactMessages.main,
  },
];

const getMenuItems = ({ read }: { read: boolean }) => [
  {
    label: "Unread",
    href: `${routes.admin.contactMessages.main}?read=false`,
    isActive: !read,
  },
  {
    label: "Read",
    href: `${routes.admin.contactMessages.main}?read=true`,
    isActive: read,
  },
];

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<SearchParamsObj>;
}) {
  await auth({ permission: permissions.contactMessages.getContactMessages });
  const resovledSearchParams = await searchParams;
  const result = validateSearchParamObj(
    resovledSearchParams,
    ContactMessagesGetFilterSchema
  );
  const contactMessagesGetFilter = result.ok ? result.data : {};
  const read =
    typeof contactMessagesGetFilter.read === "boolean"
      ? contactMessagesGetFilter.read
      : false;
  const { data, ...pagination } = await getContactMessages({
    ...contactMessagesGetFilter,
    read,
    pageSize: 10,
  });
  return (
    <div className="h-[calc(100vh-theme(spacing.14))] md:h-screen overflow-x-hidden grid grid-rows-[auto_1fr]">
      <Header breadcrumb={breadcrumb} items={getMenuItems({ read })} />
      <ContactMessagePageContent
        messages={data}
        pagination={pagination}
        currentFilter={{ read }}
      />
    </div>
  );
}
