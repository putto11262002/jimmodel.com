import { UserWithoutSecrets } from "@/lib/types/user";
import { cn } from "@/lib/utils";
import { placeholder } from "drizzle-orm";
import Image from "next/image";

const sizes = {
  xs: 15,
  small: 32,
  medium: 60,
  large: 100,
};

type AvatarProps = {
  fileId?: string | null;
  name: string;
  rounded?: boolean;
  size?: "xs" | "small" | "medium" | "large";
  width?: number;
  height?: number;
};

export default function Avatar(props: AvatarProps) {
  const width = props.width || sizes[props.size || "medium"];
  const height = props.height || sizes[props.size || "medium"];
  if (!props.fileId) {
    return (
      <div
        className={cn(
          "w-[32px] h-[32px] flex items-center justify-center bg-gray-200 rounded text-foreground",
          props.rounded && "rounded-full",
        )}
        style={{
          width: props.width || sizes[props.size || "medium"],
          height: props.height || sizes[props.size || "medium"],
          fontSize: props.width
            ? `${props.width * 0.8}px`
            : sizes[props.size || "medium"] * 0.8,
        }}
      >
        {props.name.charAt(0).toUpperCase()}
      </div>
    );
  }
  return (
    <div
      className="relative"
      style={{
        width: props.width || sizes[props.size || "medium"],
        height: props.height || sizes[props.size || "medium"],
      }}
    >
      <Image
        className={cn("rounded object-cover", props.rounded && "rounded-full")}
        src={`/files/${props.fileId}`}
        alt={props.name}
        fill
      />
    </div>
  );
}
