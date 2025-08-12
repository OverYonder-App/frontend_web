"use client";

import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
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
import ClubCategoryFilter from "@/features/organizations/components/ClubCategoryFilter";
import { useState } from "react";

export default function StudentHomeYonderView() {
  const [category, setCategory] = useState<string | undefined>();

  return (
    <StudentLayout>
      <main className="min-h-screen bg-[#f9f9ff] p-4 md:p-8">
        <header className="mb-4 md:mb-6 space-y-4">
          <h1 className="text-2xl font-bold text-primary">
            What’s happening at your campus
          </h1>
          <GlobalSearchBar />
        </header>

        <Tabs defaultValue="discover" className="space-y-4">
          <TabsList className="bg-[#eee6f7] rounded-lg p-2 w-full max-w-lg flex gap-2">
            <TabsTrigger
              value="feed"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              My Feed
            </TabsTrigger>
            <TabsTrigger
              value="discover"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Discover
            </TabsTrigger>
            <TabsTrigger
              value="clubs"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Clubs
            </TabsTrigger>
            <TabsTrigger
              value="groups"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Groups
            </TabsTrigger>
            <TabsTrigger
              value="announcements"
              className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
            >
              Announcements
            </TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold mb-2">Clubs</h2>
              <ClubFeedCarousel />
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">Groups</h2>
              <GroupFeedCarousel />
            </section>
          </TabsContent>

          <TabsContent value="discover" className="space-y-8">
            <section>
              <h2 className="text-lg font-semibold mb-2">Upcoming Events</h2>
              <UpcomingEventsCarousel />
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">Hottest Events</h2>
              <HottestEventsCarousel />
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">Live Now</h2>
              <LiveEventsCarousel />
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">More Events</h2>
              <MoreEventsList />
            </section>
          </TabsContent>

          <TabsContent value="clubs" className="space-y-8">
            <div className="flex justify-end">
              <ClubCategoryFilter value={category} onChange={setCategory} />
            </div>
            <section>
              <h2 className="text-lg font-semibold mb-2">New Clubs</h2>
              <NewClubsCarousel category={category} />
            </section>
            <section>
              <h2 className="text-lg font-semibold mb-2">All Clubs</h2>
              <AllClubsCarousel category={category} />
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
