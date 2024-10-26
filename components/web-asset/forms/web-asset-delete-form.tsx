import { webAssetDeleteAction } from "@/actions/web-asset";
import { useActionState, useEffect } from "react";

export default function WebAssetDeleteForm({
  id,
  trigger,
  done,
}: {
  id: string;
  trigger: React.ReactNode;
  done?: () => void;
}) {
  const [state, action, pending] = useActionState(webAssetDeleteAction, {
    status: "idle",
  });
  useEffect(() => {
    if (state.status === "success" && done) {
      done();
    }
  }, [state]);
  return (
    <form action={action}>
      <input type="hidden" name="id" value={id} />
      {trigger}
    </form>
  );
}
