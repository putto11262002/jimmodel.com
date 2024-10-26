"use client";
import useToast from "@/components/toast";
import { ForbiddenError } from "@/lib/errors";
import { AppError } from "@/lib/errors/app-error";
import { AuthenticationError } from "@/lib/errors/authentication-error";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider as _QueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

function makeClientQueryClient({
  redirectTo,
  notifyError,
  notifySuccess,
  signOut,
}: {
  notifyError: (err: string) => void;
  notifySuccess: (msg: string) => void;
  redirectTo: (href: string) => void;
  signOut: () => void;
}) {
  return new QueryClient({
    mutationCache: new MutationCache({
      onError(err, query) {
        // if (err instanceof HttpError) {
        //   if (err.code === 401) {
        //     redirectTo("/auth/sign-in");
        //     return;
        //   }
        //
        //   notifyError(err.message);
        //   return;
        // }
      },
      onSuccess(data) {
        // if (
        //   data &&
        //   typeof data === "object" &&
        //   "message" in data &&
        //   "ok" in data &&
        //   typeof data.message === "string" &&
        //   typeof data.ok === "boolean"
        // ) {
        //   if (data.ok) {
        //     notifySuccess(data.message);
        //   } else {
        //     notifyError(data.message);
        //   }
        // }
      },
    }),
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        retry(count, error) {
          if (error instanceof AppError) {
            if (
              error.name === AuthenticationError.name ||
              error.name === ForbiddenError.name
            ) {
              return false;
            }
          }

          return count < 3;
        },
        throwOnError(error, query) {
          if (error instanceof AppError) {
            if (error.name === AuthenticationError.name) {
              signOut();
              return false;
            }
          }
          return true;
        },
      },

      mutations: {
        retry: 0,
      },
    },
  });
}

function makeServerQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
      },
    },
  });
}

let browserQueryClient: QueryClient | undefined = undefined;

const QueryClientProvider = ({ children }: { children: React.ReactNode }) => {
  const { error, ok } = useToast();
  const router = useRouter();
  let queryClient: QueryClient;

  if (isServer) {
    queryClient = makeServerQueryClient();
  } else {
    if (!browserQueryClient)
      browserQueryClient = makeClientQueryClient({
        notifyError: error,
        redirectTo: router.push,
        notifySuccess: ok,
        signOut,
      });
    queryClient = browserQueryClient;
  }
  return (
    <>
      <_QueryClientProvider client={queryClient}>
        <ReactQueryDevtools initialIsOpen={false} />
        {children}
      </_QueryClientProvider>
    </>
  );
};

export default QueryClientProvider;
