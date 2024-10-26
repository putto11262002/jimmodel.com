import { fileUseCase } from "@/config";

export const GET = async (
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) => {
  const { id } = await params;
  const file = await fileUseCase.download(id);
  const response = new Response(await file.arrayBuffer(), {
    status: 200,
    headers: { "Content-Type": file.type },
  });
  return response;
};
