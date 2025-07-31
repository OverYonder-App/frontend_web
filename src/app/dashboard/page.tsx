'use client'
// // Social-style event layout update
// import { useState } from 'react';
// import { Card } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { ChevronLeft, ChevronRight, LayoutDashboard, CalendarDays, Users, Settings } from 'lucide-react';
// import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

// interface LiveEvent {
//   id: string;
//   title: string;
//   description: string;
//   imageUrl?: string;
//   status: 'live' | 'upcoming';
//   date?: string;
//   category?: string;
// }

// const myFeedEvents: LiveEvent[] = [
//   {
//     id: '1',
//     title: 'Basketball Game',
//     description: 'Live at the Gym Arena',
//     imageUrl: 'https://source.unsplash.com/random/600x400?basketball',
//     status: 'live',
//     date: '2025-07-21',
//     category: 'Sports'
//   },
//   {
//     id: '2',
//     title: 'Dance Showcase',
//     description: 'Performing Arts Theater',
//     imageUrl: 'https://source.unsplash.com/random/600x400?dance',
//     status: 'live',
//     date: '2025-07-22',
//     category: 'Arts'
//   },
// ];

// const discoverEvents: LiveEvent[] = [
//   {
//     id: '3',
//     title: 'Trivia Night',
//     description: 'Student Lounge at 6PM',
//     imageUrl: 'https://source.unsplash.com/random/600x400?trivia',
//     status: 'upcoming',
//     date: '2025-07-23',
//     category: 'Games'
//   },
//   {
//     id: '4',
//     title: 'Sustainability Fair',
//     description: 'Quad, 7PM',
//     imageUrl: 'https://source.unsplash.com/random/600x400?environment',
//     status: 'upcoming',
//     date: '2025-07-24',
//     category: 'Environment'
//   },
// ];

// export default function StudentDashboard() {
//   const [user] = useState({ first_name: 'Alex' });
//   const [sidebarOpen, setSidebarOpen] = useState(true);
//   const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

//   const categories = ['All', 'Sports', 'Arts', 'Games', 'Environment'];

//   const filteredFeed = myFeedEvents.filter(event =>
//     !selectedCategory || selectedCategory === 'All' || event.category === selectedCategory
//   );
//   const filteredDiscover = discoverEvents.filter(event =>
//     !selectedCategory || selectedCategory === 'All' || event.category === selectedCategory
//   );

//   return (
//     <div className="flex h-screen">
//       <aside className={`transition-all duration-300 ${sidebarOpen ? 'w-60' : 'w-20'} bg-[#745296] text-white flex flex-col p-4 space-y-4`}>
//         <div className="flex items-center justify-between">
//           <h1 className="font-bold text-lg whitespace-nowrap overflow-hidden">{sidebarOpen ? 'OverYonder' : 'OY'}</h1>
//           <button onClick={() => setSidebarOpen(!sidebarOpen)}>
//             {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
//           </button>
//         </div>
//         <nav className="flex flex-col gap-4 text-sm">
//           <a href="#" className="flex items-center gap-3 hover:text-white/80">
//             <LayoutDashboard size={18} />
//             {sidebarOpen && 'Dashboard'}
//           </a>
//           <a href="#" className="flex items-center gap-3 hover:text-white/80">
//             <CalendarDays size={18} />
//             {sidebarOpen && 'Events'}
//           </a>
//           <a href="#" className="flex items-center gap-3 hover:text-white/80">
//             <Users size={18} />
//             {sidebarOpen && 'Orgs'}
//           </a>
//           <a href="#" className="flex items-center gap-3 hover:text-white/80">
//             <Settings size={18} />
//             {sidebarOpen && 'Settings'}
//           </a>
//         </nav>
//       </aside>

//       <main className="flex-1 p-6 overflow-auto bg-[#f9f9ff]">
//         <header className="mb-4">
//           <h2 className="text-2xl font-bold text-[#745296]">Welcome back, {user.first_name}</h2>
//           <p className="text-sm text-gray-500">Here’s what’s happening on campus.</p>
//         </header>

//         <Tabs defaultValue="feed" className="space-y-4">
//           <TabsList className="bg-[#eee6f7] border border-[#745296]/30 rounded-xl px-4 py-2 w-fit flex gap-4">
//             <TabsTrigger value="feed" className="data-[state=active]:bg-[#745296] data-[state=active]:text-white text-base px-6 py-3 rounded-lg transition font-medium">My Feed</TabsTrigger>
//             <TabsTrigger value="discover" className="data-[state=active]:bg-[#745296] data-[state=active]:text-white text-base px-6 py-3 rounded-lg transition font-medium">Discover</TabsTrigger>
//             <TabsTrigger value="calendar" className="data-[state=active]:bg-[#745296] data-[state=active]:text-white text-base px-6 py-3 rounded-lg transition font-medium">Calendar</TabsTrigger>
//           </TabsList>

