// BaseLayout.tsx
import { ReactNode } from "react";

interface BaseLayoutProps {
  topbar?: ReactNode;
  sidebar?: ReactNode;
  rightSidebar?: ReactNode;
  searchbar?: ReactNode;
  fab?: ReactNode;
  children: ReactNode;
}

export default function BaseLayout({
  topbar,
  sidebar,
  rightSidebar,
  searchbar,
  fab,
  children,
}: BaseLayoutProps) {
  return (
    <div className="flex min-h-screen w-full">
      {sidebar && (
        <aside className="hidden md:block w-64 bg-primary text-white p-4">
          {sidebar}
        </aside>
      )}

      <main className="flex-1 p-4 md:p-6 bg-[#f9f9ff] relative">
        {topbar && <header className="mb-4">{topbar}</header>}
        {searchbar && <div className="mb-6">{searchbar}</div>}

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto] gap-4">
          <section>{children}</section>
          {rightSidebar && (
            <aside className="hidden lg:block w-80">{rightSidebar}</aside>
          )}
        </div>

        {fab && <div className="fixed bottom-6 right-6 z-50">{fab}</div>}
      </main>
    </div>
  );
}
