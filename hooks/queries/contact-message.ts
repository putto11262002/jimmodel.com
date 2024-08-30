import useToast from "@/components/toast";
import client from "@/lib/api/client";
import { ContactMessage } from "@/lib/types/contact-messasge";
import { PaginatedData } from "@/lib/types/paginated-data";
import {
  useMutation,
  useQuery,
  useQueryClient,
  UseQueryOptions,
} from "@tanstack/react-query";

export function useGetContactMessages({
  page,
  pageSize,
  read,
  ...opts
}: { page?: number; pageSize?: number; read?: boolean } & Omit<
  UseQueryOptions<
    PaginatedData<ContactMessage>,
    Error,
    PaginatedData<ContactMessage>
  >,
  "queryKey" | "queryFn"
>) {
  return useQuery({
    queryKey: ["contact-messages", { page, pageSize, read }],
    queryFn: async () => {
      const res = await client.api["contact-messages"].$get({
        query: {
          page: page?.toString(),
          pageSize: pageSize?.toString(),
          read:
            typeof read === "boolean" ? (read ? "true" : "false") : undefined,
        },
      });
      return res.json();
    },
  });
}

export function useMarkContactMessagesARead() {
  const queryClient = useQueryClient();
  const { ok } = useToast();
  return useMutation({
    mutationFn: async ({ id }: { id: string }) => {
      await client.api["contact-messages"][":id"]["mark-as-read"].$post({
        param: { id },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["contact-messages"] });
      ok("Contact message marked as read");
    },
  });
}
