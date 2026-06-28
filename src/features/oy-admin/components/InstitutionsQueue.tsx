"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  fetchInstitutions,
  fetchInstitutionRequests,
  setInstitutionStatus,
  setRequestStatus,
  type InstitutionStatus,
  type OyInstitution,
  type OyInstitutionRequest,
} from "@/features/oy-admin/api";

const STATUS_STYLES: Record<string, string> = {
  pending: "bg-amber-100 text-amber-800",
  approved: "bg-green-100 text-green-700",
  rejected: "bg-red-100 text-red-700",
  contacted: "bg-blue-100 text-blue-700",
};

function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
        STATUS_STYLES[status] ?? "bg-gray-100 text-gray-700"
      }`}
    >
      {status}
    </span>
  );
}

function formatDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString() : "—";
}

export default function InstitutionsQueue() {
  const [institutions, setInstitutions] = useState<OyInstitution[] | null>(null);
  const [requests, setRequests] = useState<OyInstitutionRequest[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetchInstitutions()
      .then(setInstitutions)
      .catch(() => setError("Couldn't load institutions."));
    fetchInstitutionRequests()
      .then(setRequests)
      .catch(() => setRequests([]));
  }, []);

  async function decideInstitution(id: string, status: InstitutionStatus) {
    if (!institutions) return;
    const prev = institutions;
    setBusy(id);
    setError(null);
    // Optimistic: flip the row immediately; it re-buckets into pending/decided.
    setInstitutions((list) =>
      (list ?? []).map((i) =>
        i.institution_id === id ? { ...i, status } : i
      )
    );
    try {
      await setInstitutionStatus(id, status);
    } catch {
      setInstitutions(prev);
      setError("Update failed. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  async function decideRequest(id: string, status: string) {
    if (!requests) return;
    const prev = requests;
    setBusy(id);
    setError(null);
    setRequests((list) =>
      (list ?? []).map((r) => (r.request_id === id ? { ...r, status } : r))
    );
    try {
      await setRequestStatus(id, status);
    } catch {
      setRequests(prev);
      setError("Update failed. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  const pending = (institutions ?? []).filter((i) => i.status === "pending");
  const decided = (institutions ?? []).filter((i) => i.status !== "pending");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Institutions</h1>
        <p className="text-sm text-muted-foreground">
          Approve schools to release their members from the pending holding page.
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">
          {error}
        </p>
      )}

      <Tabs defaultValue="institutions" className="gap-4">
        <TabsList>
          <TabsTrigger value="institutions">
            Institutions
            {pending.length > 0 && (
              <span className="ml-1.5 rounded-full bg-amber-500 px-1.5 text-xs font-semibold text-white">
                {pending.length}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="requests">
            School requests
            {requests && requests.length > 0 && (
              <span className="ml-1.5 rounded-full bg-gray-400 px-1.5 text-xs font-semibold text-white">
                {requests.length}
              </span>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="institutions">
          {institutions === null ? (
            <p className="text-sm text-muted-foreground">Loading institutions…</p>
          ) : institutions.length === 0 ? (
            <p className="text-sm text-muted-foreground">No institutions yet.</p>
          ) : (
            <div className="overflow-auto rounded-lg border bg-white shadow-sm">
              <table className="min-w-full divide-y">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-2">Institution</th>
                    <th className="px-4 py-2">Domains</th>
                    <th className="px-4 py-2">Created</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {[...pending, ...decided].map((inst) => (
                    <tr
                      key={inst.institution_id}
                      className={inst.status === "pending" ? "bg-amber-50/40" : ""}
                    >
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">
                          {inst.institution_name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {inst.abbreviated_name}
                        </div>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {inst.institution_domains.length > 0
                          ? inst.institution_domains
                              .map((d) => d.domain)
                              .join(", ")
                          : "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {formatDate(inst.created_at)}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={inst.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            disabled={
                              busy === inst.institution_id ||
                              inst.status === "approved"
                            }
                            onClick={() =>
                              decideInstitution(inst.institution_id, "approved")
                            }
                          >
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={
                              busy === inst.institution_id ||
                              inst.status === "rejected"
                            }
                            onClick={() =>
                              decideInstitution(inst.institution_id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>

        <TabsContent value="requests">
          {requests === null ? (
            <p className="text-sm text-muted-foreground">Loading requests…</p>
          ) : requests.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No school requests yet.
            </p>
          ) : (
            <div className="overflow-auto rounded-lg border bg-white shadow-sm">
              <table className="min-w-full divide-y">
                <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
                  <tr>
                    <th className="px-4 py-2">Requested by</th>
                    <th className="px-4 py-2">Domain</th>
                    <th className="px-4 py-2">Note</th>
                    <th className="px-4 py-2">Status</th>
                    <th className="px-4 py-2 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {requests.map((req) => (
                    <tr key={req.request_id}>
                      <td className="px-4 py-3">
                        <div className="font-medium text-foreground">
                          {req.user_email}
                        </div>
                        {req.director_email && (
                          <div className="text-xs text-gray-500">
                            Director: {req.director_email}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {req.email_domain ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-600">
                        {req.note ?? "—"}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge status={req.status} />
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex justify-end gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={
                              busy === req.request_id ||
                              req.status === "contacted"
                            }
                            onClick={() =>
                              decideRequest(req.request_id, "contacted")
                            }
                          >
                            Mark contacted
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            disabled={
                              busy === req.request_id ||
                              req.status === "rejected"
                            }
                            onClick={() =>
                              decideRequest(req.request_id, "rejected")
                            }
                          >
                            Reject
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
