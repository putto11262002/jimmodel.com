"use client";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AutoForm, { AutoFormPendingIcon } from "@/components/shared/auto-form";
import { Button } from "@/components/ui/button";
import { arrayToSelectOptions } from "@/components/utils/array-to-select-options";
import routes from "@/config/routes";
import { APPLICATION_STATUS_LABEL_VALUE_PAIRS } from "@/db/constants";
import {
  applicationsOrderFields,
  DEFAULT_GET_APPLICATION_FILTER,
  GetApplicationsFilter,
} from "@/lib/usecases/application/inputs";
import { orderDirs } from "@/lib/usecases/constants";
import { camelCaseToText } from "@/lib/utils/text";
import Form from "next/form";

export default function GetApplicationsFilterForm({
  initialFilter,
}: {
  initialFilter: GetApplicationsFilter;
}) {
  return (
    <AutoForm action={""} className="lg:flex lg:items-end grid gap-2">
      <SelectFormItem
        size="sm"
        className="min-w-28"
        name="orderBy"
        label="Order By"
        options={applicationsOrderFields.map((field) => ({
          label: camelCaseToText(field),
          value: field,
        }))}
        defaultValue={
          initialFilter.orderBy ?? DEFAULT_GET_APPLICATION_FILTER.orderBy
        }
      />
      <SelectFormItem
        size="sm"
        className="min-w-28"
        name="orderDir"
        label="Order Direction"
        options={arrayToSelectOptions(orderDirs)}
        defaultValue={
          initialFilter.orderDir ?? DEFAULT_GET_APPLICATION_FILTER.orderDir
        }
      />
      <input name="to" value={routes.admin.applications.main} hidden />
      <AutoFormPendingIcon size="sm" variant="outline" />
    </AutoForm>
  );
}
