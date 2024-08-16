"use client";
import Container from "@/components/container";
import Loader from "@/components/loader";
import { Button } from "@/components/ui/button";
import permissions from "@/config/permission";
import useSession from "@/hooks/use-session";
import { cn } from "@/lib/utils";
import { combine, hasPermission } from "@/lib/utils/auth";
import { upperFirst } from "lodash";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
const forms = [
  { form: "password", permissions: permissions.users.updateSelfPassword },
  { form: "roles", permissions: permissions.users.updateSelfRole },
  { form: "image", permissions: permissions.users.addSelfImage },
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
  const session = useSession();

  if (session.status === "loading") {
    return (
      <Container className="grid gap-6">
        <Loader />;
      </Container>
    );
  }
  return (
    <Container max="md" className="grid gap-6">
      <div className="flex items-center gap-4">
        <Button
          onClick={() => router.back()}
          className=""
          variant={"outline"}
          size={"icon"}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        <h2 className="text-2xl font-semibold">My Profile</h2>
      </div>
      <div className="flex items-start gap-6">
        <div className="grid min-w-44">
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
                    href={`/admin/users/self/update/${form}`}
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
