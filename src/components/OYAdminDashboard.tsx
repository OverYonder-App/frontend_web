"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  fetchInstitutions,
  fetchMetrics,
  type OyInstitution,
  type OyMetrics,
} from "@/features/oy-admin/api";

interface MetricDef {
  label: string;
  value: number;
  highlight?: boolean;
}

export default function OYAdminDashboard() {
  const [metrics, setMetrics] = useState<OyMetrics | null>(null);
  const [pending, setPending] = useState<OyInstitution[] | null>(null);

  useEffect(() => {
    fetchMetrics().then(setMetrics).catch(() => setMetrics(null));
    fetchInstitutions()
      .then((list) => setPending(list.filter((i) => i.status === "pending")))
      .catch(() => setPending([]));
  }, []);

  const cards: MetricDef[] = [
    { label: "Institutions", value: metrics?.institutionsTotal ?? 0 },
    {
      label: "Pending Approvals",
      value: metrics?.institutionsPending ?? 0,
      highlight: (metrics?.institutionsPending ?? 0) > 0,
    },
    { label: "Total Users", value: metrics?.usersTotal ?? 0 },
    { label: "Total Events", value: metrics?.eventsTotal ?? 0 },
    { label: "Flagged Reports", value: metrics?.reportsPending ?? 0 },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-primary">OY Admin Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-5">
        {cards.map((m) => (
          <Card
            key={m.label}
            className={m.highlight ? "border-amber-300 bg-amber-50" : "bg-background"}
          >
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {m.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">
                {metrics === null ? "—" : m.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-base">Pending institutions</CardTitle>
          <Link href="/dashboard/oy/institutions">
            <Button size="sm" variant="outline">
              Review all
            </Button>
          </Link>
        </CardHeader>
        <CardContent>
          {pending === null ? (
            <p className="text-sm text-muted-foreground">Loading…</p>
          ) : pending.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No institutions are awaiting approval. 🎉
            </p>
          ) : (
            <ul className="divide-y">
              {pending.map((inst) => (
                <li
                  key={inst.institution_id}
                  className="flex items-center justify-between py-2"
                >
                  <div>
                    <p className="font-medium text-foreground">
                      {inst.institution_name}
                    </p>
                    <p className="text-xs text-gray-500">
                      {inst.institution_domains.map((d) => d.domain).join(", ") ||
                        inst.abbreviated_name}
                    </p>
                  </div>
                  <Link href="/dashboard/oy/institutions">
                    <Button size="sm">Review</Button>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
