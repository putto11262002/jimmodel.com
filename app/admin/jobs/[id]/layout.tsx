import Container from "@/components/container";
import permissions from "@/config/permission";
import { getJobOrThrow } from "@/loaders/job";
import { auth } from "@/config";
import routes from "@/config/routes";
import Header from "@/components/shared/header";

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
    <div className="flex flex-col h-full">
      <Header breadcrumb={breadcrumb({ id, name: job.name })}></Header>
      <Container max="xl" className="grow overflow-hidden">
        {children}
      </Container>
    </div>
  );
}
