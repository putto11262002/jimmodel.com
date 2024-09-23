import { upperFirst } from "lodash";

const formMenuConfig: { form: string; label?: string }[] = [
  { form: "", label: "General" },
  { form: "client" },
  { form: "production" },
  { form: "contract" },
];

export const getJobFormConfig = ({ id }: { id: string }) =>
  formMenuConfig.map((item) => ({
    label: item.label || upperFirst(item.form),
    href: `/admin/jobs/${id}/update/${item.form}`,
  }));
