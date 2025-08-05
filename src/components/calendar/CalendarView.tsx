"use client";

import React from 'react';
import type { Database } from '@/lib/database.types';
import DayView from './DayView';
import WeekView from './WeekView';
import MonthView from './MonthView';

export interface Event {
  id: string;
  title: string;
  start: string;
  end: string;
  category?: string;
  status?: string;
}

type EventRow = Database['public']['Tables']['events']['Row'];

export interface CalendarViewProps {
  events: EventRow[];
  view: 'day' | 'week' | 'month';
  date: Date;
  timeZone: string;
  onSelectEvent?: (id: string) => void;
}

export default function CalendarView({ events, view, date, timeZone, onSelectEvent }: CalendarViewProps) {
  const normalized: Event[] = events
    .filter(e => e.start_date && e.end_date)
    .map(e => ({
      id: e.event_id,
      title: e.title,
      start: e.start_date as string,
      end: e.end_date as string,
      status: e.status ?? undefined,
    }));

  switch (view) {
    case 'day':
      return <DayView events={normalized} date={date} timeZone={timeZone} onSelectEvent={onSelectEvent} />;
    case 'week':
      return <WeekView events={normalized} date={date} timeZone={timeZone} onSelectEvent={onSelectEvent} />;
    default:
      return <MonthView events={normalized} date={date} timeZone={timeZone} onSelectEvent={onSelectEvent} />;
  }
}

