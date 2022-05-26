import { format, isAfter, isBefore, isSameDay, isSameMonth, isSameYear } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const formattedDate = (date: Date) => format(date, 'MMM d, y');

export const dateWithTimezoneOffset = (date: number, timezoneOffset: number) =>
  utcToZonedTime(date, String(timezoneOffset));

export const isBeforeToday = (date: number) => isBefore(date, new Date());

export const isAfterToday = (date: number) => isAfter(date, new Date());

export const formattedDateRange = (start: number, end: number) => {
  const startDate = new Date(start);
  const endDate = new Date(end);
  const sameDay = isSameDay(startDate, endDate);
  const sameMonth = isSameMonth(startDate, endDate);
  const sameYear = isSameYear(startDate, endDate);
  if (sameYear) {
    if (sameMonth) {
      if (sameDay) {
        return `${format(startDate, 'MMM')} ${format(startDate, 'd')}, ${format(startDate, 'y')}`;
      }
      return `${format(startDate, 'MMM')} ${format(startDate, 'd')}–${format(
        endDate,
        'd'
      )}, ${format(startDate, 'y')}`;
    }

    return `${format(startDate, 'MMM')} ${format(startDate, 'd')}–${format(
      endDate,
      'MMM'
    )} ${format(endDate, 'd')}, ${format(startDate, 'y')}`;
  }
  return `${formattedDate(startDate)}–${formattedDate(endDate)}`;
};
