"use client";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { truncate } from "lodash";
import Link from "next/link";
import { usePathname } from "next/navigation";

const breadcrumbsMap: Record<string, string[]> = {};

export default function TopNavBar() {
  const path = usePathname();
  return (
    <div className="">
      <Breadcrumb className="hidden md:flex py-3">
        <BreadcrumbList>
          {path
            .split("/")
            .slice(1)
            .map((breadcrumb, index, arr) => {
              if (index < arr.length - 1) {
                return (
                  <>
                    <BreadcrumbItem key={index}>
                      <BreadcrumbLink asChild>
                        <Link href="#">
                          {truncate(breadcrumb, { length: 10 })}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </>
                );
              } else {
                return (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbPage>
                      {truncate(breadcrumb, { length: 10 })}
                    </BreadcrumbPage>
                  </BreadcrumbItem>
                );
              }
            })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
