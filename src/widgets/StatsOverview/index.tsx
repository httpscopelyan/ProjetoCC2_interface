import { useEffect } from "react";

import StatsCard from "../../shared/ui/Cards/Card";
import Reveal from "../../shared/ui/Reveal";
import { setAmbientTint } from "../../shared/lib/ambient";
import { useSensorControls, useSensorData } from "../../entities/sensor/context";
import { useSensorDefs } from "../../entities/settings/useSensorDefs";
import { Grid } from "./style";

const StatsOverview = () => {
  const { readings, seriesBySensor } = useSensorData();
  const { selectedId, setSelectedId } = useSensorControls();
  const { defs } = useSensorDefs();

  useEffect(() => () => setAmbientTint(null), []);

  const visibleCount = defs.filter((def) => readings[def.id] !== undefined).length;

  return (
    <Grid $count={visibleCount}>
      {defs.map((def, i) => {
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
