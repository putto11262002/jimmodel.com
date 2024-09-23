// import {
//   QueryKey,
//   useMutation,
//   UseMutationOptions,
//   useQuery,
//   useQueryClient,
//   UseQueryOptions,
// } from "@tanstack/react-query";
// import useSession from "../use-session";
// import useToast from "@/components/toast";
// import { AppError } from "@/lib/errors/app-error";
// import { AuthenticationError } from "@/lib/errors/authentication-error";
// import { signOut } from "next-auth/react";
// import { AuthUser } from "@/lib/auth";
//
// type QueryHookOptions<TQueryFnData, TError> = Omit<
//   UseQueryOptions<TQueryFnData, TError>,
//   "queryKey" | "queryFn"
// >;
//
// type QueryHookParameters<
//   TQueryFnData,
//   TQueryFnParams extends Record<string, any>,
//   TError extends Error = Error,
//   TQueryKey extends any[] = any[]
// > = {
//   queryKey: TQueryKey | ((params: TQueryFnParams) => TQueryKey);
//   queryFn: (params: TQueryFnParams) => Promise<TQueryFnData>;
//   permission?: Permissions
// } & QueryHookOptions<TQueryFnData, TError>;
//
// export const createQueryHook = <
//   TQueryFnData,
//   TQueryFnParams extends Record<string, any>,
//   TError extends Error = Error,
//   TQueryKey extends any[] = any[]
// >({
//   queryKey,
//   queryFn,
//   permission,
//   ..._opts
// }: QueryHookParameters<TQueryFnData, TQueryFnParams, TError, TQueryKey>) => {
//   return (
//     opts: Omit<UseQueryOptions<TQueryFnData, TError>, "queryKey" | "queryFn"> &
//       TQueryFnParams
//   ) => {
//
//     return useQuery<TQueryFnData, TError>({
//       ..._opts,
//       ...opts,
//       queryKey: typeof queryKey === "function" ? queryKey(opts) : queryKey,
//       queryFn: async () => queryFn(opts),
//       enabled:
//         session.status === "authenticated" &&
//         (_opts.enabled ?? true) &&
//         (opts.enabled ?? true),
//     });
//   };
// };
//
// type MutationHookConfig<TData, TVariables, TError extends Error = AppError> = {
//   mutationFn: (variables: TVariables) => Promise<TData>;
//   invalidate?: any[][] | ((data: TData, variables: TVariables) => any[][]);
// } & MutationHookOptions<TData, TError, TVariables>;
//
// type MutationHookOptions<TData, TError, TVariables> = Omit<
//   UseMutationOptions<TData, TError, TVariables>,
//   "mutationFn"
// >;
//
// export const createMutationHook = <
//   TData,
//   TVariables,
//   TError extends Error = AppError
// >({
//   mutationFn,
//   invalidate,
//   ..._opts
// }: MutationHookConfig<TData, TVariables, TError>) => {
//   return (opts?: MutationHookOptions<TData, TError, TVariables>) => {
//     const queryClient = useQueryClient();
//     const { ok, error } = useToast();
//
//     return useMutation({
//       onSuccess: async (data, variables) => {
//         if (invalidate) {
//           await Promise.all(
//             (typeof invalidate === "function"
//               ? invalidate(data, variables)
//               : invalidate
//             ).map((queryKey) =>
//               queryClient.invalidateQueries({
//                 queryKey: queryKey,
//               })
//             )
//           );
//
//           if (
//             data &&
//             typeof data === "object" &&
//             "message" in data &&
//             typeof data.message === "string"
//           ) {
//             ok(data.message);
//           }
//         }
//       },
//       onError: (err) => {
//         if (err.name === AuthenticationError.name) {
//           signOut();
//           return;
//         }
//         error(err.message);
//       },
//       mutationFn: async (variables: TVariables) => {
//         return mutationFn(variables);
//       },
//       ..._opts,
//       ...opts,
//     });
//   };
// };
