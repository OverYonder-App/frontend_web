export default function Loading() {
  return (
    <div className="p-4 md:p-8 space-y-6">
      <div className="h-8 w-1/3 bg-gray-200 rounded animate-pulse" />
      <div className="space-y-4">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="h-48 bg-gray-200 rounded animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
