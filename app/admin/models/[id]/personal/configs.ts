import routes from "@/config/routes";

export const formMenuConfig = [
  {
    label: "general",
    form: "general",
  },
  {
    label: "contact",
    form: "contact",
  },
  {
    label: "background",
    form: "background",
  },
  {
    label: "identification",
    form: "identification",
  },
  {
    label: "address",
    form: "address",
  },
  {
    label: "modeling",
    form: "modeling",
  },
  {
    label: "measurement",
    form: "measurement",
  },
  {
    label: "experiences",
    form: "experiences",
  },
  {
    label: "profile image",
    form: "profile-image",
  },
  {
    label: "images",
    form: "images",
  },
  {
    label: "settings",
    form: "settings",
  },
];

export const getModelFormConfig = ({ id }: { id: string }) =>
  formMenuConfig.map((item) => ({
    label: item.label,
    href: `${routes.admin.models.edit.main(id)}/${item.form}`,
  }));
