"use client";

import { useEffect, useState } from "react";
import StudentLayout from "@/app/dashboard/StudentLayout";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface ProfileForm {
  first_name: string;
  last_name: string;
  about: string;
  website_url: string;
}

const EMPTY: ProfileForm = {
  first_name: "",
  last_name: "",
  about: "",
  website_url: "",
};

export default function StudentSettingsPage() {
  const { user, loading: userLoading } = useCurrentUser();
  const [form, setForm] = useState<ProfileForm>(EMPTY);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (userLoading) return;
    if (!user) {
      setLoading(false);
      return;
    }
    async function load() {
      setLoading(true);
      const { data } = await supabase
        .from("users")
        .select("first_name, last_name, about, website_url")
        .eq("user_id", user!.id)
        .single();
      if (data) {
        setForm({
          first_name: data.first_name ?? "",
          last_name: data.last_name ?? "",
          about: data.about ?? "",
          website_url: data.website_url ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, [user, userLoading]);

  const update = (key: keyof ProfileForm, value: string) =>
    setForm((f) => ({ ...f, [key]: value }));

  const handleSave = async () => {
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("users")
      .update({
        first_name: form.first_name,
        last_name: form.last_name,
        about: form.about,
        website_url: form.website_url,
      })
      .eq("user_id", user.id);
    setSaving(false);
    setToast(
      error
        ? { msg: error.message, type: "error" }
        : { msg: "Profile updated", type: "success" }
    );
  };

  return (
    <StudentLayout>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your profile information.
        </p>
      </header>

      {loading ? (
        <div className="max-w-lg space-y-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-10 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="max-w-lg space-y-4 bg-white rounded-xl shadow p-6">
          <div>
            <label className="block text-sm font-medium mb-1">Email</label>
            <Input value={user?.email ?? ""} disabled />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">
                First name
              </label>
              <Input
                value={form.first_name}
                onChange={(e) => update("first_name", e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">
                Last name
              </label>
              <Input
                value={form.last_name}
                onChange={(e) => update("last_name", e.target.value)}
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">About</label>
            <textarea
              value={form.about}
              onChange={(e) => update("about", e.target.value)}
              rows={3}
              className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Tell others a bit about yourself"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Website</label>
            <Input
              value={form.website_url}
              onChange={(e) => update("website_url", e.target.value)}
              placeholder="https://"
            />
          </div>
          <div className="pt-2">
            <Button onClick={handleSave} disabled={saving}>
              {saving ? "Saving..." : "Save changes"}
            </Button>
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
