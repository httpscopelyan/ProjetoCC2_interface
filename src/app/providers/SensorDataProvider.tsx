import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";

import { sensorsApi } from "../../shared/api/sensors";
import { SENSOR_DEFS } from "../../shared/config/sensors";
import type { Period, Readings, SensorId } from "../../shared/config/sensors";
import { SensorControlsContext, SensorDataContext } from "../../entities/sensor/context";
import type { SensorControls, SensorData } from "../../entities/sensor/context";
import { mean } from "../../entities/sensor/states";

const POLL_MS = 15000;

const message = (error: unknown) => (error instanceof Error ? error.message : "Erro ao carregar os sensores");

export const SensorDataProvider = ({ children }: { children: ReactNode }) => {
  const [period, setPeriodState] = useState<Period>("now");
  const [day, setDay] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<SensorId>("temperature");

  const [live, setLive] = useState<Readings>({});
  const [seriesBySensor, setSeriesBySensor] = useState<SensorData["seriesBySensor"]>({});
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [availableDays, setAvailableDays] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);

  const viewKey = `${period}|${day ?? ""}`;
  const loading = loadedKey !== viewKey;

  const setPeriod = useCallback((next: Period) => {
    setPeriodState(next);
    setDay(null);
  }, []);

  const fetchLatest = useCallback(async (): Promise<Readings> => {
    const readings = await sensorsApi.latest();
    return Object.fromEntries(readings.map((r) => [r.sensorId, r.value]));
  }, []);

  const fetchSeries = useCallback(async (): Promise<SensorData["seriesBySensor"]> => {
    const all = await Promise.all(SENSOR_DEFS.map((def) => sensorsApi.series(def.id, period, day)));
    return Object.fromEntries(all.map((s) => [s.sensorId, s]));
  }, [period, day]);

  useEffect(() => {
    let cancelled = false;
    fetchLatest()
      .then((readings) => !cancelled && setLive(readings))
      .catch((e) => !cancelled && setError(message(e)));
    sensorsApi
      .availableDays()
      .then((days) => !cancelled && setAvailableDays(days))
      .catch((e) => !cancelled && setError(message(e)));
    return () => {
      cancelled = true;
    };
  }, [fetchLatest]);

  useEffect(() => {
    let cancelled = false;
    fetchSeries()
      .then((series) => {
        if (cancelled) return;
        setSeriesBySensor(series);
        setLoadedKey(viewKey);
        setError(null);
      })
      .catch((e) => !cancelled && setError(message(e)));
    return () => {
      cancelled = true;
    };
  }, [fetchSeries, viewKey]);

  useEffect(() => {
    let cancelled = false;
    const realtime = period === "now" && !day;
    const tick = () => {
      fetchLatest()
        .then((readings) => !cancelled && setLive(readings))
        .catch((e) => !cancelled && setError(message(e)));
      if (realtime) {
        fetchSeries()
          .then((series) => !cancelled && setSeriesBySensor(series))
          .catch((e) => !cancelled && setError(message(e)));
      }
    };

    let timer: ReturnType<typeof setInterval> | undefined;
    const start = () => {
      if (!timer) timer = setInterval(tick, POLL_MS);
    };
    const stop = () => {
      clearInterval(timer);
      timer = undefined;
    };
    const onVisibility = () => {
      if (document.hidden) stop();
      else {
        tick();
        start();
      }
    };

    if (!document.hidden) start();
    document.addEventListener("visibilitychange", onVisibility);
    return () => {
      cancelled = true;
      stop();
      document.removeEventListener("visibilitychange", onVisibility);
    };
  }, [period, day, fetchLatest, fetchSeries]);

  const readings = useMemo<Readings>(() => {
    if (period === "now" && !day) return live;
    return Object.fromEntries(
      SENSOR_DEFS.flatMap((def) => {
        const points = seriesBySensor[def.id]?.points;
        return points && points.length > 0 ? [[def.id, mean(points)]] : [];
      }),
    );
  }, [period, day, live, seriesBySensor]);

  const data = useMemo<SensorData>(
    () => ({ readings, live, seriesBySensor, availableDays, loading, error }),
    [readings, live, seriesBySensor, availableDays, loading, error],
  );

  const controls = useMemo<SensorControls>(
    () => ({ period, setPeriod, day, setDay, selectedId, setSelectedId }),
    [period, setPeriod, day, selectedId],
  );

  return (
    <SensorControlsContext.Provider value={controls}>
      <SensorDataContext.Provider value={data}>{children}</SensorDataContext.Provider>
    </SensorControlsContext.Provider>
  );
};
