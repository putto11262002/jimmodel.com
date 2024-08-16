"use client";
import Container from "@/components/container";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import permissions from "@/config/permission";
import { useGetUser } from "@/hooks/queries/user";
import useSession from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { combine, hasPermission } from "@/lib/utils/auth";
import { upperFirst } from "lodash";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
const forms = [
  { form: "password", permissions: permissions.users.updateRoleById },
  { form: "roles", permissions: permissions.users.updateRoleById },
  { form: "image", permissions: permissions.users.addImageById },
];
export default function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  const path = usePathname();
  const router = useRouter();
  const session = useSession(
    combine(
      permissions.users.updateRoleById,
      permissions.users.addImageById,
      permissions.users.updatePasswordById,
    ),
  );
  const { data, isPending } = useGetUser({
    id,
    enabled: session.status === "authenticated",
  });

  if (session.status === "loading" || isPending || !data) {
    return (
      <Container>
        <Loader />
      </Container>
    );
  }

  return (
    <Container max="md" className="grid gap-6">
      <div className="flex items-center gap-4">
        <h2 className="text-2xl font-semibold">
          {upperFirst(data.name)}&apos;s Profile
        </h2>
      </div>
      <div className="items-start gap-6 flex	">
        <div className="grid sm:min-w-44 ">
          <ul className="grid gap-3">
            {forms
              .filter(({ permissions }) =>
                hasPermission(permissions, session.data.user.roles),
              )
              .map(({ form }, index) => (
                <li key={index}>
                  <Link
                    className={cn(
                      "text-sm text-muted-foreground",
                      path.split("/").pop() === form && "text-foreground",
                    )}
                    href={`/admin/users/${id}/update/${form}`}
                    replace
                  >
                    {upperFirst(form)}
                  </Link>
                </li>
              ))}
          </ul>
        </div>
        <div className="grow">{children}</div>
      </div>
    </Container>
  );
}
