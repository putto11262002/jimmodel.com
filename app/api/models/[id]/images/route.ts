import { auth, modelUseCase } from "@/config";
import permissions from "@/config/permission";
import { NewModelImageCreateInputSchema } from "@/lib/usecases";
import { validateFormData } from "@/lib/utils/form-data";
import { NextRequest } from "next/server";

export const POST = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await auth({ permission: permissions.models.addModelImage });
  const { id } = await params;
  const formData = await req.formData();
  const validation = validateFormData(formData, NewModelImageCreateInputSchema);
  if (!validation.ok) {
    return Response.json(validation.fieldErorrs);
  }
  await modelUseCase.addModelImage(id, validation.data);
  return new Response(null, { status: 204 });
};
