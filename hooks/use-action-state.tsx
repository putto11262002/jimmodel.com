import {
  ActionResult,
  BaseActionResult,
  EmptyActionResult,
  IdelActionResult,
} from "@/actions/common";
import useToast from "@/components/toast";
import { useActionState as _useActionState, useEffect } from "react";

export default function useActionState<State extends BaseActionResult, Payload>(
  action: (state: Awaited<State>, payload: Payload) => State | Promise<State>,
  initialState: Awaited<State> = { status: "idle" } as Awaited<State>,
  {
    permalink,
    toast = true,
    onSuccess,
    onError,
  }: {
    permalink?: string;
    toast?: boolean;
    onSuccess?: (data: Extract<Awaited<State>, { status: "success" }>) => void;
    onError?: (data: Extract<Awaited<State>, { status: "error" }>) => void;
  } = {
    toast: true,
  }
) {
  const [state, dispatch, pending] = _useActionState<State, Payload>(
    action,
    initialState,
    permalink
  );

  const { ok, error } = useToast();

  useEffect(() => {
    if (toast === false) return;
    if (state.status === "success" && state.message) {
      ok(state.message);
      onSuccess &&
        onSuccess(state as Extract<Awaited<State>, { status: "success" }>);
    }

    if (state.status === "error" && state.message) {
      error(state.message);
      onError && onError(state as Extract<Awaited<State>, { status: "error" }>);
    }
  }, [state]);

  return { state, dispatch, pending };
}
