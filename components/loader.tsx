import { Loader as LoaderIcon } from "lucide-react";
export default function Loader() {
  return (
    <div className="py-4 flex justify-center items-center">
      <LoaderIcon className="w-5 h-5 animate-spin" />
    </div>
  );
}
