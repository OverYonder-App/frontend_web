"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { UserRole } from "@/constants/roles";
import { LoaderIcon } from "lucide-react";
import { motion } from "framer-motion";

export default function DashboardRouter() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const [delayedLoading, setDelayedLoading] = useState(true);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setDelayedLoading(false);
      }, 1000); // wait 1 second after loading becomes false

      return () => clearTimeout(timer);
    }
  }, [loading]);

  useEffect(() => {
    if (delayedLoading) return;

    const role = user?.role_type as UserRole | undefined;
    if (role === UserRole.STUDENT || role === UserRole.STUDENT_LEADER) {
      router.replace("/dashboard/student");
    } else if (role === UserRole.FACULTY) {
      router.replace("/dashboard/faculty");
    } else if (role === UserRole.INSTITUTION_ADMIN) {
      router.replace("/dashboard/institution-admin");
    } else if (role === UserRole.OY_ADMIN) {
      router.replace("/dashboard/oy");
    } else if (role === UserRole.PENDING || !role) {
      router.replace("/pending");
    } else {
      router.replace("/unauthorized");
    }
  }, [user, router, delayedLoading]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-primary text-white px-4">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        className="mb-6"
      >
        <LoaderIcon className="h-16 w-16 text-white drop-shadow-xl" />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.6 }}
        className="text-2xl font-bold mb-2"
      >
        Setting up your campus dashboard...
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="text-sm opacity-80"
      >
        Welcome to OverYonder — bringing campus life to your fingertips.
      </motion.p>
    </div>
  );
}
