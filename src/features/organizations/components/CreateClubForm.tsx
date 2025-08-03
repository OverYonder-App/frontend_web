"use client";

import { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import { createClub, type Organization, type OrganizationInsert } from "../api";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Toast } from "@/components/Toast";

interface SimpleUser {
  user_id: string;
  first_name: string | null;
  last_name: string | null;
  username: string;
}

interface Props {
  onCreated?: (club: Organization) => void;
}

export default function CreateClubForm({ onCreated }: Props) {
  const { user } = useCurrentUser();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<"club" | "group">("club");
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [createdBy, setCreatedBy] = useState<SimpleUser | null>(null);
  const [userQuery, setUserQuery] = useState("");
  const [users, setUsers] = useState<SimpleUser[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ msg: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    if (!userQuery) {
      setUsers([]);
      return;
    }
    const fetchUsers = async () => {
      const { data } = await supabase
        .from("users")
        .select("user_id, first_name, last_name, username")
        .ilike("username", `%${userQuery}%`)
        .limit(10);
      if (data) setUsers(data as SimpleUser[]);
    };
    fetchUsers();
  }, [userQuery]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!name || !description || !createdBy || !logoFile) {
      setToast({ msg: "Please fill all required fields", type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      const clubId = crypto.randomUUID();
      const ext = logoFile.name.split(".").pop();
      const filePath = `${user.institution_id}/clubs/${clubId}/logo.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("oy-media")
        .upload(filePath, logoFile, { upsert: true });
      if (uploadError) throw uploadError;
      const { data: urlData } = supabase.storage
        .from("oy-media")
        .getPublicUrl(filePath);
      const payload: OrganizationInsert = {
        organization_id: clubId,
        name,
        description,
        logo_url: urlData.publicUrl,
        organization_type: type,
        created_by: createdBy.user_id,
        approved_by: user.id,
        institution_id: user.institution_id,
      } as OrganizationInsert;
      const newClub = await createClub(payload);
      setToast({ msg: "Club created successfully", type: "success" });
      setName("");
      setDescription("");
      setType("club");
      setLogoFile(null);
      setCreatedBy(null);
      setUserQuery("");
      if (onCreated) onCreated(newClub);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err);
      setToast({ msg: message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium">Name</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1 w-full rounded border px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 w-full rounded border px-2 py-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "club" | "group")}
          className="mt-1 w-full rounded border px-2 py-1"
        >
          <option value="club">Club</option>
          <option value="group">Group</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Created By</label>
        <Combobox value={createdBy} onChange={setCreatedBy}>
          <Combobox.Input
            className="w-full border rounded px-2 py-1"
            displayValue={(u: SimpleUser) =>
              u ? u.username : ""
            }
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Search users..."
          />
          {users.length > 0 && (
            <Combobox.Options className="mt-1 max-h-40 overflow-auto rounded border bg-white">
              {users.map((u) => (
                <Combobox.Option
                  key={u.user_id}
                  value={u}
                  className="p-2 cursor-pointer hover:bg-gray-100"
                >
                  {u.first_name ? `${u.first_name} ${u.last_name}` : u.username}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </Combobox>
      </div>
      <div>
        <label className="block text-sm font-medium">Logo</label>
        <input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          className="mt-1"
        />
      </div>
      <div className="pt-2">
        <button
          type="submit"
          disabled={submitting}
          className="rounded bg-blue-600 px-4 py-2 text-white disabled:opacity-50"
        >
          Create
        </button>
      </div>
      {toast && (
        <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />
      )}
    </form>
  );
}
