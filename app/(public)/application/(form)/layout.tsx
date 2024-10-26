import Container from "@/components/container";
import SidebarLayout from "@/components/layouts/sidebar-layout";
import { getApplicationMenu } from "./config";
import { Card } from "@/components/card";
import TitleContentLayout from "@/components/layouts/title-content-layout";

export const metadata = {
  title: "Apply Now",
};

export default function Layout({ children }: { children: React.ReactNode }) {
  const menuItems = getApplicationMenu();
  return (
    <Container max="lg" className="grid gap-4">
      <TitleContentLayout
        title={
          <h1 className="text-2xl font-semibold text-center">
            Model Application
          </h1>
        }
      >
        <Card>
          <SidebarLayout items={menuItems}>
            <div className="md:pl-6 md:border-l md:h-full md:border-t-0 md:pt-0 border-t pt-6">
              {children}
            </div>
          </SidebarLayout>
        </Card>
      </TitleContentLayout>
    </Container>
  );
}
