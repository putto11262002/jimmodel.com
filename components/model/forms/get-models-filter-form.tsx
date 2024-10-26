"use client";
import InputFormItem from "@/components/form/server-action/input-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AutoForm, {
  AutoFormPendingIcon,
  useAutoForm,
} from "@/components/shared/auto-form";
import { Button } from "@/components/ui/button";
import routes from "@/config/routes";
import { BOOKING_STATUS_LABEL_VALUE_PAIRS } from "@/db/constants";
import { orderDirs } from "@/lib/usecases/constants";
import {
  GetModelsFilter,
  modelOrderFields,
} from "@/lib/usecases/model/inputs/get-models-filter";
import { camelCaseToText } from "@/lib/utils/text";
import { Calendar, Loader2 } from "lucide-react";

export default function GetModelsFilterForm({
  initialFilter,
}: {
  initialFilter: GetModelsFilter;
}) {
  return (
    <AutoForm
      className="grid lg:flex flex-row items-end gap-4 lg:gap-2"
      action={""}
    >
      <input type="hidden" name="page" value="1" />
      <InputFormItem
        size="sm"
        name="q"
        label="Search"
        defaultValue={initialFilter.q}
      />
      <SelectFormItem
        className="min-w-28"
        size="sm"
        name="published"
        label="Published"
        options={[
          { label: "All", value: "*" },
          { label: "Yes", value: "true" },
          { label: "No", value: "false" },
        ]}
        defaultValue={
          typeof initialFilter.published === "boolean"
            ? String(initialFilter.published)
            : "*"
        }
      />

      <SelectFormItem
        label="Booking Status"
        size="sm"
        className="min-w-28"
        name="bookingStatus"
        options={[
          ...BOOKING_STATUS_LABEL_VALUE_PAIRS,
          { label: "All", value: "*" },
        ]}
        defaultValue={initialFilter.bookingStatus || "*"}
      />

      <SelectFormItem
        className="min-w-28"
        size="sm"
        name="orderBy"
        label="Order By"
        options={modelOrderFields.map((orderField) => ({
          value: orderField,
          label: camelCaseToText(orderField),
        }))}
        defaultValue={initialFilter.orderBy || "createdAt"}
      />

      <SelectFormItem
        className="min-w-24"
        size="sm"
        name="orderDir"
        label="Order Dir"
        options={orderDirs.map((orderDir) => ({
          value: orderDir,
          label: camelCaseToText(orderDir),
        }))}
        defaultValue={initialFilter.orderDir || "desc"}
      />
      <AutoFormPendingIcon size="sm" variant="outline" />
    </AutoForm>
  );
}
