"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";

export default function DashboardRouter() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const role = user?.role_type;

    if (role === "Student" || role === "Student Leader") {
      router.replace("/dashboard/student");
    } else if (role === "Faculty") {
      router.replace("/dashboard/faculty");
    } else if (role === "Institution Admin") {
      router.replace("/dashboard/institution-admin");
    } else if (role === "OY Admin") {
      router.replace("/dashboard/oy-admin");
    } else {
      router.replace("/unauthorized");
    }
  }, [user, loading, router]);

  return <div className="p-8 text-center">Loading...</div>;
}
