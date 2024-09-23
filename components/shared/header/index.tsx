import { LinkMenuItem } from "@/components/shared/types/menu";
import { cn } from "@/lib/utils";
import Container, { ContainerCvaProps } from "../../container";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { auth } from "@/config";
import Menu from "./menu";
import Link from "next/link";

export type HeaderBreadcrumb = { label: string; href: string };
export default async function Header({
  items,
  children,
  breadcrumb,
  className,
}: {
  items?: (LinkMenuItem & { isActive?: boolean })[];
  children?: React.ReactNode;
  max?: ContainerCvaProps["max"];
  breadcrumb: HeaderBreadcrumb[];
  className?: React.HtmlHTMLAttributes<HTMLDivElement>["className"];
}) {
  const session = await auth();

  return (
    <div
      className={cn(
        "border-b sticky border-box bg-background top-0 z-10",
        className
      )}
    >
      <Container
        max={"liquid"}
        className="py-3.5 grid gap-2 max-w-full overflow-auto no-scrollbar"
      >
        <Breadcrumb className="text-xs">
          <BreadcrumbList>
            {breadcrumb.map(({ label, href }, index) =>
              index !== breadcrumb.length - 1 ? (
                <div key={index} className="flex items-center gap-1.5">
                  <BreadcrumbItem>
                    <BreadcrumbLink>
                      <Link href={href}>{label}</Link>
                    </BreadcrumbLink>
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </div>
              ) : (
                <BreadcrumbItem key={index}>
                  <BreadcrumbPage>{label}</BreadcrumbPage>
                </BreadcrumbItem>
              )
            )}
          </BreadcrumbList>
        </Breadcrumb>
        {children && <div className="">{children}</div>}
      </Container>

      <Menu user={session.user} items={items} />
    </div>
  );
}
