"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { useCurrentUser } from "@/hooks/useCurrentUser";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/Toast";
import { supabase } from "@/lib/supabase";
import Image from "next/image";

export default function UserOnboardingForm() {
  const { user, loading } = useCurrentUser();
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [typeCategory, setTypeCategory] = useState<
    "Student" | "Faculty" | null
  >(null);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    about: "",
    avatarUrl: "",
    selectedRole: "Student" as "Student" | "Student Leader" | "Faculty",
  });

  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  useEffect(() => {
    if (!user || loading) return;

    const fetchTypeCategory = async () => {
      const domain = user.email.split("@")[1];
      try {
        const res = await fetch(
          `/api/institution_domains/check?domain=${domain}`,
          { credentials: "include" }
        );
        const data = await res.json();
        setTypeCategory(data.type_category);
        if (data.type_category === "Faculty") {
          setForm((f) => ({ ...f, selectedRole: "Faculty" }));
        }
      } catch (err) {
        setToast({ type: "error", msg: "Institution domain check failed" });
        console.error(err)
      }
    };

    fetchTypeCategory();
  }, [user, loading]);

  const handleSubmit = async () => {
    try {
      let avatarUrl = form.avatarUrl;

      if (avatarFile) {
        const uploadForm = new FormData();
        uploadForm.append("file", avatarFile);

        const uploadRes = await fetch("/api/upload/avatar", {
          method: "POST",
          body: uploadForm,
          credentials: "include",
        });

        const uploadData = await uploadRes.json();
        if (!uploadRes.ok)
          throw new Error(uploadData.message || "Failed to upload avatar");

        avatarUrl = uploadData.url;
      }

      const res = await fetch("/api/onboarding/user", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, avatarUrl }),
        credentials: "include",
      });

      if (!res.ok) throw new Error("Onboarding failed");

      // Best-effort: refresh so the onboarding=true claim is in the token
      // before the middleware re-checks. A transient refresh failure must not
      // abort the already-successful onboarding.
      try {
        await supabase.auth.refreshSession();
      } catch {
        /* ignore — middleware re-syncs from cookies on next navigation */
      }
      setToast({ type: "success", msg: "Welcome to OverYonder!" });
      router.push("/dashboard");
    } catch (err) {
      setToast({ type: "error", msg: (err as Error).message });
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 text-left">
      <h2 className="text-2xl font-bold text-primary mb-4">
        Complete Your Profile
      </h2>

      {step === 1 && (
        <>
          <Input
            placeholder="First Name"
            value={form.firstName}
            onChange={(e) => setForm({ ...form, firstName: e.target.value })}
            className="mb-4"
          />
          <Input
            placeholder="Last Name"
            value={form.lastName}
            onChange={(e) => setForm({ ...form, lastName: e.target.value })}
            className="mb-4"
          />
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">
              Upload Avatar
            </label>
            <Input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  setAvatarFile(file);
                  setAvatarPreview(URL.createObjectURL(file));
                }
              }}
            />
          </div>
          {avatarPreview && (
            <div className="mb-4">
              <Image
                src={avatarPreview}
                alt="Avatar Preview"
                className="w-24 h-24 object-cover rounded-full border"
              />
            </div>
          )}
          <Button
            className="w-full bg-primary text-white"
            onClick={() => setStep(2)}
          >
            Next
          </Button>
        </>
      )}

      {step === 2 && (
        <>
          <Textarea
            placeholder="Tell us a bit about you..."
            value={form.about}
            onChange={(e) => setForm({ ...form, about: e.target.value })}
            className="mb-4"
          />
          {typeCategory === "Student" && (
            <select
              value={form.selectedRole}
              onChange={(e) =>
                setForm({
                  ...form,
                  selectedRole: e.target.value as "Student" | "Student Leader",
                })
              }
              className="w-full px-4 py-2 border rounded-md mb-4"
            >
              <option value="Student">Student</option>
              <option value="Student Leader">Student Leader</option>
            </select>
          )}
          {typeCategory === "Faculty" && (
            <p className="text-sm text-gray-600 mb-2">Role: Faculty</p>
          )}
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setStep(1)}>
              Back
            </Button>
            <Button className="bg-primary text-white" onClick={handleSubmit}>
              Submit
            </Button>
          </div>
        </>
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
