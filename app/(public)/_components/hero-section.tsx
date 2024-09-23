import ImageSlider from "./image-slider";
import webConfig from "@/config/web";
import routes from "@/config/routes";
import { getWebAssets } from "@/loaders/web-asset";

export default async function HeroSection() {
  const { data } = await getWebAssets({
    published: true,
    page: 1,
    pageSize: 20,
    tag: "hero",
  });
  const images = data.map((image) => ({
    ...image,
    src: routes.getFiles(image.id),
  }));

  const portriats = images.filter(
    (image) => (image.width ?? 0) < (image.height ?? 0)
  );
  const landscapes = images.filter(
    (image) => (image.width ?? 0) > (image.height ?? 0)
  );
  return (
    <section className="relative h-[calc(100vh-theme(spacing.16))]">
      <div className="absolute px-4 flex flex-col justify-center items-center md:px-0 w-full h-full inset-0 z-20 bg-background/30">
        <h1 className="text-8xl font-bold text-center">
          {webConfig.companyName}
        </h1>
        <h2 className="hidden md:block pt-2 text max-w-lg w-full mx-auto text-center text-foreground/80 font-medium">
          {webConfig.heroSubTitle}
        </h2>
      </div>
      <div className="w-ful h-full block md:hidden">
        <ImageSlider images={portriats.length > 0 ? portriats : images} />
      </div>
      <div className="w-ful h-full hidden md:block">
        <ImageSlider images={landscapes.length > 0 ? landscapes : images} />
      </div>
    </section>
  );
}
