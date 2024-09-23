import DateRangePicker from "@/components/form/server-action/date-range-picker";
import AutoForm, { AutoFormPendingIcon } from "@/components/shared/auto-form";
import { GetModelBlocksFilter } from "@/lib/usecases";

export default function GetModelBlocksFilterForm({
  defaultFilter,
}: {
  defaultFilter?: GetModelBlocksFilter;
}) {
  return (
    <AutoForm action="" className="grid lg:flex lg:items-end gap-2">
      <input type="hidden" name="page" value="1" />
      <DateRangePicker
        size="sm"
        label="Start & End"
        defaultValue={{
          from: defaultFilter?.start
            ? new Date(defaultFilter.start)
            : undefined,
          to: defaultFilter?.end ? new Date(defaultFilter.end) : undefined,
        }}
        startName="start"
        endName="end"
        className="md:w-60"
      />
      <AutoFormPendingIcon variant="outline" size="sm" />
    </AutoForm>
  );
}
