"use client";

import dynamic from "next/dynamic";
const CreateClubForm = dynamic(
  () => import("@/features/organizations/components/CreateClubForm"),
  { ssr: false }
);

export default function Page() {
  return <CreateClubForm />;
}

