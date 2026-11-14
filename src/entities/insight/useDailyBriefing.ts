import { useEffect, useState } from "react";
import { sensorsApi } from "../../shared/api/sensors";
import { SENSOR_DEFS } from "../../shared/config/sensors";
import { isoDay } from "../../shared/lib/date";
import { buildBriefing } from "./briefing";
import type { DaySeries } from "./briefing";

const DAY_MS = 24 * 60 * 60 * 1000;

const fetchDay = async (day: string): Promise<DaySeries> => {
  const all = await Promise.all(SENSOR_DEFS.map((def) => sensorsApi.series(def.id, "now", day)));
  return Object.fromEntries(all.map((series) => [series.sensorId, series.points]));
};

export const useDailyBriefing = (): string | null => {
  const [briefing, setBriefing] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    const today = new Date();
    Promise.all([fetchDay(isoDay(today)), fetchDay(isoDay(new Date(today.getTime() - DAY_MS)))])
      .then(([todaySeries, yesterdaySeries]) => !cancelled && setBriefing(buildBriefing(todaySeries, yesterdaySeries)))
      .catch(() => !cancelled && setBriefing(null));
    return () => {
      cancelled = true;
    };
  }, []);

  return briefing;
};
