import useToast from "@/components/toast";
import { UserRole } from "@/db/schemas";
import client from "@/lib/api/client";
import { User, UserCreateInput, UserWithoutSecrets } from "@/lib/types/user";
import {
  QueryClient,
  QueryOptions,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";
import useSession from "../use-session";

export const useUploadImage = ({
  opts,
  _client,
}: {
  opts?: UseMutationOptions<void, Error, { file: File }>;
  _client?: QueryClient;
} = {}) => {
  const queryClient = _client || useQueryClient();
  const { ok, error } = useToast();
  return useMutation({
    ...opts,
    mutationFn: async ({ file, userId }: { file: File; userId: string }) => {
      await client.api.users[":id"].image.$post({
        param: { id: userId },
        form: { file },
      });
    },
    onSuccess: (...args) => {
      ok("Image successfully uploaded");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      opts?.onSuccess?.(...args);
    },
    onError: (...args) => {
      error("Failed to upload image");
      opts?.onError?.(...args);
    },
  });
};

export const useUploadSelfImage = () => {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  const { update } = useSession();
  return useMutation({
    mutationFn: async ({ file }: { file: File }) => {
      await client.api.users.self.image.$post({ form: { file } });
    },
    onSuccess: (...args) => {
      ok("Image successfully uploaded");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export const useCreateUser = ({
  opts,
}: {
  _client?: QueryClient;
  opts?: UseMutationOptions<void, Error, { input: UserCreateInput }>;
} = {}) => {
  const { error, ok } = useToast();

  const queryClient = useQueryClient();
  return useMutation({
    ...opts,
    mutationFn: async ({ input }: { input: UserCreateInput }) => {
      await client.api.users.$post({ json: input });
    },
    onSuccess: (...args) => {
      ok("User added successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });
};

export function useGetUser({
  id,
  ...opts
}: { id: string } & Omit<
  UseQueryOptions<UserWithoutSecrets, Error, UserWithoutSecrets>,
  "queryKey" | "queryFn"
>) {
  return useQuery({
    ...opts,
    queryKey: ["users", id],
    queryFn: async () => {
      const res = await client.api.users[":id"].$get({ param: { id } });
      return res.json();
    },
  });
}

export function useGetSelf({
  ...opts
}: Omit<
  UseQueryOptions<UserWithoutSecrets, Error, UserWithoutSecrets>,
  "queryKey" | "queryFn"
> = {}) {
  return useQuery({
    ...opts,
    queryKey: ["users", "self"],
    queryFn: async () => {
      const res = await client.api.users.self.$get();
      return res.json();
    },
  });
}

export function useUpdateUserRoles() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ id, roles }: { id: string; roles: UserRole[] }) => {
      await client.api.users[":id"].roles.$put({
        param: { id },
        json: { roles },
      });
    },
    onMutate: async ({ id }) => {
      queryClient.invalidateQueries({ queryKey: ["users", id] });
      ok("User roles updated");
    },
  });
}

export function useUpdateSelfRoles() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ roles }: { roles: UserRole[] }) => {
      await client.api.users.self.roles.$put({
        json: { roles },
      });
    },
    onMutate: async () => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      ok("User roles updated");
    },
  });
}

export function useUpdateSelfPassword() {
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ password }: { password: string }) => {
      await client.api.users.self.password.$put({ json: { password } });
    },
    onSuccess: () => {
      ok("Password updated successfully");
    },
  });
}

export function useUpdateUserPassword() {
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ password, id }: { password: string; id: string }) => {
      await client.api.users[":id"].password.$put({
        param: { id },
        json: { password },
      });
    },
    onSuccess: () => {
      ok("Password updated successfully");
    },
  });
}

export function useGetUsers({
  page,
  enabled,
}: {
  page?: number;
  enabled: boolean;
}) {
  return useQuery({
    queryKey: ["users", { page }],
    queryFn: async () => {
      const res = await client.api.users.$get({
        query: { page: page?.toString() },
      });
      return res.json();
    },
    enabled,
  });
}
