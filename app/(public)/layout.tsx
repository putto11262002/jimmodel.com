import { Button } from "@/components/ui/button";
import Link from "next/link";
import Footer from "./_components/footer";
import TopNavMenu from "./_components/top-nav-menu";
import { navItems } from "./primary-nav-menu";
import SideNavMenu from "./_components/side-nav-menu";
import Container from "@/components/container";
import webConfig from "@/config/web";
import { Metadata } from "next";
import { config } from "@/config";
import { GoogleTagManager } from "@next/third-parties/google";
import routes from "@/config/routes";

export const metadata: Metadata = {
  metadataBase: new URL(config.url),
  title: webConfig.defaultSEO.title,
  description: webConfig.defaultSEO.description,
  applicationName: webConfig.defaultSEO.applicationName,
  keywords: webConfig.defaultSEO.keywords,
  openGraph: webConfig.defaultSEO.openGraph,
};
export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      {process.env.NEXT_PUBLIC_GTM_ID && (
        <GoogleTagManager gtmId={process.env.NEXT_PUBLIC_GTM_ID} />
      )}
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 h-16 gap-8 z-50 bg-background">
          <Container className="flex items-center justify-between py-0 h-full">
            <Link href="/" className="grid text-2xl font-semibold md:text-base">
              <h1 className="text-2xl font-bold">{webConfig.companyName}</h1>
            </Link>
            <div className="hidden md:flex">
              <TopNavMenu items={navItems} />
            </div>
            <div className="flex md:hidden">
              <SideNavMenu items={navItems} />
            </div>
            <div className="hidden md:flex items-center justify-end gap-4 md:gap-2 lg:gap-4">
              <Link href={routes.application.new}>
                <Button className="rounded-md" size={"sm"}>
                  Join Us
                </Button>
              </Link>
            </div>
          </Container>
        </header>
        <main className="min-h-[calc(100vh-theme(spacing.16))] h-full">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
