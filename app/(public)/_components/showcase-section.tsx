import { Button } from "@/components/ui/button";
import Container from "@/components/container";
import Link from "next/link";
import { showcaseUseCase } from "@/lib/usecases";
import ShowcaseCard from "./showcase-card";

export default async function HeroSection() {
  const showcases = await showcaseUseCase.getShowcases({
    published: true,
    pageSize: 6,
    page: 1,
  });
  return (
    <section className="">
      <Container max="xl" className="py-28">
        <h2 className="text-3xl font-bold text-center">Portfolio Highlights</h2>
        <h3 className="text-muted-foreground text-center">
          Explore the stunning work that defines our legacy.
        </h3>
        <div className="grid md:grid-cols-3 gap-6 mt-16">
          {showcases.data.map((showcase, index) => (
            <ShowcaseCard showcase={showcase} key={index} />
          ))}
        </div>
        <div className="mt-8 flex">
          <Link className="mx-auto" href={"/showcases"}>
            <Button className="" variant={"outline"}>
              Explore More
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
