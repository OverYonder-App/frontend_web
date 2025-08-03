"use client";

import { useEffect, useState } from "react";
import { Combobox } from "@headlessui/react";
import { createClub, type Organization, type OrganizationInsert } from "../api";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Toast } from "@/components/Toast";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

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
      if (!user?.institution_id) return;
      const { data } = await supabase
        .from("users")
        .select("user_id, first_name, last_name, username")
        .eq("institution_id", user.institution_id)
        .or(
          `username.ilike.%${userQuery}%,first_name.ilike.%${userQuery}%,last_name.ilike.%${userQuery}%`
        )
        .limit(10);
      if (data) setUsers(data as SimpleUser[]);
    };
    fetchUsers();
  }, [userQuery, user?.institution_id]);

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
    <form
      onSubmit={handleSubmit}
      className="p-4 bg-gray-100 rounded-xl shadow space-y-4"
    >
      <h1 className="text-xl font-semibold">Create Club</h1>
      <div>
        <label className="block text-sm font-medium">Name</label>
        <Input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1"
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Type</label>
        <select
          value={type}
          onChange={(e) => setType(e.target.value as "club" | "group")}
          className="mt-1 h-9 w-full rounded-md border px-3"
        >
          <option value="club">Club</option>
          <option value="group">Group</option>
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Created By</label>
        <Combobox value={createdBy} onChange={setCreatedBy}>
          <Combobox.Input
            as={Input}
            className="mt-1"
            displayValue={(u: SimpleUser) =>
              u
                ? u.first_name
                  ? `${u.first_name} ${u.last_name} (@${u.username})`
                  : u.username
                : ""
            }
            onChange={(e) => setUserQuery(e.target.value)}
            placeholder="Search users..."
          />
          {users.length > 0 && (
            <Combobox.Options className="mt-1 max-h-40 overflow-auto rounded-md border bg-background shadow">
              {users.map((u) => (
                <Combobox.Option
                  key={u.user_id}
                  value={u}
                  className="cursor-pointer p-2 hover:bg-muted"
                >
                  {u.first_name
                    ? `${u.first_name} ${u.last_name} (@${u.username})`
                    : u.username}
                </Combobox.Option>
              ))}
            </Combobox.Options>
          )}
        </Combobox>
      </div>
      <div>
        <label className="block text-sm font-medium">Logo</label>
        <Input
          type="file"
          accept="image/*"
          onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
          className="mt-1"
        />
      </div>
      <div className="pt-2">
        <Button type="submit" disabled={submitting} className="w-full">
          Create
        </Button>
      </div>
      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </form>
  );
}
