"use client";
import { UserWithoutSecrets } from "@/db/schemas/users";
import React from "react";

export enum UserAction {
  Delete = "delete",
  ResetPassword = "reset-password",
  UpdateRole = "update-role",
  AddUser = "add-user",
}

type UIOptions = { title?: string; description?: string };

type InvokePayload = {
  target: UserWithoutSecrets | null;
  action: UserAction;
} & UIOptions;

export type UserActionContextState = {
  action: UserAction | null;
  target: UserWithoutSecrets | null;
  title?: string | null;
  description?: string | null;
  invoke: (payload: InvokePayload) => void;
  done: () => void;
};

const UserActionsContext = React.createContext<UserActionContextState>({
  action: null,
  target: null,
  title: null,
  description: null,
  invoke: () => {},
  done: () => {},
});

export const useUserActions = () => {
  return React.useContext(UserActionsContext);
};

export default function UserActionsProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [state, setState] = React.useState<
    Pick<UserActionContextState, "action" | "target" | "title" | "description">
  >({ action: null, target: null, title: null, description: null });

  const invoke = ({
    action,
    target,
    title,
    description,
  }: {
    action: UserAction;
    target: UserWithoutSecrets | null;
    title?: string;
    description?: string;
  }) => {
    setState({ action, target, title, description });
  };

  const done = () => {
    setState({ action: null, target: null });
  };

  return (
    <UserActionsContext.Provider value={{ invoke, done, ...state }}>
      {children}
    </UserActionsContext.Provider>
  );
}
