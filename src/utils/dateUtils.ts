import { format, isSameMonth, isSameYear, isBefore, isAfter } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const formattedDate = (date: Date) => format(date, 'MMM d, y');
export const formattedDateForDateInput = (date: Date) => format(date, 'yyyy-MM-dd');

export const dateWithTimezoneOffset = (date: number, timezoneOffset: number) =>
  utcToZonedTime(date, String(timezoneOffset));

export const isBeforeToday = (date: number, timezoneOffset: number) =>
  isBefore(dateWithTimezoneOffset(date, timezoneOffset), new Date());

export const isAfterToday = (date: number, timezoneOffset: number) =>
  isAfter(dateWithTimezoneOffset(date, timezoneOffset), new Date());

export const formattedDateRange = (start: number, end: number, timezoneOffset: number) => {
  const localizedStart = dateWithTimezoneOffset(start, timezoneOffset);
  const localizedEnd = dateWithTimezoneOffset(end, timezoneOffset);
  const sameMonth = isSameMonth(localizedStart, localizedEnd);
  const sameYear = isSameYear(localizedStart, localizedEnd);
  if (sameYear) {
    if (sameMonth) {
      return `${format(localizedStart, 'MMM')} ${format(localizedStart, 'd')}–${format(
        localizedEnd,
        'd'
      )}, ${format(localizedStart, 'y')}`;
    }

    return `${format(localizedStart, 'MMM')} ${format(localizedStart, 'd')}–${format(
      localizedEnd,
      'MMM'
    )} ${format(localizedEnd, 'd')}, ${format(localizedStart, 'y')}`;
  }
  return `${formattedDate(localizedStart)}–${formattedDate(localizedEnd)}`;
};
