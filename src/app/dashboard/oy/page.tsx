// src/app/dashboard/admin/institution/InstitutionAdminDashboard.tsx
import BaseLayout from "@/components/layouts/BaseLayout";
import { Button } from "@/components/ui/button";
import { useUser } from "@/context/UserContext";
import { LogOut } from "lucide-react";

export default function OYAdminDashboard() {
  const { signOut } = useUser();
  const handleLogout = async () => {
    await signOut();
    window.location.href = "/login";
  };
  return (
    <BaseLayout>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-[#745296]">OY Admin Panel</h1>
        <div>
          [Institution-specific analytics, org approvals, and event requests]
          <Button
            className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
            // onClick={handleLogout}
          >
            <LogOut size={16} className="mr-2" /> Logout
          </Button>
        </div>
      </div>
    </BaseLayout>
  );
}
