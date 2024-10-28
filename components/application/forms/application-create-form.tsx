"use client";

import { createApplicationAction } from "@/actions/application";
import AsyncButton from "@/components/shared/buttons/async-button";
import { Button } from "@/components/ui/button";
import useActionToast from "@/hooks/use-action-toast";
import { useActionState, useState } from "react";

export default function ApplicationCreateForm() {
  const [state, action, pending] = useActionState(createApplicationAction, {
    status: "idle",
  });
  useActionToast({ state });
  const [stage, setStage] = useState(0);
  return (
    <>
      {stage === 0 && (
        <div>
          <h2 className="font-semibold text-center">
            Start your modeling journey with us
          </h2>
          <p className="text-center text-sm mt-2">
            Fill out the form to help us learn more about you and match you with
            the right opportunities.
          </p>
          <div className="flex justify-center mt-4">
            <Button onClick={() => setStage(1)}>Let&apos; Get Started</Button>
          </div>
        </div>
      )}
      {stage === 1 && (
        <form action={action} className="">
          <h2 className="font-semibold text-center">
            A Few Things to Keep in Mind
          </h2>
          <p className="text-center text-sm mt-2">
            Please complete the form thoroughly to help us accurately assess
            your profile and match you with suitable opportunities. If
            you&apos;re uncomfortable sharing any information, feel free to omit
            it—your privacy is important to us.
          </p>
          <div className="flex justify-center mt-4">
            <AsyncButton pending={pending}>Continue</AsyncButton>
          </div>
        </form>
      )}
    </>
  );
}
