import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AutoForm, { AutoFormPendingIcon } from "@/components/shared/auto-form";
import { arrayToSelectOptions } from "@/components/utils/array-to-select-options";
import { WEB_ASSET_TAG_LABEL_VALUE_PAIRS } from "@/db/constants";
import { GetWebAssetsFilter } from "@/lib/usecases/web-asset/inputs/get-web-assets-filter";

export default function GetWebAssetsFilterForm({
  initialFilter,
}: {
  initialFilter: GetWebAssetsFilter;
}) {
  return (
    <AutoForm action={""} className="lg:flex lg:items-end grid gap-2">
      <SelectFormItem
        className="min-w-28"
        name="tag"
        label="Tag"
        size="sm"
        options={[
          ...WEB_ASSET_TAG_LABEL_VALUE_PAIRS,
          { label: "All", value: "all" },
        ]}
        defaultValue={initialFilter.tag ?? "all"}
      />

      <SelectFormItem
        className="min-w-20"
        name="published"
        label="Published"
        size="sm"
        options={arrayToSelectOptions(["all", "true", "false"])}
        defaultValue={
          typeof initialFilter.published === "boolean"
            ? String(initialFilter.published)
            : "all"
        }
      />
      <AutoFormPendingIcon size="sm" variant="outline" />
    </AutoForm>
  );
}
