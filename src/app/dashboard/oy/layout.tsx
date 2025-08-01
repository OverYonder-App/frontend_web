import React from "react";
import OYAdminSidebar from "@/components/OYAdminSidebar";

export default function OYAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex">
      <OYAdminSidebar />
      <main className="flex-1 min-h-[calc(100vh-59px)] ">{children}</main>
    </div>
  );
}
