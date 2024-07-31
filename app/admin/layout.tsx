import React from "react";
import Sidebar from "./_components/sidebar";
import { Toaster } from "@/components/ui/toaster";
import TopBar from "./_components/topbar";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Toaster />
      <Sidebar />
      <div className="sm:pl-14">
        <TopBar />
        <main className="">{children}</main>
      </div>
    </div>
  );
}
