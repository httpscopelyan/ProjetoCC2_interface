import { useMemo } from "react";
import { SENSOR_DEFS } from "../../shared/config/sensors";
import type { SensorDef, SensorId } from "../../shared/config/sensors";
import { useSettings } from "./context";
import { applyThresholds } from "./thresholds";

export const useSensorDefs = () => {
  const { thresholds } = useSettings();

  return useMemo(() => {
    const defs = SENSOR_DEFS.map((def) => applyThresholds(def, thresholds));
    const byId = Object.fromEntries(defs.map((def) => [def.id, def])) as Record<SensorId, SensorDef>;
    return { defs, byId };
  }, [thresholds]);
};
