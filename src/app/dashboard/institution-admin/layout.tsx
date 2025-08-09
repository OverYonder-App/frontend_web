import React from "react";
import AdminSidebar from "@/components/AdminSidebar";

// export const metadata = {
//   title: "Institution Admin – Campus Events",
// };

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen w-full">
      <AdminSidebar />
      <main className="flex-1 overflow-auto bg-background p-4 md:p-8">
        {children}
      </main>
    </div>
  );
}
