import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Get get application from token attached to the cookies if the cookie is not present redirect to the new application page
export const getApplicationTokenOrRedirect = async (): Promise<string> => {
  const cookiesStore = await cookies();
  const applicationToken = cookiesStore.get("applicationToken");
  if (!applicationToken) {
    return redirect("/application/new");
  }
  return applicationToken.value;
};

export const getApplicationToken = async (): Promise<string | undefined> => {
  const cookiesStore = await cookies();
  const applicationToken = cookiesStore.get("applicationToken");
  return applicationToken?.value;
};
