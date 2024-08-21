import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Package2 } from "lucide-react";
import Link from "next/link";
import { NavItem } from "../primary-nav-menu";

export default function SideNavMenu({ items }: { items: NavItem[] }) {
  return (
    <>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline" size="icon" className="shrink-0 md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Toggle navigation menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left">
          <Accordion collapsible type="single">
            <nav>
              <Link
                href="/"
                className="flex items-center gap-2 text-lg font-semibold"
              >
                <h1>J.I.M</h1>
              </Link>
              <ul className="grid gap-4 mt-4 ">
                {items.map((item, index) => {
                  if (item.children) {
                    return (
                      <li key={index}>
                        <AccordionItem
                          className="border-b-0"
                          value={`item-${index}`}
                        >
                          <AccordionTrigger className="text-base font-medium text-muted-foreground no-underline hover:no-underline p-0 m-0">
                            {item.title}
                          </AccordionTrigger>
                          <AccordionContent className="ml-3 py-3">
                            <ul className=" grid gap-3 ">
                              {item.children.map((child, index) => (
                                <li key={index}>
                                  <Link
                                    href={child.href}
                                    className="text-base font-medium text-muted-foreground hover:text-foreground"
                                  >
                                    {child.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                          </AccordionContent>
                        </AccordionItem>
                      </li>
                    );
                  }
                  return (
                    <li key={index}>
                      <Link
                        href={item.href}
                        className="font-medium text-muted-foreground hover:text-foreground"
                      >
                        {item.title}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
          </Accordion>
        </SheetContent>
      </Sheet>
    </>
  );
}
