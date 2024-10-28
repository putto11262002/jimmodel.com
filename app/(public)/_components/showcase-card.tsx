import Link from "next/link";
import Image from "next/image";
import routes from "@/config/routes";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ExternalLink } from "lucide-react";
import { Showcase } from "@/lib/domains";

export default function ShowcaseCard({ showcase }: { showcase: Showcase }) {
  return (
    <div className="rounded-md overflow-hidden">
      <AspectRatio
        className="relative rounded-md overflow-hidden group"
        ratio={3 / 2}
      >
        <div className="absolute z-10 group-hover:block hidden w-full bottom-0 bg-gradient-to-t from-gray-900  to-white-900/5 h-full py-4 px-6">
          <div className="relative w-full h-full flex flex-col justify-end">
            <div className="grid gap-3">
              <Link
                className="flex items-center"
                href={routes.showcases.profile(showcase.id)}
              >
                <h3 className="text-lg font-normal text-white">
                  {showcase.title}
                </h3>
                <ExternalLink className="ml-2 w-4 h-4 text-white" />
              </Link>
              <div className="flex items-center gap-3">
                {showcase.showcaseModels.map((model, index) => (
                  <Link
                    href={
                      model.modelId
                        ? routes.models.profile.main(model.modelId)
                        : "#"
                    }
                    key={index}
                  >
                    <Image
                      className="rounded-md w-[30px] h-[30px] object-cover "
                      width={30}
                      height={30}
                      src={
                        model.modelProfileImage
                          ? routes.files.get(model.modelProfileImage)
                          : "/placeholder.svg"
                      }
                      alt={model.modelName}
                    />
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>
        <Image
          className="object-cover"
          alt={showcase.title}
          src={routes.files.get(showcase.coverImageId!)}
          fill
        />
      </AspectRatio>
    </div>
  );
}
