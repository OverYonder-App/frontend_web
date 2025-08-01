import { Metadata } from 'next';
import type { EventRecord } from '@/lib/types';
import CalendarClient from './CalendarClient';

export const metadata: Metadata = {
  title: 'Calendar – Institution Admin',
};

export default async function CalendarPage() {
  // Fetch all events on the server
  const events: EventRecord[] = [];

  // Render a client component so the user can switch views
  return <CalendarClient events={events} />;
}