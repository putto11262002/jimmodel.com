import { auth, modelUseCase } from "@/config";
import permissions from "@/config/permission";
import { NewModelProfileImageInputSchema } from "@/lib/usecases";
import { validateFormData } from "@/lib/utils/form-data";
import { NextRequest } from "next/server";

export const PUT = async (
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) => {
  await auth({ permission: permissions.models.setProfileImageById });
  const { id } = await params;
  const formData = await req.formData();
  const validation = validateFormData(
    formData,
    NewModelProfileImageInputSchema
  );
  if (!validation.ok) {
    return Response.json(validation.fieldErorrs);
  }
  await modelUseCase.updateProfileImage(id, validation.data);
  return new Response(null, { status: 204 });
};
