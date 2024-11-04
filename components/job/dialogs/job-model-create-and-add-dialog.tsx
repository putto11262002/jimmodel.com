import { createAndAddModelToJobAction } from "@/actions/job";
import InputFormItem from "@/components/form/server-action/input-form-item";
import SelectFormItem from "@/components/form/server-action/select-form-intput";
import AsyncButton from "@/components/shared/buttons/async-button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BOOKING_STATUS_LABEL_VALUE_PAIRS,
  GENER_LABEL_VALUE_PAIRS,
} from "@/db/constants";
import useActionState from "@/hooks/use-action-state";
import { Job } from "@/lib/domains";

export default function JobModelCreateAndAddDialog({
  open,
  setOpen,
  job,
}: {
  open: boolean;
  setOpen: (open: boolean) => void;
  job: Job;
}) {
  const { pending, state, dispatch } = useActionState(
    createAndAddModelToJobAction
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Create and Add Model</DialogTitle>
        </DialogHeader>
        <form action={dispatch} className="grid gap-4">
          <input type="hidden" name="id" value={job.id} />
          <InputFormItem name="name" label="Name" state={state} />
          <SelectFormItem
            name="gender"
            label="Gender"
            state={state}
            options={GENER_LABEL_VALUE_PAIRS}
          />
          <SelectFormItem
            name="bookingStatus"
            label="BookingStatus"
            state={state}
            options={BOOKING_STATUS_LABEL_VALUE_PAIRS}
          />
          <div className="flex justify-end">
            <AsyncButton type="submit" pending={pending}>
              Create and Add
            </AsyncButton>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
