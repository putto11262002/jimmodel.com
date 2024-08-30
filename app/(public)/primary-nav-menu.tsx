import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMars,
  faVenus,
  faTransgender,
  faBaby,
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
        href: "/models/male",
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
        href: "/models/non-binary",
        title: "LGBTQ",
        icon: (className: string) => (
          <FontAwesomeIcon className={className} icon={faTransgender} />
        ),
      },
      {
        href: "/models/kids",
        title: "Kids",
        icon: (className: string) => (
          <FontAwesomeIcon className={className} icon={faBaby} />
        ),
      },
    ],
  },
  { href: "/showcases", title: "Showcases" },
  { href: "/about-us", title: "About Us" },
  { href: "/contact", title: "Contact Us" },
];
