"use client";
import { createBookingAction } from "@/actions/job";
import DatetimePicker from "@/components/form/base/datetime-picker";
import FormItem from "@/components/form/form-item";
import FormMessage from "@/components/form/form-message";
import DatetimePickerFormItem from "@/components/form/server-action/datetime-picker-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AsyncButton from "@/components/shared/buttons/async-button";
import { Label } from "@/components/ui/label";
import {
  BOOKING_STATUS_LABEL_VALUE_PAIRS,
  BOOKING_TYPE_LABEL_VALUE_PAIRS,
} from "@/db/constants";
import useActionState from "@/hooks/use-action-state";
import useActionToast from "@/hooks/use-action-toast";
import { endOfDay } from "date-fns";
import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";

export default function BookingCreateForm({
  jobId,
  onChange,
  done,
}: {
  jobId: string;
  onChange?: (args: { start: Date; end: Date }) => void;
  done?: () => void;
}) {
  const { state, dispatch, pending } = useActionState(
    createBookingAction,
    undefined,
    { onSuccess: () => done && done() }
  );
  const [start, setStart] = useState<Date | undefined>(undefined);
  const [end, setEnd] = useState<Date | undefined>(undefined);

  useEffect(() => {
    if (!end && start) {
      setEnd(endOfDay(start));
    }
  }, [start]);

  return (
    <>
      <form action={dispatch} className="grid gap-4 grid-cols-2">
        <input type="hidden" name="id" value={jobId} />
        <input type="hidden" name="start" value={start?.toISOString()} />
        <input type="hidden" name="end" value={end?.toISOString()} />

        <div className="col-span-2 md:col-span-1">
          <FormItem>
            <Label>Start Date</Label>
            <DatetimePicker value={start} onChange={(v) => setStart(v)} />
            <FormMessage
              error={
                state.status === "validationError"
                  ? state.data.start
                  : undefined
              }
            />
          </FormItem>
        </div>
        <div className="col-span-2 md:col-span-1">
          <FormItem>
            <Label>End Date</Label>
            <DatetimePicker value={end} onChange={(v) => setEnd(v)} />
            <FormMessage
              error={
                state.status === "validationError" ? state.data.end : undefined
              }
            />
          </FormItem>
        </div>
        <div className="col-span-2">
          <SelectFormItem
            name="type"
            label="Type"
            options={BOOKING_TYPE_LABEL_VALUE_PAIRS}
            state={state}
          />
        </div>
        <div className="col-span-2 flex justify-end">
          <AsyncButton type="submit" pending={pending}>
            Create
          </AsyncButton>
        </div>
      </form>
    </>
  );
}
