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
        <TabsList className="w-full justify-start gap-6 rounded-none border-b bg-transparent p-0">
          <TabsTrigger
            value="events"
            className="flex-none h-10 rounded-none border-0 border-b-2 border-transparent bg-transparent px-4 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
          >
            Events
          </TabsTrigger>
          <TabsTrigger
            value="clubs"
            className="flex-none h-10 rounded-none border-0 border-b-2 border-transparent bg-transparent px-4 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
          >
            Clubs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="events" className="space-y-8">
          <Tabs defaultValue="discover" className="space-y-8">
            <TabsList className="w-full max-w-lg justify-start gap-6 rounded-none border-b bg-transparent p-0">
              <TabsTrigger
                value="discover"
                className="flex-none h-10 rounded-none border-0 border-b-2 border-transparent bg-transparent px-4 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
              >
                Discover
              </TabsTrigger>
              <TabsTrigger
                value="feed"
                className="flex-none h-10 rounded-none border-0 border-b-2 border-transparent bg-transparent px-4 text-sm font-medium text-muted-foreground data-[state=active]:border-primary data-[state=active]:bg-transparent data-[state=active]:text-primary"
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
                <TabsList className="rounded-md bg-muted p-1">
                  <TabsTrigger
                    value="week"
                    className="rounded-sm px-3 py-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-white"
                  >
                    This Week
                  </TabsTrigger>
                  <TabsTrigger
                    value="month"
                    className="rounded-sm px-3 py-1 text-xs data-[state=active]:bg-primary data-[state=active]:text-white"
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

