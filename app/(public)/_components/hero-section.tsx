import { Button } from "@/components/ui/button";
import Link from "next/link";
import { webAssetUseCase } from "@/lib/usecases";
import ImageSlider from "./image-slider";
import webConfig from "@/config/web";

export default async function HeroSection() {
  const images = await webAssetUseCase.getWebAssets({
    published: true,
    page: 1,
    pageSize: 10,
  });
  return (
    <section className="relative h-[calc(100vh-theme(spacing.20))] ">
      <div className="absolute px-4 md:px-0 w-full h-full inset-0 z-20 bg-gradient-to-b from-background to-background/0">
        <h1 className="text-4xl font-bold text-center mt-20">
          {webConfig.heroTitle}
        </h1>
        <h2 className="pt-2 text-sm max-w-lg w-full mx-auto text-center text-muted-foreground">
          {webConfig.heroSubTitle}
        </h2>
        {/* <div className="w-full flex pt-6 justify-center"> */}
        {/*   <Link href={"/application"}> */}
        {/*     <Button>Apply Now</Button> */}
        {/*   </Link> */}
        {/* </div> */}
      </div>
      <div className="w-ful h-full">
        <ImageSlider images={images.data} />
      </div>
    </section>
  );
}
