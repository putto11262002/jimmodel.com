import { UserRole } from "@/db/schemas";
import AuthorisationError from "@/lib/errors/authorisation-error";
import { hasPermission } from "@/lib/utils/auth";
import { intersection } from "lodash";
import { useSession as _useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function useSession(roles?: UserRole[], fn?: () => boolean) {
  const router = useRouter();
  const session = _useSession({
    required: true,
    onUnauthenticated: () => router.push("/auth/sign-in"),
  });

  useEffect(() => {
    if (session.status === "authenticated") {
      if (
        roles &&
        roles.length > 0 &&
        !hasPermission(roles, session.data.user.roles) &&
        (!fn || !fn())
      ) {
        throw new AuthorisationError(
          "You are not authorised to access this page",
        );
      }
    }
  }, [session]);

  return session;
}
