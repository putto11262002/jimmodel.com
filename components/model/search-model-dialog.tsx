import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import Loader from "../loader";
import client from "../../lib/api/client";
import Image from "next/image";
import { Checkbox } from "../ui/checkbox";

export default function SearchModelDialog({
  children,
  onSelect,
  selected,
}: {
  children: React.ReactNode;
  onSelect: (model: string) => void;
  selected: { id: string }[];
}) {
  const [searchTerm, setSearchTerm] = useState("");

  const { data, isFetching } = useQuery({
    queryKey: ["models", "profile", searchTerm],
    queryFn: async ({ signal }) => {
      await new Promise((resolve, reject) => {
        let timer = setTimeout(resolve, 1000);
        signal.addEventListener("abort", () => {
          clearTimeout(timer);
          reject();
        });
      });

      const res = await client.api.models.$get(
        {
          query: { q: searchTerm, pageSize: "5" },
        },
        {
          init: { signal },
        },
      );
      const data = await res.json();
      return data;
    },
    enabled: searchTerm.length > 0,
  });

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{children}</DialogTrigger>
        <DialogContent className="p-0">
          <div>
            <input
              className="py-3 px-4 rounded-lg outline-none focus:outline-none w-full bg-muted"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <div className="py-2 px-2">
              {isFetching ? (
                <div className="flex justify-center py-4">
                  <Loader />
                </div>
              ) : data && data.data.length > 0 ? (
                data?.data?.map((model, index) => {
                  const isSelected =
                    selected.findIndex((m) => model.id === m.id) !== -1;
                  return (
                    <div
                      onClick={() => onSelect(model.id)}
                      key={index}
                      className="py-2 px-4 flex items-center gap-2 hover:bg-muted rounded"
                    >
                      <Image
                        src={
                          model.profileImage
                            ? `/files/${model.profileImage?.fileId}`
                            : "/placeholder.svg"
                        }
                        alt="Model profile"
                        className="object-cover w-[32px] h-[32px] rounded"
                        height={32}
                        width={32}
                      />
                      <span className="text-sm">{model.name}</span>

                      <Checkbox className="ml-auto" checked={isSelected} />
                    </div>
                  );
                })
              ) : (
                <div className="text-center text-muted-foreground py-4 text-sm">
                  No results
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
