"use client";

export default function UserSkeleton() {
  return (
    <div className="max-w-3xl mx-auto p-6 space-y-6 animate-pulse">
      <div className="flex items-center gap-4">
        <div className="w-24 h-24 bg-gray-200 rounded-full" />
        <div className="flex-1 space-y-2">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="h-4 bg-gray-200 rounded w-1/4" />
        </div>
      </div>
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded w-1/2" />
        <div className="h-4 bg-gray-200 rounded w-1/3" />
      </div>
      <div className="space-y-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" />
        ))}
      </div>
      <div className="space-y-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="h-20 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  );
}
