"use client";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { UserAction, useUserActions } from "../actions-context";
import { lazy, LazyExoticComponent } from "react";

const actionsForms: Record<
  UserAction.AddUser | UserAction.UpdateRole | UserAction.ResetPassword,
  LazyExoticComponent<() => JSX.Element>
> = {
  [UserAction.ResetPassword]: lazy(() => import("./reset-password-form")),
  [UserAction.UpdateRole]: lazy(() => import("./update-role-form")),
  [UserAction.AddUser]: lazy(() => import("./add-user-form")),
};

export default function UserActionForms() {
  const {
    action,
    title,
    description,
    done: completedAction,
  } = useUserActions();

  const ActionForm =
    action === UserAction.AddUser ||
    action === UserAction.ResetPassword ||
    action === UserAction.UpdateRole
      ? actionsForms[action]
      : null;

  return (
    <Sheet
      open={action !== null}
      onOpenChange={(open) => !open && completedAction()}
    >
      <SheetContent>
        <SheetHeader>
          {title && <SheetTitle>{title}</SheetTitle>}
          {<SheetDescription>{description}</SheetDescription>}
        </SheetHeader>
        <div className="py-4 ">{ActionForm && <ActionForm />}</div>
      </SheetContent>
    </Sheet>
  );
}
