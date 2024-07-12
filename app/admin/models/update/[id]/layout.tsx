import FormLink from "./_components/form-link";
import Header from "./_components/header";

const formMenuItems: Record<string, string | undefined> = {
  general: undefined,
  contact: undefined,
  background: undefined,
  identification: undefined,
  address: undefined,
  modeling: undefined,
  measurement: undefined,
  images: undefined,
  tags: undefined,
  settings: undefined,
};

export default async function Layout({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) {
  return (
    <main className="flex min-h-[calc(100vh_-_theme(spacing.16))] flex-1 flex-col gap-4 bg-muted/40 px-4 md:gap-8 md:px-10">
      <div className="w-full max-w-6xl flex flex-col gap-6">
        <Header id={id} />
        <div className="grid items-start gap-6 md:grid-cols-[180px_1fr] lg:grid-cols-[250px_1fr]">
          <nav
            className="grid gap-4 text-sm text-muted-foreground"
            x-chunk="dashboard-04-chunk-0"
          >
            {Object.entries(formMenuItems).map(([formId, path]) => (
              <FormLink
                key={formId}
                label={formId}
                modelId={id}
                formId={path ? path : formId}
              />
            ))}
          </nav>
          <div className="grid gap-6">{children}</div>
        </div>
      </div>
    </main>
  );
}
