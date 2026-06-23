"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import Image from "next/image";
import { supabase } from "@/lib/supabase";
import { Button } from "@/components/ui/button";
import { UIErrorMessage } from "@/components/UIErrorComponent";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function RegistrationPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  // True when Supabase requires the user to confirm their email before they
  // can sign in (i.e. no session was returned from signUp).
  const [needsConfirmation, setNeedsConfirmation] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setError("");
    setLoading(true);
    try {
      if (!form.email.includes("@")) throw new Error("Invalid email address");
      if (form.password.length < 6) throw new Error("Password too short");
      if (form.password !== form.confirm)
        throw new Error("Passwords do not match");

      const { data, error: signUpError } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          // Route through /auth/callback (not middleware-gated) so the
          // confirmation code is exchanged for a session before landing on the
          // gated /onboarding route.
          emailRedirectTo: `${window.location.origin}/auth/callback?next=/onboarding`,
        },
      });
      if (signUpError) throw signUpError;

      setNeedsConfirmation(!data.session);
      setDialogOpen(true);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  const eventCards = [
    {
      title: "Open Mic Night 🎤",
      description: "Share your voice at our cozy campus cafe stage.",
      date: "Sept 6 • 6:00PM",
      location: "McCain Student Union",
      school: "College of Idaho",
    },
    {
      title: "Club Fair 🍂",
      description: "Meet student orgs and grab free snacks & swag.",
      date: "Sept 8 • 1:00PM",
      location: "Quad Lawn",
      school: "CUI",
    },
    {
      title: "STEM Mixer 👩‍🔬",
      description: "Women in tech networking night with alumni.",
      date: "Sept 12 • 5:00PM",
      location: "Boone Atrium",
      school: "Yote Life",
    },
    {
      title: "Leadership Summit 🧠",
      description: "Join top student leaders for a strategy bootcamp.",
      date: "Sept 15 • 10:00AM",
      location: "Innovation Hall",
      school: "College of Idaho",
    },
    {
      title: "Cultural Night 🌍",
      description: "Celebrate global diversity with music, food, and dance.",
      date: "Sept 20 • 7:00PM",
      location: "Main Auditorium",
      school: "CUI",
    },
    {
      title: "Startup Pitch Night 💡",
      description: "Students pitch ideas to local investors and mentors.",
      date: "Sept 22 • 6:00PM",
      location: "Business Building",
      school: "Yote Life",
    },
    {
      title: "Yote Wellness Expo 🧘",
      description:
        "Explore student wellness resources and grab a self-care kit.",
      date: "Sept 24 • 11:00AM",
      location: "Wellness Center Lawn",
      school: "College of Idaho",
    },
    {
      title: "Game Night 🎮",
      description: "Board games, Switch tournaments, and free pizza!",
      date: "Sept 26 • 7:00PM",
      location: "Student Commons",
      school: "CUI",
    },
    {
      title: "Outdoor Movie Night 🎬",
      description: "Catch a classic under the stars — bring your own blanket.",
      date: "Sept 28 • 8:30PM",
      location: "Athletic Field",
      school: "Yote Life",
    },
    {
      title: "Resume Workshop 📄",
      description: "1-on-1 reviews with career counselors and resume tips.",
      date: "Sept 30 • 2:00PM",
      location: "Career Services",
      school: "College of Idaho",
    },
  ];

  return (
    <>
      <div className="min-h-screen grid grid-cols-1 md:grid-cols-2 bg-[#f9f5fc]">
        {/* Masonry Floating Event Cards */}
        <div className="hidden md:block bg-gradient-to-br from-primary to-accent relative overflow-hidden px-4 py-8 h-screen">
          <div className="absolute inset-0 columns-2 gap-6 px-2 space-y-6">
            {eventCards.map((event, i) => (
              <motion.div
                key={i}
                className="w-3/4 break-inside-avoid gap-6 bg-white/80 text-left rounded-xl shadow-lg backdrop-blur-md border border-white p-4 relative"
                style={{ top: "100%", left: `${(i % 2) * 50}%` }}
                animate={{ y: ["-650%", "0%"] }}
                transition={{
                  duration: 20 + i * 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 2,
                }}
              >
                <h4 className="text-md font-semibold text-primary mb-1">
                  {event.title}
                </h4>
                <p className="text-xs text-gray-700 mb-1">
                  {event.description}
                </p>
                <p className="text-xs text-gray-500">📅 {event.date}</p>
                <p className="text-xs text-gray-500">📍 {event.location}</p>
                <p className="text-xs text-gray-500 italic">
                  🏫 {event.school}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Registration Form */}
        <div className="flex items-center justify-center px-6 py-12">
          <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 text-center">
            <Image
              src="/images/overyonder-logo.png"
              alt="OverYonder Logo"
              width={100}
              height={100}
              className="mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-primary mb-2">
              Create an Account
            </h1>
            <p className="text-sm text-gray-600 mb-6">
              Join your campus and start exploring events
            </p>

            <input
              type="email"
              name="email"
              placeholder="School email"
              value={form.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-3"
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-3"
            />
            <input
              type="password"
              name="confirm"
              placeholder="Confirm Password"
              value={form.confirm}
              onChange={handleChange}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary mb-4"
            />

            <UIErrorMessage message={error} />

            <Button
              className="w-full bg-primary text-white hover:bg-[#624080]"
              onClick={handleRegister}
              disabled={loading}
            >
              {loading ? "Registering..." : "Sign Up"}
            </Button>

            <p className="text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <a href="/login" className="text-primary font-medium">
                Log in
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Dialog Box */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="text-center">
          <DialogHeader>
            <DialogTitle className="text-primary text-xl">
              {needsConfirmation
                ? "📩 Confirm your email"
                : "🎉 Registration Successful!"}
            </DialogTitle>
          </DialogHeader>
          {needsConfirmation ? (
            <>
              <p className="text-sm text-gray-700 mt-2">
                We’ve sent a confirmation link to{" "}
                <span className="font-medium">{form.email}</span>. Click it to
                activate your account, then sign in.
              </p>
              <Button
                className="mt-6 w-full bg-primary text-white hover:bg-[#624080]"
                onClick={() => router.push("/login")}
              >
                Go to Login
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-gray-700 mt-2">
                Your account has been created. You’ll now be redirected to
                onboarding.
              </p>
              <Button
                className="mt-6 w-full bg-primary text-white hover:bg-[#624080]"
                onClick={() => router.push("/onboarding")}
              >
                Go to Onboarding
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}
