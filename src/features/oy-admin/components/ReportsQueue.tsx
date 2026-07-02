"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  fetchReports,
  setReportStatus,
  type OyReport,
  type ReportStatus,
} from "@/features/oy-admin/api";

function formatDate(iso: string | null): string {
  return iso ? new Date(iso).toLocaleDateString() : "—";
}

export default function ReportsQueue() {
  const [reports, setReports] = useState<OyReport[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  useEffect(() => {
    fetchReports()
      .then(setReports)
      .catch(() => setError("Couldn't load reports."));
  }, []);

  async function decide(id: string, status: ReportStatus) {
    if (!reports) return;
    const prev = reports;
    setBusy(id);
    setError(null);
    setReports((list) =>
      (list ?? []).map((r) => (r.report_id === id ? { ...r, status } : r))
    );
    try {
      await setReportStatus(id, status);
    } catch {
      setReports(prev);
      setError("Update failed. Please try again.");
    } finally {
      setBusy(null);
    }
  }

  const pendingCount = (reports ?? []).filter((r) => r.status === "pending").length;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-primary">Reports</h1>
        <p className="text-sm text-muted-foreground">
          Flagged content across all institutions{" "}
          {reports && pendingCount > 0 && (
            <span className="font-medium text-amber-700">
              · {pendingCount} unresolved
            </span>
          )}
        </p>
      </div>

      {error && (
        <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
      )}

      {reports === null ? (
        <p className="text-sm text-muted-foreground">Loading reports…</p>
      ) : reports.length === 0 ? (
        <p className="text-sm text-muted-foreground">No reports filed. 🎉</p>
      ) : (
        <div className="overflow-auto rounded-lg border bg-white shadow-sm">
          <table className="min-w-full divide-y">
            <thead className="bg-gray-50 text-left text-xs uppercase tracking-wide text-gray-500">
              <tr>
                <th className="px-4 py-2">Reason</th>
                <th className="px-4 py-2">Institution</th>
                <th className="px-4 py-2">Reported by</th>
                <th className="px-4 py-2">Filed</th>
                <th className="px-4 py-2">Status</th>
                <th className="px-4 py-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {reports.map((r) => (
                <tr
                  key={r.report_id}
                  className={r.status === "pending" ? "bg-amber-50/40" : ""}
                >
                  <td className="max-w-xs px-4 py-3 text-sm text-foreground">
                    {r.reason}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {r.institutions?.abbreviated_name ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {r.reporter?.email ?? r.reporter?.username ?? "—"}
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-600">
                    {formatDate(r.created_at)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium capitalize ${
                        r.status === "pending"
                          ? "bg-amber-100 text-amber-800"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex justify-end">
                      {r.status === "pending" ? (
                        <Button
                          size="sm"
                          disabled={busy === r.report_id}
                          onClick={() => decide(r.report_id, "resolved")}
                        >
                          Resolve
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          disabled={busy === r.report_id}
                          onClick={() => decide(r.report_id, "pending")}
                        >
                          Reopen
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
