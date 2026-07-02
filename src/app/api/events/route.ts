"use server";

import { NextRequest, NextResponse } from "next/server";
import { getSupabaseRouteHandlerClient } from "@/lib/supabaseRouteClient";
import { getAuthContext } from "@/lib/serverAuth";
import type { Database } from "@/lib/database.types";
import { createCalendarEvent } from "@/lib/googleClient";
import { revalidateTag } from "next/cache";

const PAGE_SIZE = 10;

export async function GET(req: NextRequest) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const { searchParams } = new URL(req.url);
  const status = searchParams.get("status");
  const search = searchParams.get("q");
  const page = Number(searchParams.get("page") ?? "1");
  const sort = searchParams.get("sort") ?? "start_date";
  const order = searchParams.get("order") ?? "asc";
  const upcoming = searchParams.get("upcoming") === "true";
  const live = searchParams.get("live") === "true";
  const from = (page - 1) * PAGE_SIZE;
  const to = from + PAGE_SIZE - 1;

  let query = supabase
    .from("events")
    .select("*, organization:organizations(name)", { count: "exact" });

  if (status) {
    query = query.eq(
      "status",
      status as Database["public"]["Enums"]["event_status"]
    );
  }
  if (search) {
    query = query.ilike("title", `%${search}%`);
  }
  if (upcoming) {
    query = query.gte("start_date", new Date().toISOString());
  }
  if (live) {
    const now = new Date().toISOString();
    query = query.lte("start_date", now).gte("end_date", now);
  }

  const { data, error, count } = await query
    .order(sort, { ascending: order !== "desc" })
    .range(from, to);

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }

  return NextResponse.json({ events: data, count }, { status: 200, headers });
}

export async function POST(req: NextRequest) {
  const { supabase, headers } = getSupabaseRouteHandlerClient(req);
  const body = await req.json();
  const auth = await getAuthContext(supabase);
  if (!auth) {
    return NextResponse.json({ error: "Unauthorized" }, {
      status: 401,
      headers,
    });
  }

  const payload = {
    ...body,
    created_by: body.created_by ?? auth.userId,
    institution_id: body.institution_id ?? auth.institutionId,
  };

  const { data, error } = await supabase
    .from("events")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500, headers }
    );
  }
  try {
    await createCalendarEvent(auth.userId, data);
  } catch (e) {
    console.error(e);
  }
  revalidateTag("events");

  return NextResponse.json({ event: data }, { status: 201, headers });
}

