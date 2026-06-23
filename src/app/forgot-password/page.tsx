"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async () => {
    setLoading(true);
    setError("");
    try {
      if (!email.includes("@")) throw new Error("Enter a valid email");
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/callback?next=/reset-password`,
      });
      if (error) throw error;
      setSent(true);
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
          Reset your password
        </h1>

        {sent ? (
          <>
            <p className="text-sm text-gray-600 mb-6">
              If an account exists for <span className="font-medium">{email}</span>,
              we&apos;ve sent a link to reset your password. Check your inbox.
            </p>
            <Link href="/login" className="text-primary underline text-sm">
              Back to login
            </Link>
          </>
        ) : (
          <>
            <p className="text-sm text-gray-600 mb-6">
              Enter your school email and we&apos;ll send you a reset link.
            </p>
            <input
              type="email"
              placeholder="School email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />
            {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
            <Button
              onClick={handleSubmit}
              disabled={loading}
              className="w-full bg-primary text-primary-foreground hover:bg-[#624080]"
            >
              {loading ? "Sending..." : "Send reset link"}
            </Button>
            <p className="text-sm text-gray-600 mt-4">
              <Link href="/login" className="text-primary underline">
                Back to login
              </Link>
            </p>
          </>
        )}
      </div>
    </div>
  );
}
