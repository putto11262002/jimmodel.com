import routes from "@/config/routes";
import { BOOKING_STATUS, MODEL_CATEGORY } from "@/db/constants";

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
      { href: routes.models.main(MODEL_CATEGORY.MALE), title: "All" },
      {
        href: routes.models.main(MODEL_CATEGORY.MALE, BOOKING_STATUS.IN_TOWN),
        title: "In Town",
      },
      {
        href: routes.models.main(
          MODEL_CATEGORY.MALE,
          BOOKING_STATUS.DIRECT_BOOKING
        ),
        title: "Direct Booking",
      },
      {
        href: routes.models.main(MODEL_CATEGORY.MALE, BOOKING_STATUS.LOCAL),
        title: "Local",
      },
    ],
  },
  {
    href: "/models/female",
    title: "Women",
    children: [
      {
        href: routes.models.main(MODEL_CATEGORY.FEMALE),
        title: "All",
      },
      {
        href: routes.models.main(MODEL_CATEGORY.FEMALE, BOOKING_STATUS.IN_TOWN),
        title: "In Town",
      },
      {
        href: routes.models.main(
          MODEL_CATEGORY.FEMALE,
          BOOKING_STATUS.DIRECT_BOOKING
        ),
        title: "Direct Booking",
      },
      {
        href: routes.models.main(MODEL_CATEGORY.FEMALE, BOOKING_STATUS.LOCAL),
        title: "Local",
      },
    ],
  },
  {
    title: "Others",
    href: "#",
    children: [
      {
        href: routes.models.main(MODEL_CATEGORY.KIDS),
        title: "Kids",
      },
      {
        href: routes.models.main(MODEL_CATEGORY.SENIORS),
        title: "Seniors",
      },
      {
        href: routes.models.main(MODEL_CATEGORY.NON_BINARY),
        title: "Diversity",
      },
    ],
  },
  { href: "/showcases", title: "Works" },
  { href: "/about-us", title: "About Us" },
  { href: "/contact", title: "Contact Us" },
];
