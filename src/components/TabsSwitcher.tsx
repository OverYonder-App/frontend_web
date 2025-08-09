// src/components/TabsSwitcher.tsx
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./ui/tabs";
import { useState } from "react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

export default function TabsSwitcher() {
  const [activeTab, setActiveTab] = useState("feed");
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState("All");
  const [tag, setTag] = useState("");

  const categories = ["All", "Social", "Academic", "Sports", "Music"];
  const tags = ["Free", "Food", "Virtual", "In-person"];

  return (
    <Tabs
      defaultValue={activeTab}
      onValueChange={setActiveTab}
      className="space-y-6"
    >
      <TabsList className="bg-[#eee6f7] rounded-xl p-2 flex gap-2 max-w-full overflow-x-auto">
        <TabsTrigger
          value="feed"
          className="data-[state=active]:bg-primary data-[state=active]:text-white px-5 py-2 rounded-md text-sm font-medium"
        >
          My Feed
        </TabsTrigger>
        <TabsTrigger
          value="discover"
          className="data-[state=active]:bg-primary data-[state=active]:text-white px-5 py-2 rounded-md text-sm font-medium"
        >
          Discover Events
        </TabsTrigger>
        <TabsTrigger
          value="clubs"
          className="data-[state=active]:bg-primary data-[state=active]:text-white px-5 py-2 rounded-md text-sm font-medium"
        >
          Clubs
        </TabsTrigger>
        <TabsTrigger
          value="groups"
          className="data-[state=active]:bg-primary data-[state=active]:text-white px-5 py-2 rounded-md text-sm font-medium"
        >
          Groups
        </TabsTrigger>
      </TabsList>

      <div className="flex flex-wrap gap-3 mt-2 items-center">
        <Input
          placeholder="Search..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full sm:w-64"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          {categories.map((cat) => (
            <option key={cat}>{cat}</option>
          ))}
        </select>

        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Tags</option>
          {tags.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <TabsContent value="feed">
        <Card className="p-4 shadow-sm">
          <h3 className="font-semibold text-primary">
            Basketball Game Today
          </h3>
          <p className="text-sm text-gray-600">
            Don&apos;t miss the campus game at 6pm in the gym!
          </p>
        </Card>
      </TabsContent>

      <TabsContent value="discover">
        <Card className="p-4 shadow-sm">
          <h3 className="font-semibold text-primary">Open Mic Night</h3>
          <p className="text-sm text-gray-600">
            Join us Friday night to showcase your talent.
          </p>
        </Card>
      </TabsContent>

      <TabsContent value="clubs">
        <Card className="p-4 shadow-sm">
          <h3 className="font-semibold text-primary">
            New: Outdoor Adventures Club
          </h3>
          <p className="text-sm text-gray-600">
            Explore Idaho trails every weekend.
          </p>
        </Card>
      </TabsContent>

      <TabsContent value="groups">
        <Card className="p-4 shadow-sm">
          <h3 className="font-semibold text-primary">
            Startup Builders Group
          </h3>
          <p className="text-sm text-gray-600">
            Build projects and pitch ideas with peers.
          </p>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
