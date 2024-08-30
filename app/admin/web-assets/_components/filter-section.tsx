import { useSearchParams } from "next/navigation";
import CreateWebAssetDialog from "./create-web-asset-dialog";
import { WebAssetFilterQuerySchema } from "@/lib/validators/web-asset";

export default function FilterSection() {
  const searchParms = useSearchParams();
  const { tag } = WebAssetFilterQuerySchema.parse({});
  return (
    <div className="flex items-center">
      <div></div>
      <div className="ml-auto">
        <CreateWebAssetDialog />
      </div>
    </div>
  );
}
