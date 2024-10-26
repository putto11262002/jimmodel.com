import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AutoForm, { AutoFormPendingIcon } from "@/components/shared/auto-form";
import routes from "@/config/routes";
import { GetShowcasesFilter } from "@/lib/usecases";

export default function GetShowcasesFilterForm({
  initialFilter,
}: {
  initialFilter: GetShowcasesFilter;
}) {
  return (
    <AutoForm action={""} className="lg:flex lg:items-end grid gap-2">
      <SelectFormItem
        className="min-w-28"
        size="sm"
        name="published"
        label="Published"
        options={[
          { label: "All", value: "all" },
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ]}
        defaultValue={
          initialFilter.published === true
            ? "true"
            : initialFilter.published === false
            ? "false"
            : "all"
        }
      />
      <AutoFormPendingIcon size="sm" variant="outline" />
    </AutoForm>
  );
}
