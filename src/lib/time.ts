import { toZonedTime } from 'date-fns-tz';

export function getZonedNow(timeZone: string): Date {
  return toZonedTime(new Date(), timeZone);
}

export { toZonedTime };
