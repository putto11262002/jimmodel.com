import DateRangePicker from "@/components/form/server-action/date-range-picker";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AutoForm, { AutoFormPendingIcon } from "@/components/shared/auto-form";
import {
  BOOKING_TYPE_LABEL_VALUE_PAIRS,
  JOB_STATUS_LABLE_VALUE_PAIRS,
} from "@/db/constants";
import { GetBookingsFilter } from "@/lib/usecases";

export default function GetBookingsFilterForm({
  defaultFilter,
}: {
  defaultFilter?: GetBookingsFilter;
  select?: { [key in keyof GetBookingsFilter]?: boolean };
}) {
  return (
    <AutoForm action={""} className="lg:flex lg:items-end grid gap-2">
      <input type="hidden" name="page" value="1" />
      <DateRangePicker
        label="Start & End"
        size="sm"
        endName="end"
        startName="start"
        className="lg:w-60"
        defaultValue={{
          from: defaultFilter?.start
            ? new Date(defaultFilter.start)
            : undefined,
          to: defaultFilter?.end ? new Date(defaultFilter.end) : undefined,
        }}
      />
      <SelectFormItem
        className="lg:w-28"
        name="statuses"
        label="Status"
        size="sm"
        options={[
          { label: "All", value: "all" },
          ...JOB_STATUS_LABLE_VALUE_PAIRS,
        ]}
        defaultValue={defaultFilter?.statuses?.[0] || "all"}
      />

      <SelectFormItem
        className="lg:w-28"
        name="type"
        label="Type"
        size="sm"
        options={[
          { label: "All", value: "all" },
          ...BOOKING_TYPE_LABEL_VALUE_PAIRS,
        ]}
        defaultValue={defaultFilter?.type?.[0] || "all"}
      />
      <AutoFormPendingIcon size="sm" variant="outline" />
    </AutoForm>
  );
}
