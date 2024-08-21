"use client";
import { TooltipProvider } from "../components/ui/tooltip";
import { SessionProvider } from "next-auth/react";
import { BreadcrumbProvider } from "@/components/breadcrumb";
import QueryClientProvider from "./query-client-provider";
import { JobPreviewSheetProvider } from "@/components/job/job-preview-sheet";

const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <SessionProvider>
        <BreadcrumbProvider>
          <TooltipProvider>
            <QueryClientProvider>
              <JobPreviewSheetProvider>{children}</JobPreviewSheetProvider>
            </QueryClientProvider>
          </TooltipProvider>
        </BreadcrumbProvider>
      </SessionProvider>
    </>
  );
};

export default Providers;
