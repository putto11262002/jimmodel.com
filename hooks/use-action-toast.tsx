import {
  ActionResult,
  EmptyActionResult,
} from "@/actions/common/action-result";
import useToast from "@/components/toast";
import { useEffect } from "react";

export default function useActionToast<
  T extends ActionResult<string, any> | EmptyActionResult<string>
>({ state }: { state: T }) {
  const { ok, error } = useToast();

  useEffect(() => {
    if (state.status === "success" && state.message) {
      ok(state.message);
    }

    if (state.status === "error" && state.message) {
      error(state.message);
    }
  }, [state]);

  return null;
}
