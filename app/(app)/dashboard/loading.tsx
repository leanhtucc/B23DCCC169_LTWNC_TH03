export default function Loading() {
  return (
    <div className="space-y-3" aria-busy="true">
      <div className="h-8 w-64 animate-pulse rounded bg-gray-200" />
      {Array.from({ length: 5 }).map((_, i) => (
        <div key={i} className="h-16 animate-pulse rounded-lg bg-gray-200" />
      ))}
    </div>
  );
}
