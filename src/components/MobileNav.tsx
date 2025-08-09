import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
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

export default function MobileDrawerNav() {
  const [open, setOpen] = useState(false);

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
              <NavItem icon={<Home size={18} />} label="Home" />
              <NavItem icon={<Calendar size={18} />} label="Your Events" />
              <NavItem icon={<Users size={18} />} label="Your Groups" />
              <NavItem icon={<MessageSquare size={18} />} label="Messages" />
              <NavItem icon={<Bell size={18} />} label="Notifications" />
              <hr className="my-4" />
              <NavItem icon={<Settings size={18} />} label="Settings" />
              <NavItem icon={<LogOut size={18} />} label="Log out" />
            </nav>
          </div>
          <div className="border-t pt-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Avatar>
                <AvatarImage src="https://source.unsplash.com/random/40x40?profile" />
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
    </div>
  );
}

function NavItem({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-3 w-full text-left text-gray-800 hover:text-primary">
      {icon}
      {label}
    </button>
  );
}
