import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Facebook, Instagram, LucideIcon, Mail, Phone } from "lucide-react";
import Link from "next/link";
const socialMedia: { href: string; icon: LucideIcon }[] = [
  {
    href: "#",
    icon: Mail,
  },
  {
    href: "#",
    icon: Phone,
  },
  {
    href: "#",
    icon: Facebook,
  },
  {
    href: "#",
    icon: Instagram,
  },
];
export default function Footer() {
  return (
    <Container className="max-w-screen-lg w-full mx-auto px-4 pt-12 pb-12">
      <footer className="">
        <div className="flex justify-center gap-8">
          {socialMedia.map((social, index) => (
            <Link key={index} href={social.href}>
              <Button variant={"ghost"} className="rounded-full " size={"icon"}>
                {<social.icon strokeWidth={2.2} className="h-5 w-5" />}
              </Button>
            </Link>
          ))}
        </div>
        {/* <Separator /> */}

        <h2 className="font-semibold text-center mt-12">
          J.I.M. Modeling Agency
        </h2>
        <h3 className="text-sm text-muted-foreground text-center">
          201/5 Town in town soi 2 , Phlabphla, Wang Thonglang, Bangkok
          Thailand, 10310
        </h3>
        <p className="text-xs text-center text-muted-foreground mt-12">
          Copyright © 2024 J.I.M. Modeling Agency.
        </p>
      </footer>
    </Container>
  );
}
