import { Button } from "@/components/ui/button";
import { useFormContext } from "./form-context";
import client from "@/lib/api/client";
import { ApplicationCreateInputSchema } from "@/lib/validators/application";
import useSWRMutation from "swr/mutation";
import { Loader } from "lucide-react";
import { useRouter } from "next/navigation";
import { blobToFile } from "@/lib/utils/file";

export default function Submit() {
  const { application, images } = useFormContext();
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation(
    "/api/applications",
    async () => {
      console.log(application);
      const data = ApplicationCreateInputSchema.parse(application);
      console.log(data);
      const res = await client.api.applications.$post({ json: data });
      const { id } = await res.json();

      await Promise.all(
        images.map(
          async (image) =>
            await client.api.applications[":id"].images.$post({
              form: { file: await blobToFile(image.file), type: image.type },
              param: { id },
            }),
        ),
      );
      return { id };
    },
    {
      onSuccess: ({ id }) => {
        router.push(`/application/success/${id}`);
      },
      throwOnError: true,
    },
  );

  return (
    <div className="py-6 flex items-center justify-center">
      <Button onClick={() => trigger()}>
        Submit {isMutating && <Loader className="w-4 h-4 animate-spin ml-2" />}
      </Button>
    </div>
  );
}
