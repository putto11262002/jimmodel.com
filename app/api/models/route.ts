import { auth, modelUseCase } from "@/config";
import permissions from "@/config/permission";
import { GetModelsFilterSchema, ModelCreateInputSchema } from "@/lib/usecases";
import {
  URLSearchParamsToObj,
  validateSearchParamObj,
} from "@/lib/utils/search-param";
import { validate } from "@/lib/utils/validator";
import { NextRequest } from "next/server";

export const GET = async (req: NextRequest) => {
  await auth({ permission: permissions.models.getModels });
  const searchParams = req.nextUrl.searchParams;
  const queryValidation = validateSearchParamObj(
    URLSearchParamsToObj(searchParams),
    GetModelsFilterSchema
  );
  const filter = queryValidation.ok ? queryValidation.data : {};
  const result = await modelUseCase.getModels(filter);
  return Response.json(result);
};

export const POST = async (req: NextRequest) => {
  await auth({ permission: permissions.models.createModel });
  const payload = await req.json();
  const validation = validate(payload, ModelCreateInputSchema);
  if (!validation.ok) {
    return Response.json(validation.fieldErrors);
  }
  const id = await modelUseCase.createModel(validation.data);
  return Response.json({ id: id });
};
