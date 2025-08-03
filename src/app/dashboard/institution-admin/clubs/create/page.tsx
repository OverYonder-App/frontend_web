"use client";

import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const CreateClubForm = dynamic(
  () => import("@/features/organizations/components/CreateClubForm"),
  { ssr: false }
);

export default function Page() {
  return (
    <Card className="mx-auto max-w-xl">
      <CardHeader>
        <CardTitle>Create Club</CardTitle>
      </CardHeader>
      <CardContent>
        <CreateClubForm />
      </CardContent>
    </Card>
  );
}

