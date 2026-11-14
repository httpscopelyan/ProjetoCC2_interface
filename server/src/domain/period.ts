export type Period = "now" | "week" | "month" | "year";
export type Granularity = "hour" | "day" | "month";

export interface TimeWindow {
  from: number;
  to: number;
}

export interface SeriesWindow extends TimeWindow {
  granularity: Granularity;
}

const HOUR_MS = 3_600_000;
const NOON = 12;

export const startOfHour = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate(), date.getHours());
export const startOfDay = (date: Date) => new Date(date.getFullYear(), date.getMonth(), date.getDate());
const startOfMonth = (date: Date) => new Date(date.getFullYear(), date.getMonth(), 1);

export const addDays = (date: Date, days: number) => new Date(date.getFullYear(), date.getMonth(), date.getDate() + days);
const addMonths = (date: Date, months: number) => new Date(date.getFullYear(), date.getMonth() + months, 1);

export const isIsoDay = (value: string) => /^\d{4}-\d{2}-\d{2}$/.test(value);

export const parseIsoDay = (value: string) => {
  const [year, month, day] = value.split("-").map(Number);
  return new Date(year, month - 1, day);
};

export const isPeriod = (value: string): value is Period => ["now", "week", "month", "year"].includes(value);

export const seriesWindow = (period: Period, day: string | null, now: Date): SeriesWindow => {
  const to = now.getTime() + 1;
  if (day) {
    const start = parseIsoDay(day);
    return { from: start.getTime(), to: Math.min(addDays(start, 1).getTime(), to), granularity: "hour" };
  }
  switch (period) {
    case "now":
      return { from: startOfHour(now).getTime() - 23 * HOUR_MS, to, granularity: "hour" };
    case "week":
      return { from: addDays(startOfDay(now), -6).getTime(), to, granularity: "day" };
    case "month":
      return { from: addDays(startOfDay(now), -29).getTime(), to, granularity: "day" };
    case "year":
      return { from: addMonths(startOfMonth(now), -11).getTime(), to, granularity: "month" };
  }
};

export const BUCKET_FORMAT: Record<Granularity, string> = {
  hour: "%Y-%m-%d %H",
  day: "%Y-%m-%d",
  month: "%Y-%m",
};

export const bucketStart = (key: string, granularity: Granularity): Date => {
  const [datePart, hourPart] = key.split(" ");
  const [year, month, day = 1] = datePart.split("-").map(Number);
  if (granularity === "hour") return new Date(year, month - 1, day, Number(hourPart));
  return new Date(year, month - 1, day, NOON);
};
