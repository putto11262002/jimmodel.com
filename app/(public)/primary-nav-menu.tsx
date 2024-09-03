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
  children?: Omit<NavItem, "children">[];
};

export const navItems: NavItem[] = [
  {
    href: "/models/male",
    title: "Men",
    children: [
      { href: "/models/male", title: "All" },
      { href: "/models/male/in-town", title: "In Town" },
      { href: "/models/male/direct-booking", title: "Direct Booking" },
      { href: "/models/male/local", title: "Local" },
    ],
  },
  {
    href: "/models/female",
    title: "Women",
    children: [
      { href: "/models/female", title: "All" },
      { href: "/models/female/in-town", title: "In Town" },
      { href: "/models/female/direct-booking", title: "Direct Booking" },
      { href: "/models/female/local", title: "Local" },
    ],
  },
  {
    title: "Others",
    href: "#",
    children: [
      {
        href: "/models/kids",
        title: "Kids",
      },
      {
        href: "/models/seniors",
        title: "Seniors",
      },
      {
        href: "/models/non-binary",
        title: "Diversity",
      },
    ],
  },
  { href: "/showcases", title: "Works" },
  { href: "/about-us", title: "About Us" },
  { href: "/contact", title: "Contact Us" },
];
