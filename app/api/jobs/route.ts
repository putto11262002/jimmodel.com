import { jobUseCase } from "@/config";
import { GetJobsFilterSchema } from "@/lib/usecases";
import {
  URLSearchParamsToObj,
  validateSearchParamObj,
} from "@/lib/utils/search-param";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  const searchParamsValdiation = validateSearchParamObj(
    URLSearchParamsToObj(req.nextUrl.searchParams),
    GetJobsFilterSchema
  );
  const getBookingsFilter = searchParamsValdiation.ok
    ? searchParamsValdiation.data
    : {};
  const result = await jobUseCase.getJobs(getBookingsFilter);
  return Response.json(result);
};
