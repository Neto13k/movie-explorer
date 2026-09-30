export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div role="status" className="relative h-12 w-12 animate-spin">
        <div className="absolute left-0 top-0 h-4 w-4 rounded-full bg-accent" />
        <div className="absolute bottom-0 right-0 h-4 w-4 rounded-full bg-foreground" />
        <span className="sr-only">Carregando…</span>
      </div>
    </div>
  );
}