"use client";
import Loader from "@/components/loader";
import AddTalentDialog from "@/components/model/add-talent-dialog";
import TalentTable from "@/components/model/talent-table";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import permissions from "@/config/permission";
import { useGetModel, useUpdateModel } from "@/hooks/queries/model";
import useSession from "@/hooks/use-session";
import { Model } from "@/lib/types/model";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useFieldArray, useForm } from "react-hook-form";
import { z } from "zod";
export default function Page({ params: { id } }: { params: { id: string } }) {
  const session = useSession(permissions.models.getModelById);
  const { data, isPending } = useGetModel({
    modelId: id,
    enabled: session.status === "authenticated",
  });
  if (isPending || !data) {
    return <Loader />;
  }
  return <PageContent model={data} />;
}

const FormSchema = z.object({
  talents: z.array(z.object({ talent: z.string() })),
});

function PageContent({ model }: { model: Model }) {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      talents: model?.talents?.map((talent) => ({ talent })) || [],
    },
  });
  const talents = useFieldArray({
    control: form.control,
    name: "talents",
  });

  const { mutate, isPending } = useUpdateModel();

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between">
          <CardTitle>Talents</CardTitle>
          <AddTalentDialog
            onSubmit={({ talent }) => talents.append({ talent })}
          >
            <Button className="h-7 px-2" variant={"outline"}>
              <Plus className="w-3.5 h-3.5 text-foreground" />
            </Button>
          </AddTalentDialog>
        </div>
      </CardHeader>
      <CardContent>
        <TalentTable
          onRemove={({ index }) => talents.remove(index)}
          talents={talents.fields.map(({ talent }) => talent)}
        />
      </CardContent>
      <CardFooter className="py-4 border-t">
        <Button
          onClick={() =>
            mutate({
              modelId: model.id,
              input: { talents: talents.fields.map(({ talent }) => talent) },
            })
          }
          disabled={isPending}
        >
          Save
        </Button>
      </CardFooter>
    </Card>
  );
}
