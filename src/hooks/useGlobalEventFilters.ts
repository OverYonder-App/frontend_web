"use client";

import { useMemo, useState } from "react";
import { startOfWeek, endOfWeek, startOfMonth, endOfMonth } from "date-fns";

export type DateRange = "week" | "month";

export default function useGlobalEventFilters(initialRange: DateRange = "week") {
  const [range, setRange] = useState<DateRange>(initialRange);

  const { startDate, endDate } = useMemo(() => {
    const now = new Date();
    if (range === "month") {
      return { startDate: startOfMonth(now), endDate: endOfMonth(now) };
    }
    return {
      startDate: startOfWeek(now, { weekStartsOn: 1 }),
      endDate: endOfWeek(now, { weekStartsOn: 1 }),
    };
  }, [range]);

  return { range, setRange, startDate, endDate };
}

