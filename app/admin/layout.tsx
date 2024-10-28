import React from "react";
import Sidebar from "./_components/sidebar";
import TopBar from "./_components/topbar";
import Providers from "./providers";
import { Metadata } from "next";
import webConfig from "@/config/web";
import { auth } from "@/config";
import { navMenuItems } from "./nav-menu";
import { checkPermission } from "@/lib/auth";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: webConfig.fullCompanyName,
};

export default async function Layout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const visibleNavItems = navMenuItems.filter(
    (item) => checkPermission(session.user, item.permissions) === "success"
  );
  return (
    <body className={inter.className}>
      <Providers>
        <div className="flex min-h-screen w-full flex-col bg-background">
          <Sidebar user={session.user} navItems={visibleNavItems} />
          <div className="sm:pl-14">
            <TopBar user={session.user} navItems={visibleNavItems} />
            <main className="h-[calc(100vh-theme(spacing.14))]  md:min-h-screen">
              {children}
            </main>
          </div>
        </div>
      </Providers>
    </body>
  );
}
