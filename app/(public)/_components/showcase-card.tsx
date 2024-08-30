import { Showcase } from "@/lib/types/showcase";
import Link from "next/link";
import Image from "next/image";
import routes from "@/config/routes";
import { placeholderImage } from "@/config/image";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { ExternalLink } from "lucide-react";

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
                href={`/showcases/${showcase.id}`}
              >
                <h3 className="text-lg font-normal text-white">
                  {showcase.title}
                </h3>
                <ExternalLink className="ml-2 w-4 h-4 text-white" />
              </Link>
              <div className="flex items-center gap-3">
                {showcase.models.map((model, index) => (
                  <Link href={`/models/profile/${model.id}`} key={index}>
                    <Image
                      className="rounded-md w-[30px] h-[30px] object-cover "
                      width={30}
                      height={30}
                      src={
                        model.profileImage
                          ? routes.getFiles(model.profileImage.id)
                          : placeholderImage
                      }
                      alt={model.name}
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
          src={routes.getFiles(showcase.coverImage?.id!)}
          fill
        />
      </AspectRatio>
    </div>
  );
}
