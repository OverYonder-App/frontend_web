"use client"

export default function EventSkeleton() {
  return (
    <div className="max-w-3xl mx-auto py-8 animate-pulse space-y-4">
      <div className="w-full h-64 bg-gray-200 rounded" />
      <div className="h-8 bg-gray-200 rounded w-2/3" />
      <div className="h-4 bg-gray-200 rounded w-full" />
      <div className="h-4 bg-gray-200 rounded w-1/2" />
      <div className="space-y-2 mt-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="h-4 bg-gray-200 rounded" />
        ))}
      </div>
    </div>
  )
}
