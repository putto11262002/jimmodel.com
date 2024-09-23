import { LinkMenuItem } from "@/components/shared/types/menu";
import { upperFirst } from "lodash";

const applicationFormMenu: { form: string; label?: string }[] = [
  { form: "general" },
  { form: "contact" },
  { form: "measurement" },
  { form: "talent", label: "Talents" },
  { form: "experience", label: "Experiences" },
  { form: "image", label: "Images" },
  { form: "submit" },
];

export const getApplicationMenu = (): LinkMenuItem[] =>
  applicationFormMenu.map(({ form, label }) => ({
    label: label ? label : upperFirst(form),
    href: `/application/${form}`,
  }));
