"use client";
import { UserRole, userRoles } from "@/db/schemas/users";
import UserTable from "./table";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import PaginationControl from "@/components/pagination-control";
import useSession from "@/hooks/use-session";
import permissions from "@/config/permission";
import { useSearchParams } from "next/navigation";
import Loader from "@/components/loader";
import { useGetUsers } from "@/hooks/queries/user";

const parseUserRole = (role: string): UserRole | null => {
  if (userRoles.includes(role as UserRole)) {
    return role as UserRole;
  }
  return null;
};

export default function Page() {
  const searchParams = useSearchParams();
  const session = useSession(permissions.users.getUsers);
  // Use zod to validate and clean search params
  const pageParam = searchParams.get("page");

  const page = pageParam ? parseInt(pageParam) || 1 : 1;

  const { data, isSuccess } = useGetUsers({
    page,
    enabled: session.status === "authenticated",
  });

  if (!isSuccess || session.status === "loading") {
    return <Loader />;
  }

  return (
    <Card x-chunk="dashboard-06-chunk-0">
      <CardHeader>
        <CardTitle>Users</CardTitle>
      </CardHeader>
      <CardContent>
        <UserTable users={data.data} />
      </CardContent>
      <CardFooter>
        <PaginationControl page={page} totalPages={data.totalPages} />
      </CardFooter>
    </Card>
  );
}
