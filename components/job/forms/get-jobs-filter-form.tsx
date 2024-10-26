"use client";
import RichSelect from "@/components/form/base/rich-select";
import InputFormItem from "@/components/form/server-action/input-form-item";
import RichSelectFormItem from "@/components/form/server-action/rich-select-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AutoForm, { AutoFormPendingIcon } from "@/components/shared/auto-form";
import { arrayToSelectOptions } from "@/components/utils/array-to-select-options";
import routes from "@/config/routes";
import { JOB_STATUS_LABLE_VALUE_PAIRS } from "@/db/constants";
import { Model, User } from "@/lib/domains";
import { orderDirs } from "@/lib/usecases/constants";
import { jobOrderFields, type GetJobsFilter } from "@/lib/usecases/job/inputs";

const searchUsers = async ({
  q,
  values,
}: {
  q?: string;
  values?: string[];
}) => {
  const searchParams = new URLSearchParams();
  searchParams.append("page", "1");
  searchParams.append("pageSize", "10");
  if (q) {
    searchParams.set("q", q);
  }
  if (values) {
    values.forEach((v) => searchParams.append("userIds", v));
  }
  const res = await fetch(`${routes.api.users.get}?${searchParams.toString()}`);
  if (!res.ok) {
    throw new Error("Failed to fetch users");
  }
  const { data } = await res.json();
  return data.map((model: User) => ({
    label: model.name,
    value: model.id,
  }));
};

export default function GetJobsFilterForm({
  initialFilter,
  select,
}: {
  initialFilter: GetJobsFilter;
  select?: { [key in keyof GetJobsFilter]?: boolean };
}) {
  return (
    <AutoForm action={""} className="lg:flex lg:items-end grid gap-2">
    <input type="hidden" name="page" value="1" />

      {(!select || select.q) && (
        <InputFormItem
          size="sm"
          name="q"
          label="Search"
          defaultValue={initialFilter.q}
        />
      )}
      {(!select || select.status) && (
        <SelectFormItem
          className="min-w-28"
          label="Status"
          size="sm"
          name="status"
          options={[
            { label: "All", value: "*" },
            ...JOB_STATUS_LABLE_VALUE_PAIRS,
          ]}
          defaultValue={initialFilter.status ?? "*"}
        />
      )}

      {(!select || select.orderBy) && (
        <SelectFormItem
          className="min-w-28"
          label="Order by"
          size="sm"
          name="orderBy"
          options={arrayToSelectOptions(jobOrderFields)}
          defaultValue={initialFilter.orderBy || "createdAt"}
        />
      )}

      {(!select || select.orderDir) && (
        <SelectFormItem
          className="min-w-28"
          label="Order direction"
          size="sm"
          name="orderDir"
          options={arrayToSelectOptions(orderDirs)}
          defaultValue={initialFilter.orderDir || "desc"}
        />
      )}

      {(!select || select.ownerIds) && (
        <RichSelectFormItem
          defaultValue={initialFilter?.ownerIds?.[0]}
          name="ownerIds"
          label="Owner"
          size="sm"
          data={searchUsers}
          mode="single"
        />
      )}
      <AutoFormPendingIcon size="sm" variant="outline" />
    </AutoForm>
  );
}
