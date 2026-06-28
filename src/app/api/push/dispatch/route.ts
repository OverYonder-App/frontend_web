import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import webpush from "web-push";
import type { Database } from "@/lib/database.types";

// Push reminder dispatcher. Meant to be hit once a minute by a scheduler
// (Vercel Cron or Supabase pg_cron+pg_net) carrying `Authorization: Bearer
// <CRON_SECRET>`. For every attendee of an upcoming event it sends a browser
// push at T-30 / T-15 / T-0, exactly once per (event, user, offset) thanks to
// the event_reminders_sent dedup ledger. Reads across all users with the
// service-role key (no user session), so RLS is intentionally bypassed.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const OFFSETS = [30, 15, 0];

function reminderBody(title: string, offset: number): string {
  if (offset === 0) return `${title} is starting now`;
  return `${title} starts in ${offset} minutes`;
}

// Vercel Cron invokes with GET (carrying `Authorization: Bearer <CRON_SECRET>`);
// Supabase pg_cron + pg_net would POST. Support both so the scheduler is a free
// deploy-time choice.
async function handle(req: NextRequest) {
  if (req.headers.get("authorization") !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT!,
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const admin = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  );

  const now = new Date();
  const nowMin = Math.floor(now.getTime() / 60000);

  // Upcoming approved events whose start is within the largest offset window.
  const { data: events } = await admin
    .from("events")
    .select("event_id, title, start_date")
    .eq("status", "approved")
    .gte("start_date", new Date(now.getTime() - 60_000).toISOString())
    .lte("start_date", new Date(now.getTime() + 31 * 60_000).toISOString());

  const summary = { dueReminders: 0, recorded: 0, sent: 0, failed: 0, pruned: 0 };

  if (!events || events.length === 0) {
    return NextResponse.json({ ok: true, ...summary });
  }

  const eventIds = events.map((e) => e.event_id);
  const { data: attendance } = await admin
    .from("event_attendance")
    .select("event_id, user_id")
    .in("event_id", eventIds);

  // Which (event, user, offset) reminders are due in this minute?
  type Due = { event_id: string; user_id: string; offset: number; title: string };
  const due: Due[] = [];
  for (const ev of events) {
    const startMin = Math.floor(new Date(ev.start_date).getTime() / 60000);
    const minutesUntil = startMin - nowMin;
    const offset = OFFSETS.find((o) => o === minutesUntil);
    if (offset === undefined) continue;
    for (const a of attendance ?? []) {
      if (a.event_id === ev.event_id) {
        due.push({ event_id: ev.event_id, user_id: a.user_id, offset, title: ev.title });
      }
    }
  }
  summary.dueReminders = due.length;
  if (due.length === 0) return NextResponse.json({ ok: true, ...summary });

  // Preload subscriptions for the due users.
  const dueUserIds = [...new Set(due.map((d) => d.user_id))];
  const { data: subs } = await admin
    .from("push_subscriptions")
    .select("endpoint, p256dh, auth, user_id")
    .in("user_id", dueUserIds);
  const subsByUser = new Map<string, NonNullable<typeof subs>>();
  for (const s of subs ?? []) {
    const list = subsByUser.get(s.user_id) ?? [];
    list.push(s);
    subsByUser.set(s.user_id, list);
  }

  for (const d of due) {
    // Claim this reminder; ignoreDuplicates means a second runner (or a retry)
    // gets nothing back and skips, so we never double-send.
    const { data: claimed } = await admin
      .from("event_reminders_sent")
      .upsert(
        { event_id: d.event_id, user_id: d.user_id, offset_min: d.offset },
        { onConflict: "event_id,user_id,offset_min", ignoreDuplicates: true }
      )
      .select();
    if (!claimed || claimed.length === 0) continue; // already handled
    summary.recorded += 1;

    const payload = JSON.stringify({
      title: "Event reminder",
      body: reminderBody(d.title, d.offset),
      url: `/event/${d.event_id}`,
      tag: `event-${d.event_id}`,
    });

    for (const sub of subsByUser.get(d.user_id) ?? []) {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload
        );
        summary.sent += 1;
      } catch (err: unknown) {
        summary.failed += 1;
        const status = (err as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) {
          await admin
            .from("push_subscriptions")
            .delete()
            .eq("endpoint", sub.endpoint);
          summary.pruned += 1;
        }
      }
    }
  }

  return NextResponse.json({ ok: true, ...summary });
}

export const GET = handle;
export const POST = handle;
