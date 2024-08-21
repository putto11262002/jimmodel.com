import Loader from "@/components/loader";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import permissions from "@/config/permission";
import { useGetJob, useGetJobBookings } from "@/hooks/queries/job";
import useSession from "@/hooks/use-session";
import { createContext, useContext, useState } from "react";
import JobStatusBadge from "../job-status-badge";
import { Button } from "@/components/ui/button";
import { User, Clock, ExternalLink } from "lucide-react";
import { combine } from "@/lib/utils/auth";
import { formatISODateString } from "@/lib/utils/date";
import JobOwnerBadge from "../job-owner-badge";
import BookingsList from "../booking/bookings-list";
import KeyValueItem from "@/components/key-value/key-value-item";
import ModelProfileList from "@/components/model/model-list";

type JobPreviewSheetState = {
  jobId: string | null;
  preview: (jobId: string) => void;
  close: () => void;
};

const jobPreviewSheetContext = createContext<JobPreviewSheetState>({
  jobId: null,
  preview: () => {},
  close: () => {},
});

export const useJobPreview = () => useContext(jobPreviewSheetContext);

export function JobPreviewSheetProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [jobId, setJobId] = useState<string | null>(null);
  const preview = (jobId: string) => {
    setJobId(jobId);
  };
  const close = () => {
    setJobId(null);
  };
  return (
    <jobPreviewSheetContext.Provider value={{ jobId, preview, close }}>
      <JobPreviewSheet />
      {children}
    </jobPreviewSheetContext.Provider>
  );
}

function JobPreviewSheet() {
  const { jobId, close } = useJobPreview();

  const session = useSession(
    combine(permissions.jobs.getJobById, permissions.jobs.getJobBookings),
  );
  const { isPending, data, isSuccess } = useGetJob({
    jobId: jobId ?? "",
    enabled: Boolean(jobId) && session.status === "authenticated",
  });

  const {
    isPending: isPendingBookings,
    data: bookings,
    isSuccess: isSuccessBookings,
  } = useGetJobBookings({
    jobId: jobId ?? "",
    enabled: Boolean(jobId) && session.status === "authenticated",
  });

  return (
    <Sheet onOpenChange={(open) => !open && close()} open={Boolean(jobId)}>
      {!isPending && isSuccess && !isPendingBookings && isSuccessBookings ? (
        <SheetContent>
          <SheetHeader className="">
            <div className="gap-2 flex flex-row items-center">
              <SheetTitle className="">{data.name} </SheetTitle>
              <JobStatusBadge status={data.status} />
            </div>
          </SheetHeader>
          <div className="py-4 grid gap-4 overflow-hidden">
            <div className="flex items-center flex-wrap gap-2 w-full">
              <Button className="h-7" variant={"outline"} size={"sm"}>
                Edit <ExternalLink className="h-3.5 w-3.5 ml-2" />
              </Button>
              <Button className="h-7" variant={"outline"} size={"sm"}>
                Bookings <ExternalLink className="h-3.5 w-3.5 ml-2" />
              </Button>
              <Button className="h-7" variant={"outline"} size={"sm"}>
                Models <ExternalLink className="h-3.5 w-3.5 ml-2" />
              </Button>
            </div>
            <div className="grid gap-2">
              <KeyValueItem
                _key={
                  <User className="h-4 w-4 text-foreground stroke-[2.5px]" />
                }
                value={<JobOwnerBadge owner={data.owner} />}
              />

              <KeyValueItem
                _key={
                  <Clock className="h-4 w-4 text-foreground stroke-[2.5px]" />
                }
                value={formatISODateString(data.createdAt)}
              />
            </div>
            <div className="grid gap-2">
              <h3 className="font-medium ">Models</h3>
              <ModelProfileList models={data.models} />
            </div>
            <div className="grid gap-2">
              <h3 className="font-medium">Bookings</h3>
              <BookingsList bookings={bookings} />
            </div>
          </div>
        </SheetContent>
      ) : (
        <SheetContent>
          <Loader />
        </SheetContent>
      )}
    </Sheet>
  );
}
