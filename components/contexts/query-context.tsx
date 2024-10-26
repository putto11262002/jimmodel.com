"use client";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import React, { useEffect } from "react";

type QueryContext<T> = {
  query: T;
  setQuery: (state: T) => void;
  sync: boolean;
};

type QueryContextProviderConfig<T> = {
  context: React.Context<QueryContext<T>>;
  defaultValue: T;
  serializer: (values: T) => Record<string, string | string[] | undefined>;
  deserializer: (values: Record<string, string | string[] | undefined>) => T;
};

export function createQueryContext<T>(
  defaultValue: T,
  serializer: (values: T) => Record<string, string | string[] | undefined>,
  deserializer: (values: Record<string, string | string[] | undefined>) => T,
) {
  const context = React.createContext<QueryContext<T>>({
    query: defaultValue,
    setQuery: () => {},
    sync: false,
  });
  return [
    {
      context,
      defaultValue: defaultValue,
      serializer,
      deserializer,
    },
    () => React.useContext(context),
  ] as const;
}

export function QueryContextProvider<T>({
  children,
  config,
}: {
  children: React.ReactNode;

  config: QueryContextProviderConfig<T>;
}) {
  const [state, setState] = React.useState<T>(config.defaultValue);
  const [sync, setSync] = React.useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();

  // sync state with query params
  useEffect(() => {
    let serialized: Record<string, string | string[]> = {};
    searchParams.forEach((value, key) => {
      serialized[key] = value;
    });

    const deserialized = config.deserializer(serialized);
    setQuery({ ...state, ...deserialized });
  }, []);

  useEffect(() => {
    const serialized = config.serializer(state);
    const params = new URLSearchParams();
    Object.entries(serialized).forEach(([key, value]) => {
      if (!value) return;
      if (Array.isArray(value)) {
        value.forEach((v) => params.append(key, v));
      } else {
        params.set(key, value);
      }
    });
    router.replace(`${pathname}?${params.toString()}`);
    setSync(true);
  }, [state]);

  function setQuery(newState: T) {
    setState(newState);
  }
  return (
    <config.context.Provider
      value={{
        query: state,
        setQuery,
        sync,
      }}
    >
      {children}
    </config.context.Provider>
  );
}
