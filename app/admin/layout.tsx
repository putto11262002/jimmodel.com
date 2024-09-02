import React, { Suspense } from "react";
import Sidebar from "./_components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import TopBar from "./_components/topbar";
import Providers from "../providers";
import { Metadata } from "next";
import webConfig from "@/config/web";

export const metadata: Metadata = {
  title: webConfig.fullCompanyName,
};

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <Providers>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Toaster />
        <Sidebar />
        <div className="sm:pl-14">
          <TopBar />
          <main className="min-h-[calc(100vh-theme(spacing.14))]">
            <Suspense>{children}</Suspense>
          </main>
        </div>
      </div>
    </Providers>
  );
}
