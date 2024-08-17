import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { NavItem } from "../primary-nav-menu";

export default function TopNavMenu({ items }: { items: NavItem[] }) {
  return (
    <>
      <NavigationMenu>
        <NavigationMenuList>
          {items.map((item, index) => {
            if (item.children) {
              return (
                <NavigationMenuItem className="" key={index}>
                  <NavigationMenuTrigger className="text-muted-foreground font-normal">
                    Models
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="border-0 shadow-none">
                    <ul className="grid p-2 min-w-[200px]">
                      {" "}
                      {item.children.map((child, index) => (
                        <li key={index}>
                          <NavigationMenuLink
                            className="w-full hover:bg-muted py-2 px-3 rounded-md"
                            asChild
                          >
                            <Link
                              className="text-sm text-muted-foreground flex items-center gap-2 hover:text-foreground"
                              href={child.href}
                            >
                              {child.icon && child.icon("w-4 h-4")}
                              {child.title}
                            </Link>
                          </NavigationMenuLink>
                        </li>
                      ))}
                    </ul>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              );
            }
            return (
              <NavigationMenuItem key={index}>
                <Link href={item.href} legacyBehavior passHref>
                  <NavigationMenuLink
                    className={cn(
                      navigationMenuTriggerStyle(),
                      "text-muted-foreground font-normal",
                    )}
                  >
                    {item.title}
                  </NavigationMenuLink>
                </Link>
              </NavigationMenuItem>
            );
          })}
          <NavigationMenuItem></NavigationMenuItem>
        </NavigationMenuList>
      </NavigationMenu>
    </>
  );
}
