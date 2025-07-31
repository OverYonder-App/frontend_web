// src/components/Unauthorized.tsx
'use client'
import Link from "next/link";
import { Button } from "./ui/button";
import { LockKeyhole, LogIn } from "lucide-react";
import { supabase } from "@/lib/supabase";

export default function Unauthorized() {
   const handleLogout = async () => {
     await supabase.auth.signOut();
     window.location.href = "/login";
   };
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-[#f9f9ff]">
      <div className="bg-white shadow-lg rounded-2xl p-10 max-w-md w-full">
        <div className="flex items-center justify-center w-14 h-14 rounded-full bg-[#eee6f7] text-[#745296] mx-auto mb-4">
          <LockKeyhole size={28} />
        </div>
        <h1 className="text-2xl font-bold text-[#745296] mb-2">
          You Shall Not Pass
        </h1>
        <p className="text-sm text-gray-600 mb-6">
          Looks like you don't have permission to view this page. If you think
          this is a mistake, try logging in again.
        </p>
        <Link href="/login">
          <Button className="w-full bg-[#745296] hover:bg-[#684287]">
            <LogIn onClick={handleLogout} size={16} className="mr-2" /> Return to Login
          </Button>
        </Link>
      </div>
    </div>
  );
}
