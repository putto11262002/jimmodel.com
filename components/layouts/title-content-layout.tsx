export default function TitleContentLayout({
  title,
  children,
  subtitle,
}: {
  children: React.ReactNode;
  title: React.ReactNode;
  subtitle?: React.ReactNode;
}) {
  return (
    <div className="grid gap-6">
      <div className="grid gap-2">
        {title}
        {subtitle}
      </div>
      {children}
    </div>
  );
}
