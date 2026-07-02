// src/components/FABMenu.tsx
import { useState, useRef, useEffect } from "react";
import { Plus, Users, Flag, CalendarPlus } from "lucide-react";

export default function FABMenu() {
  const [fabOpen, setFabOpen] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setFabOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => setFabOpen(false), 2000);
  };

useEffect(() => {
  return () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  };
}, []);

  return (
    <div
      className="fixed bottom-6 right-6 flex flex-col items-end gap-2 z-50"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {fabOpen && (
        <div className="flex flex-col items-end gap-2 mb-2">
          <FabOption icon={<Users size={18} />} label="Create Club" />
          <FabOption icon={<Flag size={18} />} label="Create Group" />
          <FabOption icon={<CalendarPlus size={18} />} label="Create Event" />
        </div>
      )}
      <button
        onClick={() => setFabOpen((prev) => !prev)}
        className="bg-primary text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-[#684287] transition"
      >
        <Plus size={28} />
      </button>
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
