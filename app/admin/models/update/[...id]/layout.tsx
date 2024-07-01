import { cn } from "@/lib/utils";
import { upperFirst } from "lodash";
import Link from "next/link";
import { forms } from "./forms/config";

export default function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string[] };
}) {
  const [modelId, formId] = id;
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 p-4 md:gap-8 md:px-10">
      {/* <div className="mx-auto grid w-full max-w-6xl gap-2"> */}
      {/*   <h1 className="text-3xl font-semibold">Settings</h1> */}
      {/* </div> */}
      <div className="mx-auto grid w-full max-w-6xl items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
        <nav
          className="grid gap-4 text-sm text-muted-foreground"
          x-chunk="dashboard-04-chunk-0"
        >
          {Object.keys(forms).map((form) => (
            <FormLink
              isActive={form === formId}
              modelId={modelId}
              formId={form}
            />
          ))}
          {/* <Link */}
          {/*   href={`/admin/models/update/${modelId}/general`} */}
          {/*   className="font-semibold text-primary" */}
          {/* > */}
          {/*   General */}
          {/* </Link> */}
          {/* <Link href={`/admin/models/update/${modelId}/contact`}>Contact</Link> */}
          {/* <Link href={`/admin/models/update/${modelId}/background`}> */}
          {/*   Background */}
          {/* </Link> */}
          {/* <Link href={`/admin/models/update/${modelId}/identification`}> */}
          {/*   Identification */}
          {/* </Link> */}
          {/* <Link href={`/admin/models/update/${modelId}/address`}>Address</Link> */}
          {/* <Link href={`/admin/models/update/${modelId}/contact`}>Contact</Link> */}
          {/* <Link href={`/admin/models/update/${modelId}/modeling`}> */}
          {/*   Modeling */}
          {/* </Link> */}
          {/* <Link href={`/admin/models/update/${modelId}/measurement`}> */}
          {/*   Measurement */}
          {/* </Link> */}
        </nav>
        <div className="grid gap-6">{children}</div>
      </div>
    </main>
  );
}

const FormLink = ({
  formId,
  isActive,
  modelId,
}: {
  formId: string;
  modelId: string;
  isActive: boolean;
}) => {
  return (
    <Link
      href={`/admin/models/update/${modelId}/${formId}`}
      className={cn(isActive && "font-semibold text-primary")}
    >
      {upperFirst(formId)}
    </Link>
  );
};
