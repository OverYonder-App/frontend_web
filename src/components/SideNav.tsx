import Link from "next/link";
import {
  Home,
  Calendar,
  Users,
  MessageSquare,
  Settings,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";
import NotificationsBell from "@/components/NotificationsBell";

const navItems = [
  { label: "Home", icon: <Home size={18} />, href: "/dashboard/student" },
  { label: "Your Events", icon: <Calendar size={18} />, href: "/dashboard/student/events" },
  { label: "Your Groups", icon: <Users size={18} />, href: "/dashboard/student/groups" },
  { label: "Messages", icon: <MessageSquare size={18} />, href: "/dashboard/student/messages" },
];

export default function SidebarNav() {
  const { signOut } = useUser();
  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };
  return (
    <aside className="hidden md:flex flex-col justify-between w-56 bg-primary text-white h-screen p-4">
      <div>
        <div className="mb-6 flex items-center justify-between">
          <h1 className="text-xl font-bold">OverYonder</h1>
          <NotificationsBell />
        </div>
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
            href="/dashboard/student/settings"
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
          <AvatarImage src="/images/overyonder-logo.png" />
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
