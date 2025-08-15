import Link from "next/link";
import { headers } from "next/headers";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSupabaseServerClient } from "@/lib/auth";

export default async function CalendarPage() {
  const supabase = await getSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let hasGoogle = false;
  if (user) {
    const { data } = await supabase
      .from("user_google_tokens")
      .select("user_id")
      .eq("user_id", user.id)
      .maybeSingle();
    hasGoogle = !!data;
  }

  const headersList = headers();
  const protocol = headersList.get("x-forwarded-proto") ?? "http";
  const host = headersList.get("host") ?? "";
  const icsUrl = `${protocol}://${host}/api/calendar/ics`;

  async function disconnect() {
    "use server";
    const supabase = await getSupabaseServerClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (user) {
      await supabase.from("user_google_tokens").delete().eq("user_id", user.id);
    }
  }

  return (
    <section className="max-w-xl mx-auto p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-2">Calendar Integrations</h1>
        {!hasGoogle && (
          <p className="text-sm text-muted-foreground">
            No calendars connected yet…
          </p>
        )}
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium">ICS Feed</label>
        <Input readOnly value={icsUrl} />
      </div>

      {hasGoogle ? (
        <form action={disconnect}>
          <Button variant="destructive" type="submit">
            Disconnect Google
          </Button>
        </form>
      ) : (
        <Link href="/api/calendar/auth">
          <Button>Connect Google Calendar</Button>
        </Link>
      )}
    </section>
  );
}

