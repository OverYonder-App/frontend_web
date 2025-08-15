export default function Loading() {
  return (
    <div className="max-w-xl mx-auto p-6 animate-pulse space-y-4">
      <div className="h-8 bg-gray-200 rounded w-1/3" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="h-10 bg-gray-200 rounded w-full" />
      <div className="h-10 bg-gray-200 rounded w-40" />
    </div>
  );
}
