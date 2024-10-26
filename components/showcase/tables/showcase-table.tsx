import Avatar from "@/components/avatar";
import IconButton from "@/components/icon-button";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import routes from "@/config/routes";
import { Showcase } from "@/lib/domains";
import { Edit } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function ShowcaseTable({
  showcases,
}: {
  showcases: Showcase[];
}) {
  return (
    <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
      {showcases.map((showcase, index) => (
        <div
          className="rounded-lg border overflow-hidden flex flex-col"
          key={index}
        >
          <AspectRatio className="w-full" ratio={3 / 2}>
            {showcase.published && (
              <Badge variant="success" className="top-2 right-2 z-10 absolute">
                Published
              </Badge>
            )}
            <Image
              fill
              src={
                showcase.coverImageId
                  ? routes.files.get(showcase.coverImageId)
                  : "/placeholder.svg"
              }
              alt={showcase.title}
              className="object-cover"
            />
          </AspectRatio>
          <div className="px-4 py-4 grid gap-2 grid-rows-[auto_1fr_auto] grow">
            <p className="font-semibold">{showcase.title}</p>
            <div className="flex items-center gap-2 ">
              {showcase.showcaseModels.map((model, index) => (
                <Avatar
                  name={model.modelName}
                  fileId={model.modelProfileImage}
                  key={index}
                  size="sm"
                />
              ))}
            </div>
            <div className="flex justify-end">
              <Link
                href={routes.admin.website.showcases["[id]"].edit.main({
                  id: showcase.id,
                })}
              >
                <IconButton
                  size="sm"
                  icon={<Edit className="icon-sm" />}
                  text="Edit"
                />
              </Link>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
