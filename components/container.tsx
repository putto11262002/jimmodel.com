export default function Container({ children }: { children: React.ReactNode }) {
  return (
    <main className="p-4 md:px-10">
      <div className="mx-auto w-full max-w-4xl gap-4 grid">{children}</div>
    </main>
  );
}
