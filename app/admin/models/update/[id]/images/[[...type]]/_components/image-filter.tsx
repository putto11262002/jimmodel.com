"use client";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectItem,
  SelectContent,
} from "@/components/ui/select";
import { modelImageTypes } from "@/db/schemas/model-images";
import { upperFirst } from "lodash";
import { useParams, usePathname, useRouter } from "next/navigation";

const modelImageMenuItems = [
  { label: "All", href: (id: string) => `/admin/models/update/${id}/images` },
  {
    label: "Profile",
    href: (id: string) => `/admin/models/update/${id}/images/profile`,
  },
  ...modelImageTypes.map((type) => ({
    label: upperFirst(type),
    href: (id: string) => `/admin/models/update/${id}/images/${type}`,
  })),
];

export default function ImageFilter() {
  const path = usePathname();
  const router = useRouter();
  const { id } = useParams<{ id: string }>();

  return (
    <Select onValueChange={(value) => router.push(value)} defaultValue={path}>
      <SelectTrigger className="min-w-[110px] h-7">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {modelImageMenuItems.map(({ label, href }, index) => (
          <SelectItem key={index} value={href(id)}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
