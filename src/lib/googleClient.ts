import { google, Auth, calendar_v3 } from "googleapis";
import { getSupabaseServerClient } from "./auth";
import type { Database } from "./database.types";

const clientId = process.env.GOOGLE_CLIENT_ID!;
const clientSecret = process.env.GOOGLE_CLIENT_SECRET!;
const redirectUri = process.env.GOOGLE_REDIRECT_URI;

export const createOAuth2Client = (tokens?: Auth.Credentials) => {
  const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);
  if (tokens) {
    client.setCredentials(tokens);
  }
  return client;
};

export const storeTokens = async (
  userId: string,
  tokens: Auth.Credentials,
): Promise<void> => {
  const supabase = await getSupabaseServerClient();
  const { error } = await supabase.from("user_google_tokens").upsert(
    {
      user_id: userId,
      access_token: tokens.access_token ?? null,
      refresh_token: tokens.refresh_token ?? null,
      scope: tokens.scope ?? null,
      token_type: tokens.token_type ?? null,
      expiry_date: tokens.expiry_date
        ? new Date(tokens.expiry_date).toISOString()
        : null,
    },
    { onConflict: "user_id" },
  );
  if (error) throw error;
};

export const refreshTokens = async (userId: string) => {
  const supabase = await getSupabaseServerClient();
  const { data, error } = await supabase
    .from("user_google_tokens")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) throw error;
  if (!data?.refresh_token) {
    throw new Error("No refresh token found");
  }

  const client = createOAuth2Client({ refresh_token: data.refresh_token });
  const { credentials } = await client.refreshAccessToken();
  await storeTokens(userId, credentials);
  return client;
};

type EventRow = Database["public"]["Tables"]["events"]["Row"];

const mapEventToGoogle = (event: EventRow): calendar_v3.Schema$Event => ({
  id: event.event_id,
  summary: event.title,
  description: event.description,
  start: {
    dateTime: new Date(event.start_date).toISOString(),
  },
  end: {
    dateTime: new Date(event.end_date).toISOString(),
  },
  location: event.address ?? undefined,
  reminders: {
    useDefault: false,
    overrides: [
      { method: "popup", minutes: 30 },
      { method: "popup", minutes: 10 },
      { method: "popup", minutes: 0 },
    ],
  },
});

const getCalendarClient = async (userId: string) => {
  try {
    const authClient = await refreshTokens(userId);
    return google.calendar({ version: "v3", auth: authClient });
  } catch {
    const supabase = await getSupabaseServerClient();
    const { data } = await supabase
      .from("user_google_tokens")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();
    if (!data) return null;
    const authClient = createOAuth2Client({
      access_token: data.access_token ?? undefined,
      refresh_token: data.refresh_token ?? undefined,
      scope: data.scope ?? undefined,
      token_type: data.token_type ?? undefined,
      expiry_date: data.expiry_date
        ? new Date(data.expiry_date).getTime()
        : undefined,
    });
    return google.calendar({ version: "v3", auth: authClient });
  }
};

export const createCalendarEvent = async (
  userId: string,
  event: EventRow,
) => {
  const calendar = await getCalendarClient(userId);
  if (!calendar) return;
  try {
    await calendar.events.insert({
      calendarId: "primary",
      requestBody: mapEventToGoogle(event),
    });
  } catch (e) {
    console.error(e);
  }
};

export const updateCalendarEvent = async (
  userId: string,
  event: EventRow,
) => {
  const calendar = await getCalendarClient(userId);
  if (!calendar) return;
  try {
    await calendar.events.update({
      calendarId: "primary",
      eventId: event.event_id,
      requestBody: mapEventToGoogle(event),
    });
  } catch (e) {
    console.error(e);
  }
};

export const deleteCalendarEvent = async (
  userId: string,
  eventId: string,
) => {
  const calendar = await getCalendarClient(userId);
  if (!calendar) return;
  try {
    await calendar.events.delete({
      calendarId: "primary",
      eventId,
    });
  } catch (e) {
    console.error(e);
  }
};

