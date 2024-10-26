import { cn } from "@/lib/utils";
import Image from "next/image";

const sizes = {
  small: 32,
  medium: 60,
  large: 100,
};

export default function UserAvatar({
  user,
  rounded,
  size = "medium",
  width,
  height,
}: {
  user: { name: string; image: { id: string } | null };
  rounded?: boolean;
  size?: "small" | "medium" | "large";
  width?: number;
  height?: number;
}) {
  if (!user.image) {
    return (
      <div
        className={cn(
          "w-[32px] h-[32px] flex items-center justify-center bg-gray-200 rounded text-foreground",
          rounded && "rounded-full"
        )}
        style={{
          width: width || sizes[size] || sizes.medium,
          height: height || sizes[size] || sizes.medium,
          fontSize: width ? `${width * 0.8}px` : "16px",
        }}
      >
        {user.name.charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    <Image
      className={cn("rounded object-cover", rounded && "rounded-full")}
      style={{
        width: width || sizes[size] || sizes.medium,
        height: height || sizes[size] || sizes.medium,
      }}
      src={`/files/${user.image.id}`}
      alt={user.name}
      width={width || sizes[size] || sizes.medium}
      height={height || sizes[size] || sizes.medium}
    />
  );
}
