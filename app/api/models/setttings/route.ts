import { auth, modelUseCase } from "@/config";
import permissions from "@/config/permission";
import { ModelSettingUpdateInputSchema } from "@/lib/usecases";
import { validate } from "@/lib/utils/validator";
import { NextRequest } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await auth({ permission: permissions.models.updateModelById });
  const { id } = await params;
  const payload = await req.json();
  const validation = validate(payload, ModelSettingUpdateInputSchema);
  if (!validation.ok) {
    return Response.json(validation.fieldErrors);
  }
  await modelUseCase.updateModelSettings(id, validation.data);
  return new Response(null, { status: 204 });
};
