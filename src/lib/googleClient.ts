import { google, Auth } from "googleapis";
import { getSupabaseServerClient } from "./auth";

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

