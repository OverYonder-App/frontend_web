"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Users, Star } from "lucide-react";
import StudentLayout from "@/app/dashboard/StudentLayout";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import { track } from "@/lib/analytics";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface Org {
  organization_id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  organization_type: "club" | "group";
}

interface Member {
  user_id: string;
  role: string;
  is_executive: boolean | null;
  users: {
    first_name: string | null;
    last_name: string | null;
    username: string;
    avatar_url: string;
  } | null;
}

function memberName(m: Member): string {
  const full = [m.users?.first_name, m.users?.last_name]
    .filter(Boolean)
    .join(" ")
    .trim();
  return full || m.users?.username || "Member";
}

export default function GroupViewPage() {
  const { id } = useParams<{ id: string }>();
  const { user, loading: userLoading } = useCurrentUser();

  const [org, setOrg] = useState<Org | null>(null);
  const [members, setMembers] = useState<Member[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [busy, setBusy] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      const [orgRes, memberRes] = await Promise.all([
        supabase
          .from("organizations")
          .select(
            "organization_id, name, description, logo_url, organization_type"
          )
          .eq("organization_id", id)
          .single(),
        supabase
          .from("org_members")
          .select(
            "user_id, role, is_executive, users(first_name, last_name, username, avatar_url)"
          )
          .eq("org_id", id),
      ]);
      if (orgRes.error || !orgRes.data) {
        setNotFound(true);
      } else {
        setOrg(orgRes.data as Org);
        setMembers((memberRes.data as unknown as Member[]) ?? []);
      }
      setLoading(false);
    }
    load();
  }, [id]);

  const isMember = !!user && members.some((m) => m.user_id === user.id);

  const join = async () => {
    if (!user || !org) return;
    setBusy(true);
    const optimistic: Member = {
      user_id: user.id,
      role: "Member",
      is_executive: false,
      users: {
        first_name: null,
        last_name: null,
        username: user.email.split("@")[0],
        avatar_url: "/images/overyonder-logo.png",
      },
    };
    setMembers((m) => [...m, optimistic]);
    const { error } = await supabase
      .from("org_members")
      .insert({ org_id: org.organization_id, user_id: user.id, role: "Member" });
    setBusy(false);
    if (error) {
      setMembers((m) => m.filter((x) => x.user_id !== user.id));
      setToast({ msg: error.message, type: "error" });
    } else {
      track("club_joined", {
        org_id: org.organization_id,
        organization_type: org.organization_type,
      });
      setToast({ msg: `Joined ${org.name}`, type: "success" });
    }
  };

  const leave = async () => {
    if (!user || !org) return;
    setBusy(true);
    const prev = members;
    setMembers((m) => m.filter((x) => x.user_id !== user.id));
    const { error } = await supabase
      .from("org_members")
      .delete()
      .eq("org_id", org.organization_id)
      .eq("user_id", user.id);
    setBusy(false);
    if (error) {
      setMembers(prev);
      setToast({ msg: error.message, type: "error" });
    } else {
      setToast({ msg: `Left ${org.name}`, type: "success" });
    }
  };

  return (
    <StudentLayout>
      <Link
        href="/dashboard/student/groups"
        className="mb-4 inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary"
      >
        <ArrowLeft size={16} /> Back to your groups
      </Link>

      {loading || userLoading ? (
        <div className="space-y-4">
          <div className="h-40 animate-pulse rounded-xl bg-gray-200" />
          <div className="h-24 animate-pulse rounded-xl bg-gray-200" />
        </div>
      ) : notFound || !org ? (
        <div className="py-16 text-center text-muted-foreground">
          <Users size={40} className="mx-auto mb-3 opacity-60" />
          <p className="font-medium">This club or group could not be found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {/* ── Banner + header ─────────────────────────────────────── */}
          <div className="overflow-hidden rounded-xl bg-white shadow">
            <div className="h-32 bg-gradient-to-br from-primary to-purple-400 sm:h-40" />
            <div className="flex flex-col gap-4 p-4 sm:flex-row sm:items-end sm:justify-between sm:p-6">
              <div className="flex items-end gap-4">
                <div className="-mt-16 h-24 w-24 shrink-0 overflow-hidden rounded-xl border-4 border-white bg-white shadow">
                  {org.logo_url ? (
                    <Image
                      src={org.logo_url}
                      alt={org.name}
                      width={96}
                      height={96}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-primary/10">
                      <Users size={32} className="text-primary" />
                    </div>
                  )}
                </div>
                <div className="min-w-0 pb-1">
                  <h1 className="truncate text-2xl font-bold text-foreground">
                    {org.name}
                  </h1>
                  <p className="text-sm capitalize text-muted-foreground">
                    {org.organization_type} · {members.length}{" "}
                    {members.length === 1 ? "member" : "members"}
                  </p>
                </div>
              </div>

              <div className="shrink-0">
                {isMember ? (
                  <Button variant="outline" onClick={leave} disabled={busy}>
                    {busy ? "Leaving…" : "Leave"}
                  </Button>
                ) : (
                  <Button onClick={join} disabled={busy}>
                    {busy ? "Joining…" : `Join ${org.organization_type}`}
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* ── Description ─────────────────────────────────────────── */}
          {org.description && (
            <div className="rounded-xl bg-white p-6 shadow">
              <h2 className="mb-2 text-lg font-semibold text-foreground">About</h2>
              <p className="whitespace-pre-line text-sm text-gray-700">
                {org.description}
              </p>
            </div>
          )}

          {/* ── Members ─────────────────────────────────────────────── */}
          <div className="rounded-xl bg-white p-6 shadow">
            <h2 className="mb-4 text-lg font-semibold text-foreground">
              Members ({members.length})
            </h2>
            {members.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No members yet — be the first to join!
              </p>
            ) : (
              <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                {members.map((m) => (
                  <li
                    key={m.user_id}
                    className="flex items-center gap-3 rounded-lg border p-3"
                  >
                    <Image
                      src={m.users?.avatar_url || "/images/overyonder-logo.png"}
                      alt={memberName(m)}
                      width={40}
                      height={40}
                      className="h-10 w-10 rounded-full object-cover"
                    />
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {memberName(m)}
                      </p>
                      <p className="flex items-center gap-1 text-xs text-muted-foreground">
                        <span className="capitalize">{m.role}</span>
                        {m.is_executive && (
                          <span className="flex items-center gap-0.5 text-amber-600">
                            <Star size={11} /> Executive
                          </span>
                        )}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </StudentLayout>
  );
}
