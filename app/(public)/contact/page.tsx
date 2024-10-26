import Container from "@/components/container";
import { Card } from "@/components/card";
import ContactMessageCreateForm from "@/components/contact-message/forms/contact-form-create";
import TitleContentLayout from "@/components/layouts/title-content-layout";

export default function Page() {
  return (
    <Container max="sm" className="">
      <TitleContentLayout
        title={
          <h1 className="text-2xl font-semibold text-center">Contact Us</h1>
        }
        subtitle={
          <h2 className="text-muted-foreground text-sm text-center">
            Please feel free to contact us for any castings, bookings or any
            other inquiry.
          </h2>
        }
      >
        <Card>
          <ContactMessageCreateForm />
        </Card>
      </TitleContentLayout>
    </Container>
  );
}
