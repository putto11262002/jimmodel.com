export default function InfoField({
  label,
  value,
}: {
  label: string;
  value: number | string | undefined | null;
}) {
  return (
    <div className="">
      <strong>{label}</strong>
      {value ? (
        <p>{value}</p>
      ) : (
        <p className="text-muted-foreground">Unavailable</p>
      )}
    </div>
  );
}
