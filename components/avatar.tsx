import routes from "@/config/routes";
import { cn } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { Tooltip, TooltipContent, TooltipTrigger } from "./ui/tooltip";

const sizes = {
  xxs: 12,
  xs: 18,
  sm: 32,
  md: 60,
  lg: 100,
  xl: 200,
} as const;

export type BaseProps = {
  name: string;
  url?: string;
  rounded?: boolean;
  size?: keyof typeof sizes;
};

export type AvatarProps =
  | ({
      src?: string;
    } & BaseProps)
  | ({ fileId?: string | null } & BaseProps);

export default function Avatar(props: AvatarProps) {
  const width = sizes[props.size || "md"];
  const height = sizes[props.size || "md"];

  const src =
    "fileId" in props && props.fileId
      ? routes.getFiles(props.fileId)
      : "src" in props && props.src !== undefined
      ? props.src
      : undefined;
  if (props.url) {
    return (
      <Link href={props.url}>
        {src ? (
          <ImageAvatar {...props} src={src} width={width} height={height} />
        ) : (
          <PlaceholderAvatar
            name={props.name}
            rounded={props.rounded}
            width={width}
            height={height}
          />
        )}
      </Link>
    );
  }
  return (
    <>
      {src ? (
        <ImageAvatar {...props} src={src} width={width} height={height} />
      ) : (
        <PlaceholderAvatar
          name={props.name}
          rounded={props.rounded}
          width={width}
          height={height}
        />
      )}
    </>
  );
}

function ImageAvatar({
  src,
  rounded,
  width,
  height,
  name,
}: Pick<AvatarProps, "rounded" | "name"> & {
  width: number;
  height: number;
  src: string;
}) {
  return (
    <div
      className="relative"
      style={{
        width: width,
        height: height,
      }}
    >
      <Image
        className={cn("rounded object-cover", rounded && "rounded-full")}
        src={src}
        alt={name}
        fill
      />
    </div>
  );
}

function PlaceholderAvatar({
  rounded,
  width,
  height,
  name,
}: Pick<AvatarProps, "rounded" | "name"> & { width: number; height: number }) {
  return (
    <div
      className={cn(
        "flex items-center justify-center bg-gray-200 rounded text-gray-700 dark:bg-gray-700 dark:text-gray-200",
        rounded && "rounded-full"
      )}
      style={{
        width: width,
        height: height,
        fontSize: `${width * 0.8}px`,
      }}
    >
      {name.charAt(0).toUpperCase()}
    </div>
  );
}
