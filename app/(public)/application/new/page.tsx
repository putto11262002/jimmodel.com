import Container from "@/components/container";
import { getApplicationToken } from "@/actions/application/utils";
import { redirect } from "next/navigation";
import { getWebAssets } from "@/loaders/web-asset";
import routes from "@/config/routes";
import Image from "next/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import ApplicationCreateForm from "@/components/application/forms/application-create-form";

export default async function Page() {
  const token = await getApplicationToken();
  const images = await getWebAssets({
    tag: "hero",
    pageSize: 12,
    page: 1,
    published: true,
  }).then(({ data }) =>
    data.map((image) => ({
      width: image.width,
      height: image.height,
      src: routes.files.get(image.id),
      alt: image.alt,
    }))
  );
  if (token) {
    redirect("/application");
  }
  return (
    <Container max="sm" className="h-full">
      <div className="w-full items-center justify-center h-full">
        <ApplicationCreateForm />
      </div>
    </Container>
  );
}
