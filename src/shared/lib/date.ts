const locale = "pt-BR";

const dayMonthFormat = new Intl.DateTimeFormat(locale, { day: "numeric", month: "long" });
const clockFormat = new Intl.DateTimeFormat(locale, { hour: "2-digit", minute: "2-digit" });

export const salutation = (d: Date): "Bom dia" | "Boa tarde" | "Boa noite" => {
  const hour = d.getHours();
  if (hour < 12) return "Bom dia";
  if (hour < 18) return "Boa tarde";
  return "Boa noite";
};

export const dayMonth = (d: Date) => dayMonthFormat.format(d);

export const clock = (d: Date) => clockFormat.format(d);

const pad = (n: number) => String(n).padStart(2, "0");

export const isoDay = (d: Date) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;

export const parseIsoDay = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
};

const DAY_MS = 24 * 60 * 60 * 1000;
const shortDateFormat = new Intl.DateTimeFormat(locale, { day: "numeric", month: "short" });

export const formatSpan = (startIso: string, endIso: string): string => {
  const start = new Date(startIso);
  const end = new Date(endIso);
  if (end.getTime() - start.getTime() >= DAY_MS) return shortDateFormat.format(start);
  return `${clock(start)}–${clock(end)}`;
};

export const relative =(iso: string, now: Date = new Date()): string => {
  const minutes = Math.round((now.getTime() - new Date(iso).getTime()) / 60000);
  if (minutes < 1) return "agora";
  if (minutes < 60) return `há ${minutes} min`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `há ${hours} h`;
  return `há ${Math.round(hours / 24)} d`;
};
