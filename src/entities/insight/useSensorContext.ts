import { useMemo } from "react";
import { useSensorData } from "../sensor/context";
import { useSensorDefs } from "../settings/useSensorDefs";
import { buildSensorContext } from "./sensorContext";

export const useSensorContext = (): string => {
  const { live, seriesBySensor } = useSensorData();
  const { defs } = useSensorDefs();
  return useMemo(() => buildSensorContext(defs, live, seriesBySensor), [defs, live, seriesBySensor]);
};
