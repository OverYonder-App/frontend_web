"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

// Reached after the recovery link → /auth/callback established a session.
// The user sets a new password via updateUser.
export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (password.length < 6) throw new Error("Password must be at least 6 characters");
      if (password !== confirm) throw new Error("Passwords do not match");
      const { error } = await supabase.auth.updateUser({ password });
      if (error) throw error;
      setDone(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5fc] px-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <Image
          src="/images/overyonder-logo.png"
          alt="OverYonder"
          width={72}
          height={72}
          className="mx-auto mb-6"
        />
        <h1 className="text-2xl font-bold text-primary mb-2">
          Set a new password
        </h1>

        {done ? (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Your password has been updated. You can continue to your dashboard.
            </p>
            <Button
              onClick={() => router.replace("/dashboard")}
              className="w-full bg-primary text-primary-foreground hover:bg-[#624080]"
            >
              Continue
            </Button>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Choose a new password for your account.
            </p>
            <input
              type="password"
              placeholder="New password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-3"
            />
            <input
              type="password"
              placeholder="Confirm new password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-[#624080]"
            >
              {loading ? "Saving..." : "Update password"}
            </Button>
          </>
        )}
      </div>
    </div>
  );
}
