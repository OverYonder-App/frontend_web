export default function Loading() {
  return (
    <div className="min-h-screen bg-[#f9f9ff] p-4 md:p-8 space-y-8 animate-pulse">
      <header className="space-y-4">
        <div className="h-8 w-2/3 bg-gray-200 rounded" />
        <div className="h-10 w-full max-w-md bg-gray-200 rounded" />
      </header>
      <div className="flex border-b">
        {Array.from({ length: 2 }).map((_, i) => (
          <div key={i} className="flex-1 h-10 border-b-2 border-gray-200" />
        ))}
      </div>
      <div className="flex">
        <div className="rounded-md bg-gray-200 p-1 flex gap-1">
          {Array.from({ length: 2 }).map((_, i) => (
            <div key={i} className="h-6 w-16 bg-gray-100 rounded-sm" />
          ))}
        </div>
      </div>
      {Array.from({ length: 3 }).map((_, section) => (
        <section key={section} className="space-y-4">
          <div className="h-6 w-1/3 bg-gray-200 rounded" />
          <div className="flex gap-4 overflow-x-auto">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="min-w-[250px] h-48 bg-gray-200 rounded" />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
