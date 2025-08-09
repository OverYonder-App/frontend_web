"use client";

export default function ClubsSkeleton() {
  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div className="h-8 w-32 bg-muted rounded" />
        <div className="h-10 w-10 bg-muted rounded-full" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 animate-pulse">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-40 bg-muted rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

