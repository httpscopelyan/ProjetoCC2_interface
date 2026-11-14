import { useMemo, useState } from "react";
import { TrendingDown, TrendingUp } from "lucide-react";

import ExplainPoint from "../../features/ExplainPoint";
import Badge from "../../shared/ui/Badge";
import { CHART_ELEMENT_ID } from "../../shared/config/dom";
import { GlassPanel, PanelHeader, PanelTitle } from "../../shared/ui/GlassPanel/style";
import type { Period, SensorDef } from "../../shared/config/sensors";
import { parseIsoDay } from "../../shared/lib/date";
import { useSensorControls, useSensorData } from "../../entities/sensor/context";
import { useSensorDefs } from "../../entities/settings/useSensorDefs";
import type { SeriesPoint } from "../../entities/sensor/model";
import { changePct, formatNumber, formatValue, stateColor } from "../../entities/sensor/states";
import { Bar, Bars, Column, Empty, Label, Plot, Subtitle, Track, Value, YAxis } from "./style";

const hourFormat = new Intl.DateTimeFormat("pt-BR", { hour: "2-digit" });
const weekdayFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "short" });
const monthFormat = new Intl.DateTimeFormat("pt-BR", { month: "short" });
const dayLongFormat = new Intl.DateTimeFormat("pt-BR", { day: "numeric", month: "long" });

const subtitles: Record<Period, string> = {
  now: "Últimas 24 horas",
  week: "Média diária dos últimos 7 dias",
  month: "Média diária dos últimos 30 dias",
  year: "Média mensal dos últimos 12 meses",
};

const labelFor = (iso: string, period: Period, day: string | null) => {
  const d = new Date(iso);
  if (day || period === "now") return `${hourFormat.format(d).replace(/\D/g, "")}h`;
  if (period === "week") return weekdayFormat.format(d).replace(".", "");
  if (period === "month") return String(d.getDate());
  return monthFormat.format(d).replace(".", "");
};

const niceStep = (span: number) => {
  const raw = Math.max(span, 1e-6) / 5;
  const power = 10 ** Math.floor(Math.log10(raw));
  const base = [1, 2, 5, 10].find((m) => m * power >= raw) ?? 10;
  return base * power;
};

const buildAxis = (def: SensorDef, points: SeriesPoint[]) => {
  const values = points.map((p) => p.value);
  const dataMin = Math.min(...values);
  const dataMax = Math.max(...values);
  const pad = (dataMax - dataMin) * 0.25 || 1;
  const rawLow = def.floor ?? dataMin - pad;
  const step = niceStep(dataMax - rawLow);
  const lo = Math.floor(rawLow / step) * step;
  let hi = Math.ceil(dataMax / step) * step;
  if (hi <= lo) hi = lo + step;
  const ticks = Array.from({ length: Math.round((hi - lo) / step) + 1 }, (_, i) => lo + i * step);
  return { lo, hi, ticks };
};

const SensorChart = () => {
  const { seriesBySensor } = useSensorData();
  const { selectedId, period, day } = useSensorControls();

  const { byId } = useSensorDefs();
  const def = byId[selectedId];
  const [pointChoice, setPointChoice] = useState<{ viewKey: string; at: string } | null>(null);
  const viewKey = `${selectedId}|${period}|${day}`;
  const explainedAt = pointChoice?.viewKey === viewKey ? pointChoice.at : null;
  const points = useMemo(() => seriesBySensor[selectedId]?.points ?? [], [seriesBySensor, selectedId]);

  const axis = useMemo(() => (points.length > 0 ? buildAxis(def, points) : null), [def, points]);
  const maxIndex = useMemo(
    () => points.reduce((best, p, i) => (p.value > points[best].value ? i : best), 0),
    [points],
  );

  const change = changePct(points);
  const positive = change >= 0;
  const Arrow = positive ? TrendingUp : TrendingDown;
  const labelEvery = points.length > 20 ? Math.ceil(points.length / 8) : 1;
  const subtitle = day ? `Medições de ${dayLongFormat.format(parseIsoDay(day))}, hora a hora` : subtitles[period];

  return (
    <GlassPanel id={CHART_ELEMENT_ID}>
      <PanelHeader>
        <div>
          <PanelTitle>
            {def.title} ({def.unit})
          </PanelTitle>
          <Subtitle>{subtitle}</Subtitle>
        </div>
        {points.length > 1 && (
          <Badge tone={positive ? "success" : "danger"}>
            <Arrow size={12} />
            {positive ? "+" : ""}
            {change}% no período
          </Badge>
        )}
      </PanelHeader>

      {axis ? (
        <Plot>
          <YAxis>
            {axis.ticks.map((tick) => (
              <span key={tick}>{formatNumber({ ...def, decimals: tick % 1 === 0 ? 0 : def.decimals }, tick)}</span>
            ))}
          </YAxis>
          <Bars key={`${selectedId}-${period}-${day}`} $count={points.length}>
            {points.map((point, i) => {
              const label = labelFor(point.at, period, day);
              const height = ((point.value - axis.lo) / (axis.hi - axis.lo)) * 100;
              return (
                <Column key={point.at}>
                  <Track>
                    {i === maxIndex && <Value>{formatValue(def, point.value)}</Value>}
                    <Bar
                      $color={stateColor(def, point.value, {})}
                      $highlighted={i === maxIndex}
                      style={{ height: `${Math.max(height, 1)}%` }}
                      initial={{ scaleY: 0 }}
                      animate={{ scaleY: 1 }}
                      transition={{ duration: 0.7, ease: "easeOut" }}
                      title={`${label}: ${formatValue(def, point.value)} · clique para entender`}
                      onClick={() => setPointChoice({ viewKey, at: point.at })}
                    />
                  </Track>
                  <Label>{i % labelEvery === 0 ? label : ""}</Label>
                </Column>
              );
            })}
          </Bars>
        </Plot>
      ) : (
        <Empty>{seriesBySensor[selectedId] ? "Sem medições para este período." : "Carregando medições…"}</Empty>
      )}

      {explainedAt && <ExplainPoint def={def} at={explainedAt} />}
    </GlassPanel>
  );
};

export default SensorChart;
