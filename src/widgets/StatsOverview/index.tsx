import { useEffect } from "react";

import StatsCard from "../../shared/ui/Cards/Card";
import Reveal from "../../shared/ui/Reveal";
import { SENSOR_DEFS } from "../../shared/config/sensors";
import { setAmbientTint } from "../../shared/lib/ambient";
import { useSensorControls, useSensorData } from "../../entities/sensor/context";
import { Grid } from "./style";

const StatsOverview = () => {
  const { readings, seriesBySensor } = useSensorData();
  const { selectedId, setSelectedId } = useSensorControls();

  // Leaving the page must not leave the hover tint behind (mouseleave never fires on unmount).
  useEffect(() => () => setAmbientTint(null), []);

  return (
    <Grid>
      {SENSOR_DEFS.map((def, i) => {
        const value = readings[def.id];
        if (value === undefined) return null;
        return (
          <Reveal key={def.id} order={i + 2}>
            <StatsCard
              def={def}
              value={value}
              all={readings}
              series={seriesBySensor[def.id]?.points ?? []}
              selected={def.id === selectedId}
              onSelect={setSelectedId}
              onHoverChange={setAmbientTint}
            />
          </Reveal>
        );
      })}
    </Grid>
  );
};

export default StatsOverview;
