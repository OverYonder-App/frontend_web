export default function Loading() {
  return (
    <div className="p-4 md:p-6 space-y-6 animate-pulse">
      <div className="h-10 w-full max-w-md bg-gray-200 rounded" />
      <div className="h-8 w-1/4 bg-gray-200 rounded" />
      <div className="h-32 bg-gray-200 rounded" />
    </div>
  );
}
