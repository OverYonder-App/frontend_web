import Link from "next/link";
import {
  Home,
  Calendar,
  Users,
  MessageSquare,
  Bell,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { supabase } from "@/lib/supabase";

const navItems = [
  { label: "Home", icon: <Home size={18} />, href: "/dashboard/student" },
  { label: "Your Events", icon: <Calendar size={18} />, href: "/events" },
  { label: "Your Groups", icon: <Users size={18} />, href: "/groups" },
  { label: "Messages", icon: <MessageSquare size={18} />, href: "/messages" },
  { label: "Notifications", icon: <Bell size={18} />, href: "/notifications" },
];

export default function SidebarNav() {
  const handleLogout = async () => {
    let { error } = await supabase.auth.signOut();
    console.error(error);
     window.location.href = "/login";
  };
  return (
    <aside className="hidden md:flex flex-col justify-between w-64 bg-[#745296] text-white h-screen p-4">
      <div>
        <h1 className="text-xl font-bold mb-6">OverYonder</h1>
        <nav className="space-y-4 text-sm">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 hover:text-white/80"
            >
              {item.icon}
              {item.label}
            </Link>
          ))}
          <hr className="my-4 border-white/30" />
          <Link
            href="/settings"
            className="flex items-center gap-3 hover:text-white/80"
          >
            <Settings size={18} />
            Settings
          </Link>
          <button
            onClick={handleLogout}
            className="flex cursor-pointer items-center gap-3 text-left w-full hover:text-white/80"
          >
            <LogOut size={18} />
            Log out
          </button>
        </nav>
      </div>
      <div className="border-t border-white/30 pt-4 flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://source.unsplash.com/random/40x40?profile" />
          <AvatarFallback>GA</AvatarFallback>
        </Avatar>
        <div className="text-sm">
          <p className="font-medium">Gerald Akorli</p>
          <p className="text-white/70 text-xs">View profile</p>
        </div>
      </div>
    </aside>
  );
}
