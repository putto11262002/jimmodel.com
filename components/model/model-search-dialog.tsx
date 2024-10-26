import {
  Dialog,
  DialogClose,
  DialogOverlay,
  DialogPortal,
  DialogTrigger,
} from "../ui/dialog";
import Avatar from "../avatar";
import { useState } from "react";
import { Loader2, Search, X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import useSWR from "swr";
import routes from "@/config/routes";
import { CompactModel } from "@/lib/domains";
import Alert from "../alert";

export default function ModelSearchDialog({
  trigger,
  onSelect,
  ignore,
}: {
  trigger: React.ReactNode;
  onSelect: (model: string) => void;
  ignore?: string[];
}) {
  const [q, setQ] = useState("");

  const { data, isLoading, error } = useSWR<
    CompactModel[],
    Error,
    { url: string; q: string }
  >({ url: routes.api.models.get, q }, async ({ url, q }) => {
    const res = await fetch(`${url}?q=${q}&compact=true&page=1&pageSize=10`);
    if (!res.ok) {
      throw new Error("Failed to fetch models");
    }
    return res.json().then((data) => data.data as CompactModel[]);
  });
  const models = data?.filter((model) => !ignore?.includes(model.id));

  return (
    <>
      <Dialog>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogPortal>
          <DialogOverlay>
            <DialogContent>
              <form className="flex items-center gap-1 border-b py-2">
                <div className="pl-4">
                  <Search className="icon-sm" />
                </div>
                <input
                  onChange={(e) => setQ(e.target.value)}
                  value={q}
                  name="q"
                  className="grow h-9 px-4  outline-none focus:outline-none w-full bg-transparent"
                />
                <div className="pr-4">
                  <DialogClose>
                    <X className="icon-sm" />
                  </DialogClose>
                </div>
                <input type="hidden" value="1" name="page" />
                <input type="hidden" value="10" name="pageSize" />
              </form>
              {isLoading ? (
                <div className="py-4 flex items-center justify-center">
                  <Loader2 className="animate-spin" />
                </div>
              ) : error ? (
                <div className="py-4 px-4">
                  <Alert
                    className="flex items-center justify-center"
                    variant="error"
                  >
                    {error.message}
                  </Alert>
                </div>
              ) : (
                <div className="">
                  {models && models.length > 0 ? (
                    models.map((model, index) => {
                      return (
                        <div
                          onClick={() => onSelect(model.id)}
                          key={index}
                          className="py-2 px-4 flex items-center gap-2 hover:bg-muted border-b last:border-b-0"
                        >
                          <Avatar
                            size={"sm"}
                            fileId={model.profileImageId}
                            name={model.name}
                          />
                          <span className="text-sm">{model.name}</span>

                          {/* <Checkbox className="ml-auto" key={index} /> */}
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-muted-foreground py-4 text-sm">
                      No results
                    </div>
                  )}
                </div>
              )}
            </DialogContent>
          </DialogOverlay>
        </DialogPortal>
      </Dialog>
    </>
  );
}

export const DialogContent = ({ children }: { children: React.ReactNode }) => {
  return (
    <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg bg-background border translate-x-[-50%] translate-y-[-50%] duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] rounded-lg">
      {children}
    </DialogPrimitive.Content>
  );
};
