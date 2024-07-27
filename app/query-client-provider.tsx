"use client";
import useToast from "@/components/toast";
import HttpError from "@/lib/errors/http-error";
import {
  MutationCache,
  QueryClient,
  QueryClientProvider as _QueryClientProvider,
  isServer,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { useRouter } from "next/navigation";

function makeClientQueryClient({
  redirectTo,
  notifyError,
}: {
  notifyError: (err: string) => void;
  redirectTo: (href: string) => void;
}) {
  return new QueryClient({
    mutationCache: new MutationCache({
      onError(err, query) {
        if (err instanceof HttpError) {
          if (err.code === 401) {
            redirectTo("/auth/sign-in");
            return;
          }
        }
        notifyError(err.message);
      },
    }),
    defaultOptions: {
      queries: {
        // With SSR, we usually want to set some default staleTime
        // above 0 to avoid refetching immediately on the client
        staleTime: 60 * 1000,
        retry(count, error) {
          if (error instanceof HttpError) {
            if (error.code === 401 || error.code === 403) {
              return false;
            }
          }

          return count < 3;
        },
        throwOnError(error, query) {
          if (error instanceof HttpError) {
            if (error.code === 401) {
              redirectTo("/auth/sign-in");
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
  const { error } = useToast();
  const router = useRouter();
  let queryClient: QueryClient;

  if (isServer) {
    queryClient = makeServerQueryClient();
  } else {
    if (!browserQueryClient)
      browserQueryClient = makeClientQueryClient({
        notifyError: error,
        redirectTo: router.push,
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
