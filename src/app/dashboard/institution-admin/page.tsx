// // src/app/dashboard/admin/institution/InstitutionAdminDashboard.tsx
// import BaseLayout from "@/components/layouts/BaseLayout";
// import { Button } from "@/components/ui/button";
// import { supabase } from "@/lib/supabase";
// import { LogOut } from "lucide-react";

// export default function InstitutionAdminDashboard() {
//      const handleLogout = async () => {
//        await supabase.auth.signOut();
//        window.location.href = "/login";
//      };
//   return (
//     <BaseLayout>
//       <div className="space-y-6">
//         <h1 className="text-xl font-bold text-[#745296]">
//           Institution Admin Panel
//         </h1>
//         <div>
//           [Institution-specific analytics, org approvals, and event requests]
//           <Button
//             className="w-full bg-gray-200 text-gray-800 hover:bg-gray-300"
//             onClick={handleLogout}
//           >
//             <LogOut size={16} className="mr-2" /> Logout
//           </Button>
//         </div>
//       </div>
//     </BaseLayout>
//   );
// }
// File: src/app/admin/page.tsx
import { Metadata } from "next";
import AdminDashboard from "@/components/AdminDashboard";

export const metadata: Metadata = {
  title: "Dashboard – Campus Events",
};

export default function AdminPage() {
  // Server component—no "use client" here—simply renders the interactive client
  return <AdminDashboard />;
}
