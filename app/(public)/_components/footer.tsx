import Container from "@/components/container";
import { Button } from "@/components/ui/button";
import webConfig from "@/config/web";
import { Facebook, Instagram, LucideIcon, Mail, Phone } from "lucide-react";
import Link from "next/link";
const socialMedia: { href: string; icon: LucideIcon }[] = [
  {
    href: `mailto:${webConfig.email}`,
    icon: Mail,
  },
  {
    href: `tel:${webConfig.phone}`,
    icon: Phone,
  },
  {
    href: webConfig.facebook,
    icon: Facebook,
  },
  {
    href: webConfig.instagram,
    icon: Instagram,
  },
];
export default function Footer() {
  return (
    <Container className="max-w-screen-lg w-full mx-auto px-4 pt-12 pb-16">
      <footer className="">
        <div className="flex justify-center gap-8">
          {socialMedia.map((social, index) => (
            <Link key={index} href={social.href}>
              <Button variant={"ghost"} className="rounded-full " size={"icon"}>
                <span className="sr-only">{social.href}</span>
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
          {webConfig.address}
        </h3>
        <p className="text-xs text-center text-muted-foreground mt-12">
          Copyright © 2024 J.I.M. Modeling Agency.
        </p>
      </footer>
    </Container>
  );
}
