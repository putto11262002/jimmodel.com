import DefaultError from "@/components/default-error";
import { ForbiddenError } from "@/lib/errors";

export default function Page() {
  return <DefaultError error={new ForbiddenError("Forbidden")} />;
}
