import HeroSection from "./_components/hero-section";
import ShowcaseSection from "./_components/showcase-section";

export const dynamic = "force-dynamic";
export const revalidate = 60;

export default async function Page() {
  return (
    <>
      <HeroSection />
      <ShowcaseSection />
    </>
  );
}
