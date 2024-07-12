import { fileUseCase } from "@/lib/usecases/file";

export const GET = async (
  request: Request,
  { params: { id } }: { params: { id: string } },
) => {
  const file = await fileUseCase.readFile(id);
  const response = new Response(await file.arrayBuffer(), {
    status: 200,
    headers: { "Content-Type": file.type },
  });
  return response;
};
