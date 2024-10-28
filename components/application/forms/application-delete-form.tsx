import { deleteApplicationAction } from "@/actions/application";
import useActionState from "@/hooks/use-action-state";

export default function ApplicationDeleteForm<
  Trigger extends ({ pending }: { pending: boolean }) => React.ReactElement
>({ id, trigger }: { id: string; trigger: Trigger }) {
  const { dispatch, pending } = useActionState(deleteApplicationAction);
  return (
    <form action={dispatch}>
      <input type="hidden" name="id" value={id} />
      {trigger({ pending: pending })}
    </form>
  );
}
