"use client";

import EditEventForm from "@/components/EditEventForm";
import dynamic from "next/dynamic";
import { EventRecord } from "@/lib/types";


// dynamically import so that @react-google-maps/api (which relies on window) never runs on the server


export default function Page() {
  
  // return <EditEventForm />;
  return <p>loading...</p>
}
