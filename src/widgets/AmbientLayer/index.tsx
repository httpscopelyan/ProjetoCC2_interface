import { useEffect, useMemo, useState } from "react";
import type { CSSProperties } from "react";
import { useReducedMotion } from "framer-motion";

import { useSensorData } from "../../entities/sensor/context";
import { stateColor } from "../../entities/sensor/states";
import { useSensorDefs } from "../../entities/settings/useSensorDefs";
import { Darkness, Drop, EdgeGlow, Gust, Particles, Root, Tint } from "./style";

const glowIntensity = (temperature: number) => {
  if (temperature < 16) return Math.min(1, (16 - temperature) / 10);
  if (temperature > 24) return Math.min(1, (temperature - 24) / 8);
  return 0;
};

const MIN_DROPS = 12;
const MAX_DROPS = 50;
const DROPS_PER_MM_PER_HOUR = 6;
const MAX_DARKNESS = 0.45;

const rainCount = (rain: number) =>
  rain < 0.1 ? 0 : Math.min(MAX_DROPS, Math.max(MIN_DROPS, Math.round(rain * DROPS_PER_MM_PER_HOUR)));

const darkness = (luminosity: number | undefined) =>
  luminosity === undefined ? 0 : (1 - Math.min(100, Math.max(0, luminosity)) / 100) * MAX_DARKNESS;

const spread = (count: number, scale: number, offset = 0) =>
  Array.from({ length: count }, (_, i) => ((i * scale + offset) % 100) / 100);

const AmbientLayer = () => {
  const { live } = useSensorData();
  const { byId } = useSensorDefs();
  const reduceMotion = useReducedMotion();
  const [hidden, setHidden] = useState(document.hidden);

  useEffect(() => {
    const onVisibility = () => setHidden(document.hidden);
    document.addEventListener("visibilitychange", onVisibility);
    return () => document.removeEventListener("visibilitychange", onVisibility);
  }, []);

  const temperature = live.temperature;
  const glowColor = temperature === undefined ? null : stateColor(byId.temperature, temperature, live);
  const intensity = temperature === undefined ? 0 : glowIntensity(temperature);

  const drops = rainCount(live.rain ?? 0);
  const windy = (live.windSpeed ?? 0) >= 15 || (live.windSpeed === undefined && (live.airQuality ?? 0) >= 50);

  const dropStyles = useMemo(() => {
    const lefts = spread(drops, 37.7);
    const delays = spread(drops, 13);
    const sizes = spread(drops, 17);
    return lefts.map((left, i) => ({
      left: `${left * 100}%`,
      height: `${40 + sizes[i] * 40}px`,
      opacity: 0.3 + delays[i] * 0.5,
      animationDuration: `${0.8 + sizes[i] * 0.6}s`,
      animationDelay: `-${delays[i] * 2}s`,
    }));
  }, [drops]);

  const gustStyles = useMemo(() => {
    const tops = spread(10, 31.3, 7);
    const sizes = spread(10, 19, 3);
    return tops.map((top, i) => ({
      top: `${top * 100}%`,
      width: `${18 + sizes[i] * 24}vw`,
      opacity: 0.4 + sizes[i] * 0.6,
      animationDuration: `${5 + sizes[i] * 5}s`,
      animationDelay: `-${sizes[i] * 8}s`,
    }));
  }, []);

  return (
    <Root aria-hidden style={{ "--ambient-base": glowColor ?? "transparent" } as CSSProperties}>
      <Tint />
      <Darkness style={{ opacity: darkness(live.luminosity) }} />
      <EdgeGlow
        style={{
          opacity: intensity * 0.6,
        }}
      />
      {!reduceMotion && drops > 0 && (
        <Particles $paused={hidden}>
          {dropStyles.map((style, i) => (
            <Drop key={i} style={style} />
          ))}
        </Particles>
      )}
      {!reduceMotion && windy && (
        <Particles $paused={hidden}>
          {gustStyles.map((style, i) => (
            <Gust key={i} style={style} />
          ))}
        </Particles>
      )}
    </Root>
  );
};

export default AmbientLayer;
