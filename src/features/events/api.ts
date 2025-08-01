import { supabase } from "@/lib/supabase";
import type { Event } from "./types";

export async function fetchEvents() {
  const { data, error } = await supabase.from("events").select("*");
  if (error) throw error;
  return data as Event[];
}
