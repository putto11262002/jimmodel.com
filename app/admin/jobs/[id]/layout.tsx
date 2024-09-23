import Container from "@/components/container";
import permissions from "@/config/permission";
import { getJobOrThrow } from "@/loaders/job";
import { auth } from "@/config";
import routes from "@/config/routes";
import Header from "@/components/shared/header";

const menuItems = ({ id }: { id: string }) => [
  { label: "Edit", href: routes.admin.jobs["[id]"].edit.main({ id }) },
  { label: "Bookings", href: routes.admin.jobs["[id]"].bookings({ id }) },
  { label: "Models", href: routes.admin.jobs["[id]"].models({ id }) },
  { label: "Settings", href: routes.admin.jobs["[id]"].settings.main({ id }) },
];

const breadcrumb = ({ id, name }: { id: string; name: string }) => [
  {
    label: "Admin",
    href: routes.admin.main,
  },
  {
    label: "Jobs",
    href: routes.admin.jobs.main,
  },

  {
    label: name,
    href: routes.admin.jobs["[id]"].main({ id }),
  },
];
export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.jobs.getJobById });
  const job = await getJobOrThrow(id);

  return (
    <>
      <Header
        breadcrumb={breadcrumb({ id, name: job.name })}
        items={menuItems({ id })}
      ></Header>
      <Container max="xl" className="">
        {children}
      </Container>
    </>
  );
}
