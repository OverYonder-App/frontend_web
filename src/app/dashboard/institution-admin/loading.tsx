export default function Loading() {
  return (
    <div className="p-6 animate-pulse grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="h-40 bg-muted rounded-2xl" />
      ))}
    </div>
  );
}
