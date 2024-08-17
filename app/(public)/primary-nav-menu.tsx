import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMars,
  faVenus,
  faTransgender,
} from "@fortawesome/free-solid-svg-icons";

export type NavItem = {
  href: string;
  title: string;
  icon?: (className: string) => React.ReactNode;
  children?: Omit<NavItem, "children">[];
};

export const navItems: NavItem[] = [
  {
    href: "/models",
    title: "Models",
    children: [
      {
        href: "models/male",
        title: "Male",
        icon: (className: string) => (
          <FontAwesomeIcon className={className} icon={faMars} />
        ),
      },
      {
        href: "/models/female",
        title: "Female",
        icon: (className: string) => (
          <FontAwesomeIcon className={className} icon={faVenus} />
        ),
      },
      {
        href: "/models/lgbtq",
        title: "LGBTQ",
        icon: (className: string) => (
          <FontAwesomeIcon className={className} icon={faTransgender} />
        ),
      },
    ],
  },
  { href: "/portfolio", title: "Portfolio" },
  { href: "/about", title: "About Us" },
  { href: "/contact", title: "Contact Us" },
];
