import { Metadata } from 'next';
import CalendarClient from './CalendarClient';
import { getSupabaseServerClient } from '@/lib/auth';
import type { Database } from '@/lib/database.types';

export const metadata: Metadata = {
  title: 'Calendar – Institution Admin',
};

type EventRow = Database['public']['Tables']['events']['Row'];

export default async function CalendarPage() {
  const supabase = await getSupabaseServerClient();
  const { data } = await supabase.from('events').select('*');
  const events: EventRow[] = (data as EventRow[]) || [];

  // Render a client component so the user can switch views
  return <CalendarClient events={events} />;
}