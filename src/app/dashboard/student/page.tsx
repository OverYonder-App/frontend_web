"use client";

import { useState } from "react";
import StudentLayout from "../StudentLayout";
import GlobalSearchBar from "@/components/GlobalSearchBar";
import UpcomingEventsCarousel from "@/features/events/components/UpcomingEventsCarousel";
import HottestEventsCarousel from "@/features/events/components/HottestEventsCarousel";
import LiveEventsCarousel from "@/features/events/components/LiveEventsCarousel";
import MoreEventsList from "@/features/events/components/MoreEventsList";
import ClubFeedCarousel from "@/features/events/components/ClubFeedCarousel";
import GroupFeedCarousel from "@/features/events/components/GroupFeedCarousel";
import NewClubsCarousel from "@/features/organizations/components/NewClubsCarousel";
import AllClubsCarousel from "@/features/organizations/components/AllClubsCarousel";

export default function StudentHomeYonderView() {
  const [section, setSection] = useState<"events" | "clubs">("events");
  const [view, setView] = useState<"discover" | "feed">("discover");
  const [range, setRange] = useState<"week" | "month">("week");

  const navButton = (
    label: string,
    active: boolean,
    onClick: () => void
  ) => (
    <button
      onClick={onClick}
      className={`flex-none px-4 py-2 text-sm font-medium border-b-2 ${
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground"
      }`}
    >
      {label}
    </button>
  );

  const rangeButton = (
    label: string,
    value: "week" | "month"
  ) => (
    <button
      onClick={() => setRange(value)}
      className={`rounded-sm px-3 py-1 text-xs ${
        range === value ? "bg-primary text-white" : ""
      }`}
    >
      {label}
    </button>
  );

  return (
    <StudentLayout>
      <main className="min-h-screen bg-[#f9f9ff] p-4 md:p-8">
        <header className="mb-4 md:mb-6 space-y-4">
          <h1 className="text-2xl font-bold text-primary">
            What’s happening at your campus
          </h1>
          <GlobalSearchBar />
        </header>

        <div className="space-y-6">
          <nav className="flex gap-6 border-b">
            {navButton("Events", section === "events", () => setSection("events"))}
            {navButton("Clubs", section === "clubs", () => setSection("clubs"))}
          </nav>

          {section === "events" && (
            <div className="space-y-8">
              <nav className="flex gap-6 border-b">
                {navButton(
                  "Discover",
                  view === "discover",
                  () => setView("discover")
                )}
                {navButton("My Feed", view === "feed", () => setView("feed"))}
              </nav>

              {view === "discover" && (
                <div className="space-y-8">
                  <div className="flex justify-end">
                    <div className="rounded-md bg-muted p-1 flex gap-1">
                      {rangeButton("This Week", "week")}
                      {rangeButton("This Month", "month")}
                    </div>
                  </div>

                  <section>
                    <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
                    <UpcomingEventsCarousel range={range} />
                  </section>
                  <section>
                    <h2 className="text-lg font-semibold mb-2">Hottest Events</h2>
                    <HottestEventsCarousel range={range} />
                  </section>
                  <section>
                    <h2 className="text-lg font-semibold mb-2">Live Events</h2>
                    <LiveEventsCarousel range={range} />
                  </section>
                  <section>
                    <h2 className="text-lg font-semibold mb-2">More Events</h2>
                    <MoreEventsList range={range} />
                  </section>
                </div>
              )}

              {view === "feed" && (
                <div className="space-y-8">
                  <section>
                    <h2 className="text-lg font-semibold mb-2">
                      Events from clubs you have joined
                    </h2>
                    <ClubFeedCarousel />
                  </section>
                  <section>
                    <h2 className="text-lg font-semibold mb-2">
                      Events from groups you are apart of
                    </h2>
                    <GroupFeedCarousel />
                  </section>
                </div>
              )}
            </div>
          )}

          {section === "clubs" && (
            <div className="space-y-8">
              <section>
                <h2 className="text-lg font-semibold mb-2">New Clubs</h2>
                <NewClubsCarousel />
              </section>
              <section>
                <h2 className="text-lg font-semibold mb-2">More Clubs</h2>
                <AllClubsCarousel />
              </section>
            </div>
          )}
        </div>
      </main>
    </StudentLayout>
  );
}
