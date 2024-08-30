import { webAssetUseCase } from "@/lib/usecases";
import ImageSlider from "./image-slider";
import webConfig from "@/config/web";

export default async function HeroSection() {
  const images = await webAssetUseCase.getWebAssets({
    published: true,
    page: 1,
    pageSize: 20,
  });
  return (
    <section className="relative h-[calc(100vh-theme(spacing.20))] ">
      <div className="absolute px-4 flex md:block md:px-0 w-full h-full inset-0 z-20 bg-gradient-to-b from-background/40 via-background/80 to-background/40 md:bg-gradient-to-b md:from-background md:to-background/0">
        <h1 className="hidden md:block text-2xl my-auto md:my-0 md:text-4xl font-bold text-center md:mt-20">
          {webConfig.heroTitle}
        </h1>
        <h1 className="block md:hidden w-full text-4xl my-auto font-bold text-center md:mt-20">
          J.I.M.
        </h1>
        <h2 className="hidden md:block pt-2 text-sm max-w-lg w-full mx-auto text-center text-muted-foreground">
          {webConfig.heroSubTitle}
        </h2>
        {/* <div className="w-full flex pt-6 justify-center"> */}
        {/*   <Link href={"/application"}> */}
        {/*     <Button>Apply Now</Button> */}
        {/*   </Link> */}
        {/* </div> */}
      </div>
      <div className="w-ful h-full block md:hidden">
        <ImageSlider
          images={images.data.filter(
            (asset) => (asset.height ?? 0) > (asset.width ?? 0),
          )}
        />
      </div>
      <div className="w-ful h-full hidden md:block">
        <ImageSlider
          images={images.data.filter(
            (asset) => (asset.height ?? 0) < (asset.width ?? 0),
          )}
        />
      </div>
    </section>
  );
}
