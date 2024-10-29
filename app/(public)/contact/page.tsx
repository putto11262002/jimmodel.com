import Container from "@/components/container";
import { Card } from "@/components/card";
import ContactMessageCreateForm from "@/components/contact-message/forms/contact-form-create";
import TitleContentLayout from "@/components/layouts/title-content-layout";
import webConfig from "@/config/web";

export default function Page() {
  return (
    <Container max="liquid" className="">
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
        <div className="grid gap-20">
          <div className="mx-auto max-w-screen-sm w-full ">
            <Card>
              <ContactMessageCreateForm />
            </Card>
          </div>
          {webConfig.googleMapsIframeSrc && (
            <iframe
              src={webConfig.googleMapsIframeSrc}
              height="450"
              style={{ border: 0, width: "100%" }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            ></iframe>
          )}
        </div>
      </TitleContentLayout>
    </Container>
  );
}
