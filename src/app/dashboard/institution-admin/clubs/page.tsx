import { Metadata } from "next";
import { getSupabaseServerClient } from "@/lib/auth";
import ClubsExplorer from "@/components/ClubsExplorer";
import type { Database } from "@/lib/database.types";
import type { Organization } from "@/features/organizations/api";

export const metadata: Metadata = {
  title: "Clubs – Institution Admin",
};

interface ClubsPageProps {
  searchParams: { status?: string };
}

export default async function ClubsPage({ searchParams }: ClubsPageProps) {
  const supabase = await getSupabaseServerClient();
  const status = searchParams.status;

  let query = supabase
    .from("organizations")
    .select("*")
    .eq("organization_type", "club");

  const allowedStatuses = ["approved", "pending", "rejected"] as const;
  type AllowedStatus = (typeof allowedStatuses)[number];
  if (status && allowedStatuses.includes(status as AllowedStatus)) {
    query = query.eq("status", status as AllowedStatus);
  }

  const { data } = await query;

  const clubs: Organization[] = (
    (data as Database["public"]["Tables"]["organizations"]["Row"][]) || []
  );

  return (
    <section className="p-6 sm:p-8 bg-background min-h-full">
      <ClubsExplorer clubs={clubs} />
    </section>
  );
}
