import { DateRangeContextProvider } from "./_components/date-context";
import permissions from "@/config/permission";
import { auth } from "@/config";
import BookingSection from "./_components/booking-section";
import { getJobOrThrow } from "@/loaders/job";
import BlockSection from "./_components/block-section";

export default async function Layout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  await auth({ permission: permissions.jobs.addBooking });
  const job = await getJobOrThrow(id);
  return (
    <DateRangeContextProvider>
      <div className="grid gap-6">
        {children}
        <BookingSection job={job} />
        <BlockSection job={job} />
      </div>
    </DateRangeContextProvider>
  );
}
