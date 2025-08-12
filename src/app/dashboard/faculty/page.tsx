// src/app/dashboard/admin/institution/InstitutionAdminDashboard.tsx
import BaseLayout from "@/components/layouts/BaseLayout";
import GlobalSearchBar from "@/components/GlobalSearchBar";

export default function FacultyDashboard() {
  return (
    <BaseLayout searchbar={<GlobalSearchBar />}>
      <div className="space-y-6">
        <h1 className="text-xl font-bold text-primary">Faculty Panel</h1>
        <div>
          [Institution-specific analytics, org approvals, and event requests]
        </div>
      </div>
    </BaseLayout>
  );
}
