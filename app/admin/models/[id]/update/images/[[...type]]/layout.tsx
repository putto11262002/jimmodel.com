import ImageFilter from "./_components/image-filter";
import FileUpload from "./_components/file-upload-modal";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Layout({
  children,
  params: { id, type },
}: {
  children: React.ReactNode;
  params: { id: string; type?: string[] };
}) {
  return (
    <div className="flex flex-col gap-4 ">
      <div className="flex items-center">
        <div>
          <ImageFilter />
        </div>
        <div className="ml-auto">
          <FileUpload modelId={id} />
        </div>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Images</CardTitle>
        </CardHeader>
        <CardContent>{children}</CardContent>
      </Card>
    </div>
  );
}
