"use client";
import { removeModelExperienceAction } from "@/actions/model";
import DataTable from "@/components/data-table";
import { Button } from "@/components/ui/button";
import useActionToast from "@/hooks/use-action-toast";
import { ModelExperience } from "@/lib/domains";
import { Loader2, X } from "lucide-react";
import { useState } from "react";
import { useFormState } from "react-dom";

export default function ModelExperienceTable({
  experiences,
}: {
  experiences: ModelExperience[];
}) {
  const [state, action, pending] = useFormState(removeModelExperienceAction, {
    status: "idle",
  });

  useActionToast({ state });

  const [deletingExperience, setDeletingExperience] = useState<string | null>(
    null
  );

  return (
    <DataTable
      columns={
        [
          { key: "year", header: "Year" },
          { key: "product", hedaer: "Product" },
          { key: "media", header: "Media" },
          { key: "country", header: "Country" },
          { key: "delete", hideHeader: true },
        ] as const
      }
      data={experiences.map((experience) => ({
        year: experience.year,
        product: experience.product,
        media: experience.media,
        country: experience.country,
        delete:
          deletingExperience && deletingExperience === experience.id ? (
            <Button size="icon" variant="ghost">
              <Loader2 className="w-4 h-4 animate-spin" />
            </Button>
          ) : (
            <form
              onSubmit={(e) =>
                setDeletingExperience(
                  new FormData(e.target as HTMLFormElement).get("id") as string
                )
              }
              action={action}
            >
              <input type="hidden" name="id" value={experience.id} />
              <Button
                disabled={pending}
                type="submit"
                variant={"ghost"}
                size="icon"
              >
                <X className="w-4 h-4" />
              </Button>
            </form>
          ),
      }))}
    />
  );
}
