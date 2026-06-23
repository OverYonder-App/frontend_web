"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Clock, RefreshCw, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { supabase } from "@/lib/supabase";

export default function PendingPage() {
  const router = useRouter();
  const { user, signOut } = useUser();
  const [checking, setChecking] = useState(false);

  const institutionPending =
    user?.institution_status === "pending" ||
    user?.institution_status === "rejected";

  // Re-issue the token (which re-runs the JWT hook) and bounce back through the
  // dashboard router; if the institution was approved, the user lands inside.
  const checkAgain = async () => {
    setChecking(true);
    try {
      await supabase.auth.refreshSession();
    } catch {
      /* ignore */
    }
    router.replace("/dashboard");
  };

  const handleSignOut = async () => {
    await signOut();
    router.replace("/login");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5fc] px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <Image
          src="/images/overyonder-logo.png"
          alt="OverYonder"
          width={72}
          height={72}
          className="mx-auto mb-6"
        />
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10">
          <Clock className="text-primary" size={28} />
        </div>

        {institutionPending ? (
          <>
            <h1 className="text-xl font-bold text-primary mb-2">
              Your school is awaiting approval
            </h1>
            <p className="text-sm text-gray-600">
              Your institution has been submitted to OverYonder and is being
              reviewed. You&apos;ll get full access as soon as it&apos;s
              approved — no need to sign up again.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-primary mb-2">
              Your account is pending
            </h1>
            <p className="text-sm text-gray-600">
              You don&apos;t have access to a campus yet. If you just requested
              access for your school, we&apos;ll email you once it&apos;s set
              up.
            </p>
          </>
        )}

        <div className="mt-6 flex flex-col gap-2">
          <Button
            onClick={checkAgain}
            disabled={checking}
            className="w-full bg-primary text-primary-foreground hover:bg-[#624080]"
          >
            <RefreshCw size={16} className={checking ? "animate-spin" : ""} />
            {checking ? "Checking..." : "Check again"}
          </Button>
          <Button
            onClick={handleSignOut}
            variant="outline"
            className="w-full"
          >
            <LogOut size={16} />
            Sign out
          </Button>
        </div>
      </div>
    </div>
  );
}
