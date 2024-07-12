import { useSession as _useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function useSession() {
  const router = useRouter();
  return _useSession({
    required: true,
    onUnauthenticated: () => router.push("/auth/sign-in"),
  });
}
