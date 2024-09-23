import { jobUseCase } from "@/config";
import { GetBookingsFilterSchema } from "@/lib/usecases";
import {
  URLSearchParamsToObj,
  validateSearchParamObj,
} from "@/lib/utils/search-param";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const searchParamsValidation = validateSearchParamObj(
    URLSearchParamsToObj(request.nextUrl.searchParams),
    GetBookingsFilterSchema
  );
  const getBookingsFilter = searchParamsValidation.ok
    ? searchParamsValidation.data
    : {};

  const result = await jobUseCase.getBookings(getBookingsFilter);
  return Response.json(result);
}
