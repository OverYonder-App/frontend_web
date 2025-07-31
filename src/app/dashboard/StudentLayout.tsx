import { useEffect, useRef, useState } from "react";
import MobileDrawerNav from "@/components/MobileNav";
import SidebarNav from "@/components/SideNav";
import { Plus, Users, Flag, CalendarPlus } from "lucide-react";

export default function StudentLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobile, setIsMobile] = useState(false);
    const [fabOpen, setFabOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setFabOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setFabOpen(false), 100);
  };


  return (
    <div className={`flex ${isMobile ? "flex-col" : ""} h-screen w-full`}>
      {isMobile ? <MobileDrawerNav /> : <SidebarNav />}
      <main className="flex-1 overflow-auto bg-[#f9f9ff] p-4 md:p-8">
        {children}
      </main>
      {/* FAB expandable */}
      <div
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className="fixed bottom-6 right-6 flex flex-col items-end gap-2 z-50"
      >
        {fabOpen && (
          <div className="flex flex-col items-end gap-2 mb-2">
            <FabOption icon={<Users size={18} />} label="Create Club" />
            <FabOption icon={<Flag size={18} />} label="Create Group" />
            <FabOption icon={<CalendarPlus size={18} />} label="Create Event" />
          </div>
        )}
        <button
        //   onMouseEnter={() => setFabOpen((prev) => !prev)}
          className="bg-[#745296] text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#684287] transition"
        >
          <Plus size={28} />
        </button>
      </div>
    </div>
  );
}
function FabOption({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-full shadow text-sm hover:bg-gray-100">
      {icon}
      {label}
    </button>
  );
}