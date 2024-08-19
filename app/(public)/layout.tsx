import { Button } from "@/components/ui/button";
import Link from "next/link";
import Footer from "./_components/footer";
import TopNavMenu from "./_components/top-nav-menu";
import { navItems } from "./primary-nav-menu";
import SideNavMenu from "./_components/side-nav-menu";
import Container from "@/components/container";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <div className="flex min-h-screen w-full flex-col">
        <header className="sticky top-0 h-16 gap-8 z-50 bg-background px-4">
          <Container className="flex items-center justify-between">
            <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold md:text-base"
            >
              <h1 className="text-xl font-bold">J.I.M</h1>
            </Link>
            <div className="hidden md:flex">
              <TopNavMenu items={navItems} />
            </div>
            <div className="flex md:hidden">
              <SideNavMenu items={navItems} />
            </div>
            <div className="hidden md:flex items-center justify-end gap-4 md:gap-2 lg:gap-4">
              <Link href={"/application"}>
                <Button className="rounded-md" size={"sm"}>
                  Apply Now
                </Button>
              </Link>
            </div>
          </Container>
        </header>
        <main className="">{children}</main>
        <Footer />
      </div>
    </>
  );
}
