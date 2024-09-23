"use client";
import { createBookingAction } from "@/actions/job";
import DatetimePickerFormItem from "@/components/form/server-action/datetime-picker-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AsyncButton from "@/components/shared/buttons/async-button";
import {
  BOOKING_STATUS_LABEL_VALUE_PAIRS,
  BOOKING_TYPE_LABEL_VALUE_PAIRS,
} from "@/db/constants";
import useActionToast from "@/hooks/use-action-toast";
import { ArrowRight } from "lucide-react";
import { useActionState, useEffect, useState } from "react";

export default function BookingCreateForm({
  jobId,
  onChange,
}: {
  jobId: string;
  onChange?: (args: { start: Date; end: Date }) => void;
}) {
  const [state, action, pending] = useActionState(createBookingAction, {
    status: "idle",
  });
  const [start, setStart] = useState<Date | null>(null);
  const [end, setEnd] = useState<Date | null>(null);
  const [type, setType] = useState<string | null>(null);

  useActionToast({ state });
  useEffect(() => {
    if (start && end && onChange) {
      onChange({ start, end });
    }
  }, [start, end]);

  return (
    <>
      <form action={action} className="grid gap-4 grid-cols-2">
        <input type="hidden" name="id" value={jobId} />
        <div className="col-span-2 md:col-span-1">
          <DatetimePickerFormItem
            onChange={(date) => date && setStart(date)}
            name="start"
            label="Start Date"
            state={state}
          />
        </div>
        <div className="col-span-2 md:col-span-1">
          <DatetimePickerFormItem
            onChange={(date) => date && setEnd(date)}
            name="end"
            label="End Date"
            state={state}
          />
        </div>
        <div className="col-span-2">
          <SelectFormItem
            onValueChange={(v) => setType(v)}
            name="type"
            label="Type"
            options={BOOKING_TYPE_LABEL_VALUE_PAIRS}
            state={state}
          />
        </div>
        <div className="col-span-2 flex justify-end">
          <AsyncButton pending={pending}>Create</AsyncButton>
        </div>
      </form>
    </>
  );
}
