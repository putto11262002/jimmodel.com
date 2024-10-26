import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import routes from "@/config/routes";
import { BOOKING_STATUS_LABELS, MODEL_CATEGORY } from "@/db/constants";
import { CompactModel } from "@/lib/domains";
import Image from "next/image";
import Link from "next/link";

export default function ModelProfileCard({
  profile,
}: {
  profile: CompactModel;
}) {
  return (
    <Link scroll={true} href={`/models/profile/${profile.id}/book`}>
      <AspectRatio ratio={2 / 3}>
        <div className="relative rounded-md overflow-hidden group w-full h-full">
          <div className="text-center absolute inset-0 w-full h-full z-20 bg-black/50 text-white items-center justify-center group-hover:flex hidden flex-col">
            <p className="font-bold">{profile.name}</p>
            <div className="grid gap-2 mt-4">
              {profile.height && (
                <div>
                  <p className="text-xs">height</p>
                  <p>{profile.height}</p>
                </div>
              )}

              {profile.weight && (
                <div>
                  <p className="text-xs">weight</p>
                  <p>{profile.weight}</p>
                </div>
              )}

              {profile.gender !== MODEL_CATEGORY.MALE && profile.bust && (
                <div>
                  <p className="text-xs">Bust</p>
                  <p>{profile.bust}</p>
                </div>
              )}

              {profile.gender !== MODEL_CATEGORY.FEMALE && profile.chest && (
                <div>
                  <p className="text-xs">Chest</p>
                  <p>{profile.chest}</p>
                </div>
              )}
              {profile.hips && (
                <div>
                  <p className="text-xs">Hips</p>
                  <p>{profile.hips}</p>
                </div>
              )}
            </div>
          </div>
          <div className="absolute bottom-0 w-full p-2 z-10 space-x-2 flex group-hover:hidden">
            <Badge className="shadow-md bg-background text-foreground">
              {BOOKING_STATUS_LABELS[profile.bookingStatus]}
            </Badge>
          </div>
          {profile.profileImageId ? (
            <Image
              src={routes.files.get(profile.profileImageId)}
              alt={profile.name}
              fill
              className="object-cover pointer-events-none"
              sizes="30vw"
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-muted  text-2xl font-semibold">
              {profile.name}
            </div>
          )}
        </div>
      </AspectRatio>
    </Link>
  );
}
