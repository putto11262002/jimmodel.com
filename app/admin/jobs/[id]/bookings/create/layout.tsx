import { DateRangeContextProvider } from "./_components/date-context";
import permissions from "@/config/permission";
import { auth } from "@/config";

export default async function Layout({
  children,
  block,
  booking,
}: {
  children: React.ReactNode;
  block: React.ReactNode;
  booking: React.ReactNode;
}) {
  await auth({ permission: permissions.jobs.addBooking });
  return (
    <DateRangeContextProvider>
      <div className="grid gap-6">
        {children}
        {booking}
        {block}
      </div>
    </DateRangeContextProvider>
  );
}
