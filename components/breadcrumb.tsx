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
import { createContext, useContext, useEffect, useState } from "react";

export type BreakcrumbContext = {
  breadcrumbs: { label: string; href?: string }[] | null;
  setBreadcrumbs: (breadcrumbs: { label: string; href?: string }[]) => void;
  clearBreadcrumbs: () => void;
};

export const BreadcrumbContext = createContext<BreakcrumbContext>({
  breadcrumbs: null,
  setBreadcrumbs: () => {},
  clearBreadcrumbs: () => {},
});

export const useBreadcrumb = () => useContext(BreadcrumbContext);

export function BreakcrumbSetter({
  breadcrumbs,
}: {
  breadcrumbs: { label: string; href?: string }[];
}) {
  const { clearBreadcrumbs, setBreadcrumbs } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    return () => clearBreadcrumbs();
  }, []);
  return null;
}

export function useBreadcrumbSetter(
  breadcrumbs: { label: string; href?: string }[],
) {
  const { clearBreadcrumbs, setBreadcrumbs } = useBreadcrumb();
  useEffect(() => {
    setBreadcrumbs(breadcrumbs);
    return () => clearBreadcrumbs();
  }, []);
  return null;
}

export function BreadcrumbProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [breadcrumbs, setBreadcrumbs] = useState<
    { label: string; href?: string }[] | null
  >(null);

  function clearBreadcrumbs() {
    setBreadcrumbs(null);
  }

  return (
    <BreadcrumbContext.Provider
      value={{ clearBreadcrumbs, breadcrumbs, setBreadcrumbs }}
    >
      {children}
    </BreadcrumbContext.Provider>
  );
}

export function BreadcrumbDisplay() {
  const { breadcrumbs } = useBreadcrumb();
  return (
    <div className="">
      <Breadcrumb className="hidden md:flex py-3">
        <BreadcrumbList>
          <BreadcrumbSeparator />
          {breadcrumbs &&
            breadcrumbs.map((breadcrumb, index, arr) => {
              if (index < arr.length - 1) {
                return (
                  <div className="flex items-center" key={index}>
                    <BreadcrumbItem>
                      <BreadcrumbLink asChild>
                        <Link href={breadcrumb.href ? breadcrumb.href : "#"}>
                          {truncate(breadcrumb.label, { length: 20 })}
                        </Link>
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator />
                  </div>
                );
              } else {
                return (
                  <BreadcrumbItem key={index}>
                    <BreadcrumbPage>{breadcrumb.label}</BreadcrumbPage>
                  </BreadcrumbItem>
                );
              }
            })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
