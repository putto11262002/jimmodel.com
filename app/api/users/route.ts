import { auth, userUseCase } from "@/config";
import permissions from "@/config/permission";
import { GetUsersFilterSchema } from "@/lib/usecases";
import {
  URLSearchParamsToObj,
  validateSearchParamObj,
} from "@/lib/utils/search-param";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  await auth({ permission: permissions.users.getUsers });
  const searchParams = req.nextUrl.searchParams;
  const searchParamsValidation = validateSearchParamObj(
    URLSearchParamsToObj(searchParams),
    GetUsersFilterSchema
  );
  const filter = searchParamsValidation.ok ? searchParamsValidation.data : {};
  const result = await userUseCase.getUsers(filter);
  return Response.json(result);
};
