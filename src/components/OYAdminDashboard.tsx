"use client"

import { useState } from "react"
import InstitutionSwitcher from "@/features/institutions/components/InstitutionSwitcher"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

interface Metric {
  label: string
  value: number
}

export default function OYAdminDashboard() {
  const [metrics] = useState<Metric[]>([
    { label: "Total Events", value: 0 },
    { label: "Pending Approvals", value: 0 },
    { label: "Total Users", value: 0 },
    { label: "Flagged Reports", value: 0 },
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-primary">OY Admin Dashboard</h1>
        <InstitutionSwitcher />
      </div>

      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {metrics.map((m) => (
          <Card key={m.label} className="bg-background">
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {m.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-2xl font-semibold text-foreground">{m.value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Tabs defaultValue="institutions" className="flex flex-col gap-4 md:flex-row">
        <div className="md:w-48">
          <TabsList className="flex md:flex-col w-full">
            <TabsTrigger value="institutions">Institutions</TabsTrigger>
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="media">Media</TabsTrigger>
          </TabsList>
        </div>
        <div className="flex-1">
          <TabsContent value="institutions">
            <InstitutionTable />
          </TabsContent>
          <TabsContent value="users">
            <UsersTable />
          </TabsContent>
          <TabsContent value="reports">
            <ReportsTable />
          </TabsContent>
          <TabsContent value="media">
            <MediaTable />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  )
}

function TableWrapper({
  headers,
  rows,
}: {
  headers: string[]
  rows: React.ReactNode[][]
}) {
  return (
    <div className="overflow-auto rounded-lg border bg-white shadow">
      <table className="min-w-full divide-y bg-white">
        <thead className="bg-gray-50">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2 text-left font-medium">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y bg-white">
          {rows.map((r, i) => (
            <tr key={i} className="hover:bg-gray-50">
              {r.map((c, j) => (
                <td key={j} className="px-4 py-2">
                  {c}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function InstitutionTable() {
  const headers = ["Name", "Domain"]
  const rows = [
    ["College of Idaho", "college.edu"],
    ["University of Idaho", "uidaho.edu"],
  ]
  return <TableWrapper headers={headers} rows={rows} />
}

function UsersTable() {
  const headers = ["Email", "Role"]
  const rows = [
    ["admin@example.com", "Institution Admin"],
    ["user@example.com", "Student"],
  ]
  return <TableWrapper headers={headers} rows={rows} />
}

function ReportsTable() {
  const headers = ["Type", "Status"]
  const rows = [
    ["Event", "Open"],
    ["Media", "Resolved"],
  ]
  return <TableWrapper headers={headers} rows={rows} />
}

function MediaTable() {
  const headers = ["File", "Flagged"]
  const rows = [
    ["party.jpg", "No"],
    ["logo.png", "Yes"],
  ]
  return <TableWrapper headers={headers} rows={rows} />
}
