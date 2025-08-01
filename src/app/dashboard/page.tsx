"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "@/constants/roles";

export default function DashboardRouter() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    console.log(user)

    const role = user?.role_type as UserRole | undefined;

    if (role === UserRole.STUDENT || role === UserRole.STUDENT_LEADER) {
      router.replace("/dashboard/student");
    } else if (role === UserRole.FACULTY) {
      router.replace("/dashboard/faculty");
    } else if (role === UserRole.INSTITUTION_ADMIN) {
      router.replace("/dashboard/institution-admin");
    } else if (role === UserRole.OY_ADMIN) {
      router.replace("/dashboard/oy");
    } else {
      router.replace("/unauthorized");
    }
  }, [user, loading, router]);

  return <div className="p-8 text-center">Loading...</div>;
}
