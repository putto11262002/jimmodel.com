import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import routes from "@/config/routes";
import { BOOKING_STATUS_LABELS } from "@/db/constants";
import { CompactModel } from "@/lib/domains";
import { upperFirst } from "lodash";
import Image from "next/image";

export default async function OverviewSection({
  model,
}: {
  model: CompactModel;
}) {
  return (
    <>
      <div className="flex items-center flex-col justify-center gap-2">
        <h1 className="text-xl md:text-2xl font-bold text-center">
          {model.name}
        </h1>

        <Badge variant={"outline"}>
          {BOOKING_STATUS_LABELS[model.bookingStatus]}
        </Badge>
      </div>
      <div className="grid grid-cols-2 gap-4 md:gap-8 mt-4 md:mt-8">
        <AspectRatio ratio={2 / 3}>
          <Card className="h-full">
            {/* <CardHeader> */}
            {/*   <CardTitle className="text-center">{model.name}</CardTitle> */}
            {/* </CardHeader> */}
            <CardContent className="h-full box-border p-4 md:p-6 flex justify-center items-center flex-col gap-2 md:gap-6 font-medium ">
              {model.height && (
                <div className="grid text-center">
                  <p className="text-xs text-muted-foreground">Height</p>
                  <p className="text-sm md:text-base">{model.height}</p>
                </div>
              )}

              {model.weight && (
                <div className="grid text-center">
                  <p className="text-xs text-muted-foreground">Weight</p>
                  <p className="text-sm md:text-base">{model.weight}</p>
                </div>
              )}

              {model.bust && model.gender !== "male" && (
                <div className="grid text-center">
                  <p className="text-xs text-muted-foreground">Bust</p>
                  <p className="text-sm md:text-base">{model.bust}</p>
                </div>
              )}
              {model.chest && model.gender !== "female" && (
                <div className="grid text-center">
                  <p className="text-xs text-muted-foreground">Chest</p>
                  <p className="text-sm md:text-base">{model.chest}</p>
                </div>
              )}
              {model.hips && (
                <div className="grid text-center">
                  <p className="text-xs text-muted-foreground">Hips</p>
                  <p className="text-sm md:text-base">{model.hips}</p>
                </div>
              )}
              {model.hairColor && (
                <div className="grid text-center">
                  <p className="text-xs text-muted-foreground">Hair Color</p>
                  <p className="text-sm md:text-base">
                    {upperFirst(model.hairColor)}
                  </p>
                </div>
              )}

              {model.eyeColor && (
                <div className="grid text-center">
                  <p className="text-xs text-muted-foreground">Eye Color</p>
                  <p className="text-sm md:text-base">
                    {upperFirst(model.eyeColor)}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </AspectRatio>
        <AspectRatio ratio={2 / 3}>
          <Card className="h-full">
            <CardContent className="p-4 md:p-6 h-full">
              <div className="relative h-full w-full rounded-md overflow-hidden">
                {model.profileImageId ? (
                  <Image
                    src={routes.getFiles(model.profileImageId)}
                    alt={model.name}
                    fill
                    className="object-cover pointer-events-none"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full w-full bg-muted  text-2xl font-semibold">
                    {model.name}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </AspectRatio>
      </div>
    </>
  );
}
