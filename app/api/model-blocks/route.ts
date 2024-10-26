import { modelUseCase } from "@/config";
import { GetModelBlocksFilterSchema } from "@/lib/usecases";
import {
  URLSearchParamsToObj,
  validateSearchParamObj,
} from "@/lib/utils/search-param";
import { NextRequest } from "next/server";

export const GET = async (request: NextRequest) => {
  const searchParams = request.nextUrl.searchParams;
  const searchParamValdation = validateSearchParamObj(
    URLSearchParamsToObj(searchParams),
    GetModelBlocksFilterSchema
  );
  const getModelBlocksFilter = searchParamValdation.ok
    ? searchParamValdation.data
    : {};
  const result = await modelUseCase.getBlocks(getModelBlocksFilter);
  return Response.json(result);
};
