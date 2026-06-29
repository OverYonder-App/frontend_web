"use client";

import { useEffect, useState } from "react";
import { Users, Star } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import StudentLayout from "@/app/dashboard/StudentLayout";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface MembershipRow {
  role: string;
  is_executive: boolean | null;
  organizations: {
    organization_id: string;
    name: string;
    description: string | null;
    logo_url: string | null;
    organization_type: "club" | "group";
  } | null;
}

export default function StudentGroupsPage() {
  const { user, loading: userLoading } = useCurrentUser();
  const [memberships, setMemberships] = useState<MembershipRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("org_members")
        .select(
          "role, is_executive, organizations(organization_id, name, description, logo_url, organization_type)"
        )
        .eq("user_id", user!.id);
      setMemberships((data as MembershipRow[] | null) ?? []);
      setLoading(false);
    }
    load();
  }, [user, userLoading]);

  return (
    <StudentLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Your Groups</h1>
        <p className="text-sm text-muted-foreground">
          Clubs and groups you’re a part of.
        </p>
      </header>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-32 bg-gray-200 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : memberships.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center py-16 text-muted-foreground">
          <Users size={40} className="mb-3 opacity-60" />
          <p className="font-medium">You haven’t joined any groups yet.</p>
          <p className="text-sm">
            Explore clubs and groups from your dashboard to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {memberships.map((m) =>
            m.organizations ? (
              <Link
                key={m.organizations.organization_id}
                href={`/dashboard/student/groups/${m.organizations.organization_id}`}
                className="bg-white rounded-xl shadow p-4 flex flex-col gap-2 transition-shadow hover:shadow-md"
              >
                <div className="flex items-center gap-3">
                  {m.organizations.logo_url ? (
                    <Image
                      src={m.organizations.logo_url}
                      alt={m.organizations.name}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded object-cover"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                      <Users size={18} className="text-primary" />
                    </div>
                  )}
                  <div className="min-w-0">
                    <h3 className="font-semibold text-sm truncate">
                      {m.organizations.name}
                    </h3>
                    <span className="text-xs capitalize text-muted-foreground">
                      {m.organizations.organization_type}
                    </span>
                  </div>
                </div>
                {m.organizations.description && (
                  <p className="text-xs text-gray-500 line-clamp-2">
                    {m.organizations.description}
                  </p>
                )}
                <div className="mt-auto flex items-center gap-2 pt-1">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {m.role}
                  </span>
                  {m.is_executive && (
                    <span className="text-xs flex items-center gap-1 text-amber-600">
                      <Star size={12} /> Executive
                    </span>
                  )}
                </div>
              </Link>
            ) : null
          )}
        </div>
      )}
    </StudentLayout>
  );
}
