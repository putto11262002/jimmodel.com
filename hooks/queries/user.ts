import useToast from "@/components/toast";
import client from "@/lib/api/client";
import { UserCreateInput } from "@/lib/types/user";
import {
  QueryClient,
  useMutation,
  UseMutationOptions,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

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

export const useAddUser = ({
  _client,
  opts,
}: {
  _client?: QueryClient;
  opts?: UseMutationOptions<void, Error, { input: UserCreateInput }>;
} = {}) => {
  const { error, ok } = useToast();

  const queryClient = _client || useQueryClient();
  return useMutation(
    {
      ...opts,
      mutationFn: async ({ input }: { input: UserCreateInput }) => {
        await client.api.users.$post({ json: input });
      },
      onError: (...args) => {
        error(args[0].message);
        opts?.onError?.(...args);
      },
      onSuccess: (...args) => {
        ok("User added successfully");
        queryClient.invalidateQueries({ queryKey: ["users"] });
        opts?.onSuccess?.(...args);
      },
    },
    queryClient,
  );
};
