"use client"
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import EventCard from "@/features/events/components/EventCard";
import StudentLayout from "../StudentLayout";

const mockEvents = [
  {
    id: "1",
    title: "Music in the Quad",
    date: "Thu, Jul 25 • 6:00 PM",
    location: "Main Lawn",
    category: "Social",
    image: "https://source.unsplash.com/random/800x500?concert",
    host: "Campus Life",
    attendees: ["A", "B", "C"],
  },
  {
    id: "2",
    title: "AI Ethics Panel",
    date: "Fri, Jul 26 • 4:00 PM",
    location: "Library Auditorium",
    category: "Academic",
    image: "https://source.unsplash.com/random/800x500?ai",
    host: "Philosophy Dept",
    attendees: ["D", "E"],
  },
];

export default function StudentHomeYonderView() {
  return (
    <StudentLayout>
      <main className="min-h-screen bg-[#f9f9ff] p-4 md:p-8">
        <header className="mb-4 md:mb-6">
          <h1 className="text-2xl font-bold text-[#745296]">
            What’s happening at your campus
          </h1>
        </header>

        <Tabs defaultValue="events" className="space-y-4">
          <TabsList className="bg-[#eee6f7] rounded-lg p-2 w-full max-w-lg flex gap-2">
            <TabsTrigger
              value="events"
              className="data-[state=active]:bg-[#745296] data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Events
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="data-[state=active]:bg-[#745296] data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Groups
            </TabsTrigger>
            <TabsTrigger
              value="announcements"
              className="data-[state=active]:bg-[#745296] data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Announcements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="events">
            <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </section>
          </TabsContent>

          <TabsContent value="groups">
            <div className="text-center text-sm text-gray-500 pt-10">
              Groups view coming soon...
            </div>
          </TabsContent>

          <TabsContent value="announcements">
            <div className="text-center text-sm text-gray-500 pt-10">
              No new announcements right now.
            </div>
          </TabsContent>
        </Tabs>
      </main>
    </StudentLayout>
  );
}
