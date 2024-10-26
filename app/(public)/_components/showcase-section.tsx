import { Button } from "@/components/ui/button";
import Container from "@/components/container";
import Link from "next/link";
import ShowcaseCard from "./showcase-card";
import { getShowcases } from "@/loaders/showcase";
import routes from "@/config/routes";

export default async function ShowcaseSection() {
  const showcases = await getShowcases({
    published: true,
    pageSize: 6,
    page: 1,
    orderBy: "createdAt",
    orderDir: "asc",
  });
  return (
    <section className="">
      <Container max="lg" className="py-16 md:py-28">
        <h2 className="text-2xl md:text-3xl font-bold text-center">
          Portfolio Highlights
        </h2>
        <h3 className="text-sm md:text-base text-muted-foreground text-center">
          Explore the stunning work that defines our legacy.
        </h3>
        <div className="grid md:grid-cols-3 gap-6 mt-8 md:mt-16">
          {showcases.data.map((showcase, index) => (
            <ShowcaseCard showcase={showcase} key={index} />
          ))}
        </div>
        <div className="mt-8 flex">
          <Link className="mx-auto" href={routes.showcases.main(1)}>
            <Button className="" variant={"outline"}>
              Explore More
            </Button>
          </Link>
        </div>
      </Container>
    </section>
  );
}
