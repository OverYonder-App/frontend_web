"use client"

import React, { useEffect, useMemo, useState } from 'react';
import { differenceInMinutes } from 'date-fns';
import { formatInTimeZone, utcToZonedTime } from 'date-fns-tz';
import { Event } from './CalendarView';
import { computeDayPositions, type DayPosition } from './OverlapUtils';


export interface DayViewProps {
  events: Event[]; // Events already filtered for this day
  date: Date;
  timeZone: string;
  onSelectEvent: (id: string) => void;
}

const CELL_HEIGHT = 48; // px per hour to reduce overall height
const CATEGORY_COLORS: Record<string, string> = {
  Social: '#38bdf8',
  Academic: '#818cf8',
  Sports: '#34d399',
  Cultural: '#fbbf24',
  Default: '#3b82f6',
};

export default function DayView({ events, date, timeZone, onSelectEvent }: DayViewProps) {
  // Track current time
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60000);
    return () => clearInterval(id);
  }, []);

  // Compute overlapping columns for the day events
  const positioned = useMemo<DayPosition[]>(
    () => computeDayPositions(events),
    [events]
  );

  return (
    <div className="flex h-full overflow-hidden flex-col">
      <div className="px-2 py-1 text-center font-semibold border-b">
        {formatInTimeZone(date, timeZone, "EEEE, MMMM d, yyyy")}
      </div>
      <div className="flex-1 flex overflow-hidden">
        {/* Hour labels */}
        <div className="w-12 flex flex-col border-r border-gray-200">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="h-48 flex items-start justify-end pr-1 text-xs text-gray-500"
            >
              {i.toString().padStart(2, '0')}:00
            </div>
          ))}
        </div>

        {/* Events container */}
        <div className="relative flex-1 overflow-auto">
          {/* Half-hour grid lines */}
          <div className="absolute inset-0 grid grid-rows-[repeat(48,minmax(0,1fr))] w-full">
            {Array.from({ length: 48 }).map((_, idx) => (
              <div
                key={idx}
                className={
                  idx % 2 === 0
                    ? "border-t border-gray-200"
                    : "border-t border-gray-100"
                }
              />
            ))}
          </div>

          {/* Current time indicator */}
          {date.toDateString() === now.toDateString() && (
            <div
              className="absolute h-px w-full"
              style={{
                top: (now.getHours() + now.getMinutes() / 60) * CELL_HEIGHT,
                backgroundColor: '#745296',
              }}
            />
          )}

          {/* Event blocks */}
          {positioned.map(({ event, col, cols }) => {
            const startDate = utcToZonedTime(new Date(event.start), timeZone);
            const endDate = utcToZonedTime(new Date(event.end), timeZone);
            const minutesFromMid =
              startDate.getHours() * 60 + startDate.getMinutes();
            const durationMin = differenceInMinutes(endDate, startDate);
            const widthPct = 100 / cols;
            const leftPct = col * widthPct;
            const bg = CATEGORY_COLORS[event.category || "Default"];
            const pending = event.status !== "approved";

            return (
              <div
                key={event.id}
                className={`absolute rounded text-white text-xs p-1 overflow-hidden cursor-pointer ${
                  pending
                    ? "opacity-60 border border-dashed border-gray-700"
                    : ""
                }`}
                style={{
                  top: (minutesFromMid / 60) * CELL_HEIGHT,
                  height: (durationMin / 60) * CELL_HEIGHT,
                  left: `${leftPct}%`,
                  width: `calc(${widthPct}% - 4px)`,
                  backgroundColor: bg,
                }}
                onClick={() => onSelectEvent(event.id)}
                title={`${event.title} (${formatInTimeZone(new Date(event.start), timeZone, 'HH:mm')} - ${formatInTimeZone(new Date(event.end), timeZone, 'HH:mm')})`}
              >
                {event.title}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
