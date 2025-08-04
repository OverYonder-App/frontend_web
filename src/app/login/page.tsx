"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { FcGoogle } from "react-icons/fc";
import { TiVendorMicrosoft } from "react-icons/ti";
import Link from "next/link";
import { loginWithPassword } from "./actions";
import { useUser } from "@/context/UserContext";

export default function LoginPage() {
  const router = useRouter();
  const { refreshUser } = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      if (!email.includes("@")) throw new Error("Invalid email");
      console.log("Logging in with password:", email);
      const { user } = await loginWithPassword(email, password);
      await refreshUser();    
      if (error) throw error;
      console.log(error)
      console.log(user);
      router.push("/dashboard");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleMagicLink = async () => {
    setLoading(true);
    setError("");
    try {
      if (!email.includes("@")) throw new Error("Invalid email");
      console.log("Sending magic link to:", email);
      await new Promise((res) => setTimeout(res, 1000));
      alert("Magic link sent to your email");
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const handleOAuth = (provider: string) => {
    console.log("Signing in with:", provider);
    // Replace with your Supabase/NextAuth logic
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f9f5fc] px-6">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
        <Image
          src="/images/overyonder-logo.png"
          alt="OverYonder Logo"
          width={75}
          height={75}
          className="mx-auto mb-6"
        />
        <h1 className="text-2xl font-bold text-[#745296] mb-4">
          Welcome to OverYonder
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Sign in with your school email or provider to get started
        </p>

        <input
          type="email"
          placeholder="School email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#745296] mb-3"
        />
        <input
          type="password"
          placeholder="Password (optional)"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-[#745296] mb-4"
        />

        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}

        <div className="flex flex-col gap-3">
          <Button
            className="w-full bg-[#745296] text-white hover:bg-[#624080]"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In with Password"}
          </Button>
          <Button
            variant="outline"
            className="w-full border-[#745296] text-[#745296] hover:bg-[#f3f0f7]"
            onClick={handleMagicLink}
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Magic Link"}
          </Button>
          <p className="text-sm text-gray-600">
            Don&apos;t have an account? Register{" "}
            <Link className="text-[#745296] underline" href={"/register"}>
              here
            </Link>
          </p>
          <hr className="my-4" />
          <Button
            className="w-full bg-red text-[#745296] hover:text-white hover:bg-[#3367D6]"
            onClick={() => handleOAuth("google")}
          >
            <FcGoogle className="text-xl mr-2" />
            Continue with Google
          </Button>
          <Button
            className="w-full bg-[#2F2F8C] text-white hover:bg-[#1d1d6e]"
            onClick={() => handleOAuth("microsoft")}
          >
            <TiVendorMicrosoft className="text-xl text-white mr-2" />
            Continue with Microsoft
          </Button>
        </div>
      </div>
    </div>
  );
}
