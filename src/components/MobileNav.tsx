import { useState } from "react";
import Link from "next/link";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
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

export default function MobileDrawerNav() {
  const [open, setOpen] = useState(false);
  const { signOut } = useUser();

  const handleLogout = async () => {
    setOpen(false);
    await signOut();
    window.location.href = "/login";
  };

  return (
    <div className="flex items-center ">
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger className="p-2">
          <svg viewBox="0 0 100 80" width="24" height="24">
            <rect width="100" height="10" fill="var(--over-yonder)" />
            <rect y="30" width="100" height="10" fill="var(--over-yonder)" />
            <rect y="60" width="100" height="10" fill="var(--over-yonder)" />
          </svg>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="w-[85vw] max-w-sm p-6 bg-white flex flex-col justify-between"
        >
          <div>
            <h1 className="text-primary font-bold text-xl mb-6">
              OverYonder
            </h1>
            <nav className="space-y-4 text-sm">
              {navItems.map((item) => (
                <NavLink
                  key={item.label}
                  icon={item.icon}
                  label={item.label}
                  href={item.href}
                  onNavigate={() => setOpen(false)}
                />
              ))}
              <hr className="my-4" />
              <NavLink
                icon={<Settings size={18} />}
                label="Settings"
                href="/dashboard/student/settings"
                onNavigate={() => setOpen(false)}
              />
              <button
                onClick={handleLogout}
                className="flex items-center gap-3 w-full text-left text-gray-800 hover:text-primary"
              >
                <LogOut size={18} />
                Log out
              </button>
            </nav>
          </div>
          <div className="border-t pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="/images/overyonder-logo.png" />
                <AvatarFallback>GA</AvatarFallback>
              </Avatar>
              <div className="text-sm">
                <p className="font-medium">Gerald Akorli</p>
                <p className="text-gray-500">View profile</p>
              </div>
            </div>
          </div>
        </SheetContent>
      </Sheet>
      <h1 className="text-primary font-bold text-xl p-2">OverYonder</h1>
      <span className="text-primary">
        <NotificationsBell />
      </span>
    </div>
  );
}

function NavLink({
  icon,
  label,
  href,
  onNavigate,
}: {
  icon: React.ReactNode;
  label: string;
  href: string;
  onNavigate: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="flex items-center gap-3 w-full text-left text-gray-800 hover:text-primary"
    >
      {icon}
      {label}
    </Link>
  );
}
