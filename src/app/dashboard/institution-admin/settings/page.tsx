"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Toast } from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import { useCurrentUser } from "@/hooks/useCurrentUser";

interface InstitutionForm {
  institution_name: string;
  abbreviated_name: string;
  address: string;
  primary_color: string;
  secondary_color: string;
}

interface AccountForm {
  first_name: string;
  last_name: string;
  about: string;
  website_url: string;
}

const DEFAULT_PRIMARY = "#745296";
const DEFAULT_SECONDARY = "#a78bca";

export default function AdminSettingsPage() {
  const { user, loading: userLoading } = useCurrentUser();

  const [institution, setInstitution] = useState<InstitutionForm | null>(null);
  const [account, setAccount] = useState<AccountForm>({
    first_name: "",
    last_name: "",
    about: "",
    website_url: "",
  });
  const [loading, setLoading] = useState(true);
  const [savingInstitution, setSavingInstitution] = useState(false);
  const [savingAccount, setSavingAccount] = useState(false);
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
      const [inst, acct] = await Promise.all([
        user!.institution_id
          ? supabase
              .from("institutions")
              .select(
                "institution_name, abbreviated_name, address, primary_color, secondary_color"
              )
              .eq("institution_id", user!.institution_id)
              .single()
          : Promise.resolve({ data: null }),
        supabase
          .from("users")
          .select("first_name, last_name, about, website_url")
          .eq("user_id", user!.id)
          .single(),
      ]);

      if (inst.data) {
        setInstitution({
          institution_name: inst.data.institution_name ?? "",
          abbreviated_name: inst.data.abbreviated_name ?? "",
          address: inst.data.address ?? "",
          primary_color: inst.data.primary_color ?? DEFAULT_PRIMARY,
          secondary_color: inst.data.secondary_color ?? DEFAULT_SECONDARY,
        });
      }
      if (acct.data) {
        setAccount({
          first_name: acct.data.first_name ?? "",
          last_name: acct.data.last_name ?? "",
          about: acct.data.about ?? "",
          website_url: acct.data.website_url ?? "",
        });
      }
      setLoading(false);
    }
    load();
  }, [user, userLoading]);

  const updateInstitution = (key: keyof InstitutionForm, value: string) =>
    setInstitution((f) => (f ? { ...f, [key]: value } : f));
  const updateAccount = (key: keyof AccountForm, value: string) =>
    setAccount((f) => ({ ...f, [key]: value }));

  const saveInstitution = async () => {
    if (!user?.institution_id || !institution) return;
    setSavingInstitution(true);
    const { error } = await supabase
      .from("institutions")
      .update({
        institution_name: institution.institution_name,
        abbreviated_name: institution.abbreviated_name,
        address: institution.address || null,
        primary_color: institution.primary_color,
        secondary_color: institution.secondary_color,
      })
      .eq("institution_id", user.institution_id);
    setSavingInstitution(false);
    setToast(
      error
        ? { msg: error.message, type: "error" }
        : { msg: "Institution updated", type: "success" }
    );
  };

  const saveAccount = async () => {
    if (!user) return;
    setSavingAccount(true);
    const { error } = await supabase
      .from("users")
      .update({
        first_name: account.first_name,
        last_name: account.last_name,
        about: account.about,
        website_url: account.website_url,
      })
      .eq("user_id", user.id);
    setSavingAccount(false);
    setToast(
      error
        ? { msg: error.message, type: "error" }
        : { msg: "Profile updated", type: "success" }
    );
  };

  return (
    <div>
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Manage your institution and your account.
        </p>
      </header>

      {loading ? (
        <div className="max-w-2xl space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="h-10 animate-pulse rounded bg-gray-200" />
          ))}
        </div>
      ) : (
        <div className="max-w-2xl space-y-8">
          {/* ── Institution ─────────────────────────────────────────── */}
          <section className="space-y-4 rounded-xl bg-white p-6 shadow">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Institution</h2>
              <p className="text-sm text-muted-foreground">
                These details appear across your school&rsquo;s OverYonder space.
              </p>
            </div>

            {!institution ? (
              <p className="text-sm text-muted-foreground">
                No institution is associated with your account.
              </p>
            ) : (
              <>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Institution name
                    </label>
                    <Input
                      value={institution.institution_name}
                      onChange={(e) =>
                        updateInstitution("institution_name", e.target.value)
                      }
                    />
                  </div>
                  <div>
                    <label className="mb-1 block text-sm font-medium">
                      Abbreviation
                    </label>
                    <Input
                      value={institution.abbreviated_name}
                      onChange={(e) =>
                        updateInstitution("abbreviated_name", e.target.value)
                      }
                    />
                  </div>
                </div>
                <div>
                  <label className="mb-1 block text-sm font-medium">Address</label>
                  <Input
                    value={institution.address}
                    onChange={(e) =>
                      updateInstitution("address", e.target.value)
                    }
                    placeholder="123 Campus Dr, City, State"
                  />
                </div>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  <ColorField
                    label="Primary color"
                    value={institution.primary_color}
                    onChange={(v) => updateInstitution("primary_color", v)}
                  />
                  <ColorField
                    label="Secondary color"
                    value={institution.secondary_color}
                    onChange={(v) => updateInstitution("secondary_color", v)}
                  />
                </div>
                <div className="pt-2">
                  <Button onClick={saveInstitution} disabled={savingInstitution}>
                    {savingInstitution ? "Saving..." : "Save institution"}
                  </Button>
                </div>
              </>
            )}
          </section>

          {/* ── Personal account ────────────────────────────────────── */}
          <section className="space-y-4 rounded-xl bg-white p-6 shadow">
            <div>
              <h2 className="text-lg font-semibold text-foreground">
                Your account
              </h2>
              <p className="text-sm text-muted-foreground">
                Your personal profile information.
              </p>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Email</label>
              <Input value={user?.email ?? ""} disabled />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-sm font-medium">
                  First name
                </label>
                <Input
                  value={account.first_name}
                  onChange={(e) => updateAccount("first_name", e.target.value)}
                />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium">
                  Last name
                </label>
                <Input
                  value={account.last_name}
                  onChange={(e) => updateAccount("last_name", e.target.value)}
                />
              </div>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">About</label>
              <textarea
                value={account.about}
                onChange={(e) => updateAccount("about", e.target.value)}
                rows={3}
                className="w-full rounded-md border bg-transparent px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Tell others a bit about yourself"
              />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium">Website</label>
              <Input
                value={account.website_url}
                onChange={(e) => updateAccount("website_url", e.target.value)}
                placeholder="https://"
              />
            </div>
            <div className="pt-2">
              <Button onClick={saveAccount} disabled={savingAccount}>
                {savingAccount ? "Saving..." : "Save account"}
              </Button>
            </div>
          </section>
        </div>
      )}

      {toast && (
        <Toast
          message={toast.msg}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

function ColorField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  const isHex = /^#[0-9a-fA-F]{6}$/.test(value);
  return (
    <div>
      <label className="mb-1 block text-sm font-medium">{label}</label>
      <div className="flex items-center gap-2">
        <input
          type="color"
          value={isHex ? value : "#000000"}
          onChange={(e) => onChange(e.target.value)}
          aria-label={label}
          className="h-9 w-12 cursor-pointer rounded border bg-transparent p-1"
        />
        <Input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="#745296"
          className="font-mono"
        />
      </div>
    </div>
  );
}
