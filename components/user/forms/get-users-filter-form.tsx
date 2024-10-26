"use client";
import InputFormItem from "@/components/form/server-action/input-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AutoForm, { AutoFormPendingIcon } from "@/components/shared/auto-form";
import { USER_ROLE_LABEL_VALUE_PAIRS } from "@/db/constants";
import { GetUsersFilter } from "@/lib/usecases/user/inputs";

export default function GetUsereFilterForm({
  initialFilter,
}: {
  initialFilter: GetUsersFilter;
}) {
  return (
    <AutoForm
      className="grid lg:flex flex-row items-end gap-4 lg:gap-2"
      action={""}
    >
      <input name="page" value="1" hidden />
      <InputFormItem
        size="sm"
        name="q"
        label="Search"
        defaultValue={initialFilter.q}
      />
      <SelectFormItem
        size="sm"
        className="min-w-24"
        name="roles"
        label="Roles"
        options={[{ label: "All", value: "*" }, ...USER_ROLE_LABEL_VALUE_PAIRS]}
        defaultValue={initialFilter.roles?.[0] || "*"}
      />
      <AutoFormPendingIcon size="sm" variant="outline" />
    </AutoForm>
  );
}
