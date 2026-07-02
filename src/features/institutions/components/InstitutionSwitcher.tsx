"use client"

import { useInstitution } from "@/context/InstitutionContext"

const institutions = [
  { id: "1", name: "College of Idaho" },
  { id: "2", name: "University of Idaho" },
]

export default function InstitutionSwitcher() {
  const { institutionId, switchInstitution } = useInstitution()

  return (
    <select
      className="border-input bg-background text-foreground rounded-md border px-3 py-2 text-sm focus:outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]"
      value={institutionId || ""}
      onChange={(e) => switchInstitution(e.target.value)}
    >
      <option value="" disabled>
        Select Institution
      </option>
      {institutions.map((inst) => (
        <option key={inst.id} value={inst.id}>
          {inst.name}
        </option>
      ))}
    </select>
  )
}
