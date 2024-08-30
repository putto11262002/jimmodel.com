import { AspectRatio } from "@/components/ui/aspect-ratio";
import { Badge } from "@/components/ui/badge";
import { ModelProfile } from "@/lib/types/model";
import Image from "next/image";
import Link from "next/link";

export default function ModelProfileCard({
  profile,
}: {
  profile: ModelProfile;
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

              {profile.gender !== "male" && profile.bust && (
                <div>
                  <p className="text-xs">Bust</p>
                  <p>{profile.bust}</p>
                </div>
              )}

              {profile.gender !== "female" && profile.chest && (
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
            {profile.local && (
              <Badge className="shadow-md bg-background text-foreground">
                Local
              </Badge>
            )}
            {!profile.local && profile.inTown && (
              <Badge className="shadow-md bg-background text-foreground">
                In Town
              </Badge>
            )}
            {!profile.local && !profile.inTown && profile.directBooking && (
              <Badge className="shadow-md bg-background text-foreground">
                Direct Booking
              </Badge>
            )}
          </div>
          {profile.profileImage ? (
            <Image
              src={`/files/${profile.profileImage.id}`}
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
