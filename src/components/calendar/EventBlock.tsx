"use client"

import React from 'react';
import { Event } from './CalendarView';
import { format } from 'date-fns';

export interface EventBlockProps {
  /** The event data */
  event: Event;
  /** Pixel offset from top of grid */
  top: number;
  /** Pixel height of block */
  height: number;
  /** CSS left position (e.g. "%" or "px") */
  left: string;
  /** CSS width (e.g. "%" or "calc(...)" ) */
  width: string;
  /** Background color for the block */
  backgroundColor: string;
  /** Callback when clicked */
  onSelectEvent?: (id: string) => void;
}

export default function EventBlock({
  event,
  top,
  height,
  left,
  width,
  backgroundColor,
  onSelectEvent,
}: EventBlockProps) {
  const start = new Date(event.start);
  const end = new Date(event.end);
  const timeRange = `${format(start, 'h:mm a')} - ${format(end, 'h:mm a')}`;

  return (
    <div
      className="absolute rounded text-white text-xs p-1 overflow-hidden cursor-pointer"
      style={{
        top,
        height,
        left,
        width,
        backgroundColor,
      }}
      onClick={() => onSelectEvent?.(event.id)}
      title={`${event.title} (${timeRange})`}
    >
      {event.title}
    </div>
  );
}
