import Image from "next/image";
import { Button } from "@/components/ui/button";
import Container from "@/components/container";

export default function Page() {
  return (
    <Container className="mx-auto h-[calc(100vh-theme(spacing.16))] box-content">
      <h1 className="mt-20 text-4xl font-bold text-center">
        Unleash Your Full Potential With Us
      </h1>
      <h2 className="pt-2 text-sm max-w-lg w-full mx-auto text-center text-muted-foreground">
        Connecting You to Opportunities and Elevating Your Talent to New Heights
        with Thailand’s Leading Agency, Backed by Over 40 Years of Experience
      </h2>
      <div className="w-full flex pt-6 justify-center">
        <Button className="" size={"sm"}>
          Apply Now
        </Button>
      </div>
      <div className="w-full min-h-[200px] relative mt-12 md:mt-20 opacity-70">
        <Image
          src={"/colored-hero-image.jpeg"}
          alt={"Hero"}
          fill
          className="object-contain"
        />
      </div>
    </Container>
  );
}
