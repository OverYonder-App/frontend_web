"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import HomeHeader from "@/components/homepage/Header";
import HomeFooter from "@/components/homepage/Footer";
import FloatingCards from "@/components/FloatingCards";
import { useState } from "react";

export default function Home() {
  const roles = {
    student: {
      label: "🎉 Student",
      content:
        "Discover events curated for you. RSVP instantly, get reminders, and stay connected with your campus community.",
    },
    leader: {
      label: "📣 Leader",
      content:
        "Create and promote events for your club or group. Track attendance and build a presence.",
    },
    admin: {
      label: "🏛️ Admin",
      content:
        "Manage and approve all campus events. Post announcements and monitor student engagement.",
    },
  };

  const faqs = [
    {
      question: "Do I need to register my school?",
      answer:
        "No. If your school is already using OverYonder, you can join with your student email. If not, request access and we’ll help onboard your institution.",
    },
    {
      question: "Can I use this without being in a club?",
      answer:
        "Yes! OverYonder is designed for every student to discover events, RSVP, and participate in campus life — club or no club.",
    },
    {
      question: "How do I get my org on OverYonder?",
      answer:
        "It’s easy. Just sign in, go to the Organizations tab, and submit a request. Admins will review and approve your group.",
    },
  ];

  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggle = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };
  
  const [active, setActive] = useState<keyof typeof roles>("student");


  return (
    <>
      <HomeHeader />
      <main className="flex flex-col items-center justify-center min-h-screen pt-0 pb-0 px-6 py-12 bg-white text-[#745296]">
        <section className="relative w-full h-[calc(100vh-60px)] flex flex-col justify-center text-center overflow-hidden">
          {/* Background video */}
          <FloatingCards />

          {/* White translucent overlay */}
          <div className="absolute top-0 left-0 w-full h-full bg-white opacity-70 z-[1]" />

          {/* Foreground content */}
          <h1 className="text-5xl font-extrabold tracking-tight mb-4 z-10">
            🎓 Your Campus, Reimagined
          </h1>
          <p className="text-lg text-gray-600 mb-8 z-10">
            The all-in-one platform for students, clubs, and institutions to
            connect and engage.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12 z-10">
            <Button
              className="bg-[#745296] text-white hover:bg-[#624080]"
              asChild
            >
              <Link href="/login">I'm a Student / Faculty</Link>
            </Button>
            <Button
              variant="outline"
              className=" text-[#745296] hover:text-white hover:bg-[#745296]"
              asChild
            >
              <Link href="/onboarding">I'm an Institution Admin</Link>
            </Button>
          </div>
        </section>

        <section className="w-full bg-[#f9f5fc] py-20">
          <div className="max-w-5xl mx-auto text-center">
            <h2 className="text-3xl font-extrabold text-[#745296] mb-6 tracking-tight">
              Trusted by Institutions Who Believe in Student Leadership
            </h2>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-8">
              <img
                src="/images/college-of-idaho-logo.png"
                alt="College of Idaho Logo"
                className="h-16 w-auto grayscale hover:grayscale-0 transition duration-300"
              />
              {/* <span className="text-xl font-semibold text-[#745296]">
                College of Idaho
              </span> */}
            </div>
          </div>
        </section>

        <section id="features" className="w-full bg-white py-20">
          <div className="max-w-3xl mx-auto px-6 text-center">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#745296] mb-10">
              Who's it for?
            </h2>
            <div className="flex justify-center gap-4 mb-6">
              {Object.entries(roles).map(([key, role]) => (
                <button
                  key={key}
                  onClick={() => setActive(key as keyof typeof roles)}
                  className={`px-4 py-2 rounded-full font-semibold border transition ${
                    active === key
                      ? "bg-[#745296] text-white border-transparent"
                      : "bg-white text-[#745296] border-[#745296]"
                  }`}
                >
                  {role.label}
                </button>
              ))}
            </div>
            <p className="text-gray-700 text-md leading-relaxed">
              {roles[active].content}
            </p>
          </div>
        </section>

        <section id="preview" className="w-full max-w-7xl py-20 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#745296] mb-10">
            Preview the App
          </h3>
          <p className="text-gray-600 mb-8">
            See how OverYonder looks for different users
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 justify-center">
            <div className="space-y-4">
              <h3 className="font-medium">🎓 Student View</h3>
              <Image
                src="/images/student-preview.png"
                alt="Student preview"
                width={600}
                height={350}
                className="rounded-xl border shadow"
              />
            </div>
            <div className="space-y-4">
              <h3 className="font-medium">🏛 Admin View</h3>
              <Image
                src="/images/admin-preview.png"
                alt="Admin preview"
                width={600}
                height={350}
                className="rounded-xl border shadow"
              />
            </div>
          </div>
        </section>

        <section className="w-full max-w-7xl py-20 text-center">
          <h3 className="text-2xl sm:text-3xl font-extrabold text-[#745296] mb-10">
            How It Works
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-700">
            <div>
              <p className="text-3xl">1️⃣</p>
              <p className="mt-2">Sign in with your school ID</p>
            </div>
            <div>
              <p className="text-3xl">2️⃣</p>
              <p className="mt-2">Explore and RSVP to events</p>
            </div>
            <div>
              <p className="text-3xl">3️⃣</p>
              <p className="mt-2">Create and manage your own</p>
            </div>
          </div>
        </section>

        <section id="faq" className="w-full bg-white  pb-0 py-20">
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#745296] mb-10">
              Frequently Asked Questions
            </h3>
            <div className="space-y-4 text-left">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg overflow-hidden shadow-sm"
                >
                  <button
                    onClick={() => toggle(index)}
                    className="w-full px-5 py-4 text-left font-medium text-[#745296] bg-gray-50 hover:bg-gray-100 transition"
                  >
                    {faq.question}
                  </button>
                  {activeIndex === index && (
                    <div className="px-5 py-3 text-sm text-gray-700 bg-white">
                      {faq.answer}
                    </div>
                  )}
                </div>
              ))}
            </div>
            <div className="mt-10 flex justify-center gap-4">
              <Button
                variant="outline"
                className="border-[#745296] text-[#745296] hover:bg-[#f3f0f7]"
                asChild
              >
                <Link href="/onboarding">Request Access</Link>
              </Button>
              <Button
                className="bg-[#745296] text-white hover:bg-[#624080]"
                asChild
              >
                <Link href="/login">Join Your School</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <HomeFooter />
    </>
  );
}
