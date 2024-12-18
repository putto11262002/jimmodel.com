import HeroSection from "./_components/hero-section";
import ShowcaseSection from "./_components/showcase-section";

export const revalidate = 604800;
export const dynamic = "force-static";

export default async function Page() {
  return (
    <>
      <HeroSection />
      <ShowcaseSection />
    </>
  );
}
