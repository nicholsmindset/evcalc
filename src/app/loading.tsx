export default function Loading() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="animate-pulse space-y-6">
        <div className="h-10 w-2/3 rounded-lg bg-bg-secondary" />
        <div className="h-5 w-1/2 rounded-lg bg-bg-secondary" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-xl border border-border bg-bg-secondary" />
          ))}
        </div>
      </div>
    </div>
  );
}
