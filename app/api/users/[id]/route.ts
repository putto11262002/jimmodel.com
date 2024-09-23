import { auth, userUseCase } from "@/config";
import permissions from "@/config/permission";
import { NotFoundError } from "@/lib/errors";
import { NextRequest } from "next/server";

export const GET = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  await auth({ permission: permissions.users.getUsers });
  const user = await userUseCase.getUser(id);

  if (!user) {
    throw new NotFoundError("User not found");
  }
  return Response.json(user);
};