//           <div className="flex flex-wrap gap-2 text-sm mt-2">
//             {categories.map((cat) => (
//               <button
//                 key={cat}
//                 onClick={() => setSelectedCategory(cat)}
//                 className={`px-3 py-1 rounded-full border ${selectedCategory === cat ? 'bg-[#745296] text-white' : 'border-gray-300 text-gray-700'}`}
//               >
//                 {cat}
//               </button>
//             ))}
//           </div>

//           <TabsContent value="feed">
//             <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-6">
//               <div className="space-y-6">
//                 {filteredFeed.map((event) => (
//                   <Card key={event.id} className="bg-white rounded-xl shadow border border-gray-200 overflow-hidden">
//                     {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-64 object-cover" />}
//                     <div className="p-4 space-y-2">
//                       <div className="flex justify-between items-center">
//                         <h4 className="text-lg font-semibold text-[#745296]">{event.title}</h4>
//                         <span className="text-xs text-gray-400">{event.date}</span>
//                       </div>
//                       <p className="text-sm text-gray-600">{event.description}</p>
//                       <div className="flex justify-between items-center pt-2">
//                         <Button size="sm" className="text-sm">{event.status === 'live' ? 'Join Live' : 'RSVP'}</Button>
//                         <span className="text-xs text-gray-400">{event.category}</span>
//                       </div>
//                     </div>
//                   </Card>
//                 ))}
//               </div>
//               <aside className="space-y-4 hidden lg:block">
//                 <Card className="p-4">
//                   <h5 className="font-medium text-[#745296] mb-2">Trending Orgs</h5>
//                   <ul className="text-sm text-gray-600 space-y-1">
//                     <li>• Coding Club</li>
//                     <li>• Outdoor Adventures</li>
//                     <li>• Sustainability Group</li>
//                   </ul>
//                 </Card>
//                 <Card className="p-4">
//                   <h5 className="font-medium text-[#745296] mb-2">Suggested Events</h5>
//                   <ul className="text-sm text-gray-600 space-y-1">
//                     <li>🧠 Startup Pitch Night</li>
//                     <li>🎨 Creative Writing Jam</li>
//                   </ul>
//                 </Card>
//               </aside>
//             </div>
//           </TabsContent>

//           <TabsContent value="discover">
//             <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               {filteredDiscover.map((event) => (
//                 <Card key={event.id} className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all overflow-hidden">
//                   {event.imageUrl && <img src={event.imageUrl} alt={event.title} className="w-full h-40 object-cover" />}
//                   <div className="p-4 space-y-2">
//                     <h4 className="text-base font-semibold text-[#745296]">{event.title}</h4>
//                     <p className="text-sm text-gray-600">{event.description}</p>
//                     <p className="text-xs text-gray-400">{event.date}</p>
//                     <Button size="sm" className="text-sm">{event.status === 'live' ? 'Join Live' : 'RSVP'}</Button>
//                   </div>
//                 </Card>
//               ))}
//             </section>
//           </TabsContent>

//           <TabsContent value="calendar">
//             <div className="text-center text-sm text-gray-500 pt-10">Calendar view coming soon...</div>
//           </TabsContent>
//         </Tabs>
//       </main>
//     </div>
//   );
// }
// src/app/dashboard/page.tsx
'use client';

import { useCurrentUser } from '@/hooks/useCurrentUser';
import StudentDashboard from './student/StudentDashboard';
import FacultyDashboard from './faculty/FacultyDashboard';
import InstitutionAdminDashboard from './admin/institution/InstitutionAdminDashboard';
import OYAdminDashboard from './admin/oy/OYAdminDashboard';
import Unauthorized from '@/components/Unauthorized';

export default function DashboardPage() {
  const { user, loading } = useCurrentUser();

  if (loading) return <div className="p-8 text-center">Loading...</div>;

  switch (user?.role_type) {
    case "Student":
      return <StudentDashboard />;
    case "Student Leader":
      return <StudentDashboard />;
    case "Faculty":
      return <FacultyDashboard />;
    case "Institution Admin":
      return <InstitutionAdminDashboard />;
    case "OY Admin":
      return <OYAdminDashboard />;
    default:
      return <Unauthorized />;
  }
}
