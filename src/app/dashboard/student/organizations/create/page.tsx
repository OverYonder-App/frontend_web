"use client";

import { Suspense, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StudentLayout from "@/app/dashboard/StudentLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toast } from "@/components/Toast";

function CreateOrgForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [type, setType] = useState<"club" | "group">(
    searchParams.get("type") === "group" ? "group" : "club"
  );
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{
    msg: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async () => {
    if (!name.trim()) {
      setToast({ msg: "Give it a name", type: "error" });
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/organizations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: name.trim(),
          description: description.trim(),
          organization_type: type,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to create");

      setToast({
        msg:
          type === "group"
            ? "Group created!"
            : "Club submitted for approval!",
        type: "success",
      });
      router.push("/dashboard/student/groups");
    } catch (e) {
      setToast({ msg: (e as Error).message, type: "error" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-primary">
          Create a {type === "group" ? "group" : "club"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {type === "group"
            ? "Groups are active right away."
            : "Clubs are submitted to your institution for approval."}
        </p>
      </header>

      <div className="inline-flex rounded-md bg-muted p-1">
        {(["club", "group"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setType(t)}
            className={`rounded px-4 py-1 text-sm capitalize ${
              type === t
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      <div className="space-y-3">
        <Input
          placeholder={`${type === "group" ? "Group" : "Club"} name`}
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <Textarea
          placeholder="What's it about?"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="flex gap-2">
        <Button
          onClick={handleSubmit}
          disabled={submitting}
          className="bg-primary text-primary-foreground hover:bg-[#624080]"
        >
          {submitting ? "Creating..." : `Create ${type}`}
        </Button>
        <Button variant="outline" onClick={() => router.back()}>
          Cancel
        </Button>
      </div>

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

export default function StudentCreateOrgPage() {
  return (
    <StudentLayout>
      <Suspense fallback={null}>
        <CreateOrgForm />
      </Suspense>
    </StudentLayout>
  );
}
