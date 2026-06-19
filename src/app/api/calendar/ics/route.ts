import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";

export const revalidate = 3600;

export async function GET(req: NextRequest) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return new NextResponse("Unauthorized", { status: 401, headers });
  }

  const { data, error } = await supabase
    .from("events")
    .select("event_id,title,description,start_date,end_date")
    .eq("created_by", user.id)
    .order("start_date", { ascending: true });

  if (error) {
    return new NextResponse(error.message, { status: 500, headers });
  }

  const escapeText = (text: string) =>
    text.replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");

  const formatDate = (date: string | Date) => {
    const d = typeof date === "string" ? new Date(date) : date;
    return d.toISOString().replace(/[-:]/g, "").split(".")[0] + "Z";
  };

  let ics = "BEGIN:VCALENDAR\nVERSION:2.0\nPRODID:-//CampusLink//EN";

  for (const event of data ?? []) {
    ics += `\nBEGIN:VEVENT\nUID:${event.event_id}\nDTSTAMP:${formatDate(
      new Date()
    )}\nDTSTART:${formatDate(event.start_date)}\nDTEND:${formatDate(
      event.end_date
    )}\nSUMMARY:${escapeText(event.title)}\nDESCRIPTION:${escapeText(
      event.description || ""
    )}\nEND:VEVENT`;
  }

  ics += "\nEND:VCALENDAR";

  const res = new NextResponse(ics, {
    status: 200,
    headers,
  });
  res.headers.set("Content-Type", "text/calendar; charset=utf-8");
  res.headers.set("Cache-Control", "no-cache");

  return res;
}

