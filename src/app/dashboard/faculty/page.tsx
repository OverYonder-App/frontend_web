"use client";

import { useState } from "react";
import BaseLayout from "@/components/layouts/BaseLayout";
import GlobalSearchBar from "@/components/GlobalSearchBar";
import AnnouncementsSidebar from "@/components/AnnouncementsSidebar";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import UpcomingEventsCarousel from "@/features/events/components/UpcomingEventsCarousel";
import HottestEventsCarousel from "@/features/events/components/HottestEventsCarousel";
import LiveEventsCarousel from "@/features/events/components/LiveEventsCarousel";
import MoreEventsList from "@/features/events/components/MoreEventsList";
import ClubFeedCarousel from "@/features/events/components/ClubFeedCarousel";
import GroupFeedCarousel from "@/features/events/components/GroupFeedCarousel";
import NewClubsCarousel from "@/features/organizations/components/NewClubsCarousel";
import AllClubsCarousel from "@/features/organizations/components/AllClubsCarousel";

export default function FacultyDashboard() {
  const [range, setRange] = useState<"week" | "month">("week");

  return (
    <BaseLayout
      searchbar={<GlobalSearchBar />}
      rightSidebar={<AnnouncementsSidebar />}
    >
      <Tabs defaultValue="events" className="space-y-4">
        <TabsList className="bg-[#eee6f7] rounded-lg p-2 w-full max-w-sm flex gap-2">
          <TabsTrigger
            value="events"
            className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Events
          </TabsTrigger>
          <TabsTrigger
            value="clubs"
            className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Clubs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-8">
          <Tabs defaultValue="discover" className="space-y-8">
            <TabsList className="bg-[#eee6f7] rounded-lg p-2 w-full max-w-lg flex gap-2">
              <TabsTrigger
                value="discover"
                className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                Discover
              </TabsTrigger>
              <TabsTrigger
                value="feed"
                className="data-[state=active]:bg-primary data-[state=active]:text-white px-4 py-2 rounded-md text-sm font-medium"
              >
                My Feed
              </TabsTrigger>
            </TabsList>

            <TabsContent value="discover" className="space-y-8">
              <Tabs
                value={range}
                onValueChange={(v) => setRange(v as "week" | "month")}
                className="flex justify-end"
              >
                <TabsList className="bg-[#eee6f7] rounded-lg p-1">
                  <TabsTrigger
                    value="week"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white px-3 py-1 rounded-md text-xs"
                  >
                    This Week
                  </TabsTrigger>
                  <TabsTrigger
                    value="month"
                    className="data-[state=active]:bg-primary data-[state=active]:text-white px-3 py-1 rounded-md text-xs"
                  >
                    This Month
                  </TabsTrigger>
                </TabsList>
              </Tabs>

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
            </TabsContent>

            <TabsContent value="feed" className="space-y-8">
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
            </TabsContent>
          </Tabs>
        </TabsContent>

        <TabsContent value="clubs" className="space-y-8">
          <section>
            <h2 className="text-lg font-semibold mb-2">New Clubs</h2>
            <NewClubsCarousel />
          </section>
          <section>
            <h2 className="text-lg font-semibold mb-2">More Clubs</h2>
            <AllClubsCarousel />
          </section>
        </TabsContent>
      </Tabs>
    </BaseLayout>
  );
}

