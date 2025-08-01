import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ChevronLeft,
  ChevronRight,
  LayoutDashboard,
  School,
  Users as UsersIcon,
  FileWarning,
  Image,
  LogOut,
} from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { useUser } from "@/context/UserContext";

interface NavItem {
  label: string;
  href: string;
}

const NAV: NavItem[] = [
  { label: "Dashboard", href: "/dashboard/oy" },
  { label: "Institutions", href: "/dashboard/oy/institutions" },
  { label: "Users", href: "/dashboard/oy/users" },
  { label: "Reports", href: "/dashboard/oy/reports" },
  { label: "Media", href: "/dashboard/oy/media" },
];

const ICON_MAP: Record<string, any> = {
  Dashboard: LayoutDashboard,
  Institutions: School,
  Users: UsersIcon,
  Reports: FileWarning,
  Media: Image,
};

export default function OYAdminSidebar() {
  const [collapsed, setCollapsed] = useState(false);
  const pathname = usePathname();
  const { signOut, user } = useUser();

  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };

  return (
    <aside
      className={`bg-white border-r border-gray-200 shadow-sm min-h flex flex-col transition-all duration-200 ease-in-out ${collapsed ? "w-16" : "w-64"}`}
    >
      <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
        {!collapsed && (
          <span className="text-xl font-semibold text-gray-900">OverYonder</span>
        )}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="p-1 rounded hover:bg-gray-100 focus:outline-none"
          aria-label="Toggle sidebar"
        >
          {collapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <ChevronLeft className="w-5 h-5" />
          )}
        </button>
      </div>
      <nav className="flex-1 space-y-1 px-2 py-4 overflow-y-auto">
        {NAV.map((item) => {
          const Icon = ICON_MAP[item.label];
          const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
          return (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center px-3 py-2 rounded-md transition-colors ${isActive ? "bg-blue-50 text-blue-700 font-semibold" : "text-gray-700 hover:bg-gray-100"}`}
              title={collapsed ? item.label : undefined}
            >
              {Icon && <Icon className="w-5 h-5" />}
              {!collapsed && <span className="ml-3">{item.label}</span>}
            </Link>
          );
        })}
        <hr className="my-4" />
        <button
          onClick={handleLogout}
          className="flex items-center w-full px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors"
        >
          <LogOut className="w-5 h-5" />
          {!collapsed && <span className="ml-3">Log out</span>}
        </button>
      </nav>
      <div className="border-t border-gray-200 p-4 flex items-center gap-3">
        <Avatar>
          <AvatarImage src="https://source.unsplash.com/random/40x40?profile" />
          <AvatarFallback>UN</AvatarFallback>
        </Avatar>
        {!collapsed && (
          <div className="text-sm">
            <p className="font-medium">{user?.email}</p>
            <p className="text-gray-500 text-xs">Account</p>
          </div>
        )}
      </div>
    </aside>
  );
}
