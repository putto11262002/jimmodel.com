import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import SearchModelDialog from "@/components/model/search-model-dialog";
import { Button } from "@/components/ui/button";

import { Showcase } from "@/lib/types/showcase";
import { CirclePlus, X } from "lucide-react";
import { useAddModel } from "@/hooks/queries/showcase";
import ModelProfileList from "@/components/model/model-list";

export default function ModelCard({ showcase }: { showcase: Showcase }) {
  const { mutate } = useAddModel();
  return (
    <Card>
      <CardHeader>
        <CardTitle>Models</CardTitle>
        <div className="ml-auto">
          <SearchModelDialog
            selected={showcase.models.map((model) => ({ id: model.id }))}
            onSelect={(modelId) => mutate({ id: showcase.id, modelId })}
          >
            <Button size={"xs"} className="">
              <CirclePlus className="w-3.5 h-3.5" />{" "}
              <span className="ml-2">Model</span>
            </Button>
          </SearchModelDialog>
        </div>
      </CardHeader>
      <CardContent className="grid gap-4">
        {showcase.models.length ? (
          <ModelProfileList models={showcase.models} />
        ) : (
          <div className="py-4 text-muted-foreground text-sm text-center">
            No model added
          </div>
        )}
      </CardContent>
    </Card>
  );
}
