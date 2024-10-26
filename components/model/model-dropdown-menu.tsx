import { CompactModel } from "@/lib/domains";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import Link from "next/link";
import routes from "@/config/routes";

export default function ModelDropdownMenu({
  trigger,
  model,
}: {
  model: CompactModel;
  trigger: React.ReactNode;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>{trigger}</DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-52">
        <DropdownMenuLabel>Edit</DropdownMenuLabel>
        <DropdownMenuGroup>
          <Link
            href={routes.admin.models["[id]"].personal.main({ id: model.id })}
          >
            <DropdownMenuItem>Personal</DropdownMenuItem>
          </Link>
          <Link
            href={routes.admin.models["[id]"].measurement.main({
              id: model.id,
            })}
          >
            <DropdownMenuItem>Measurement</DropdownMenuItem>
          </Link>

          <Link
            href={routes.admin.models["[id]"].images.profile({
              id: model.id,
            })}
          >
            <DropdownMenuItem>Images</DropdownMenuItem>
          </Link>

          <Link
            href={routes.admin.models["[id]"].settings.main({
              id: model.id,
            })}
          >
            <DropdownMenuItem>Setting</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>

        <DropdownMenuSeparator />
        <Link href={routes.admin.models["[id]"].blocks.main({ id: model.id })}>
          <DropdownMenuItem>Blocks</DropdownMenuItem>
        </Link>

        <Link href={routes.admin.models["[id]"].jobs.main({ id: model.id })}>
          <DropdownMenuItem>Jobs</DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
