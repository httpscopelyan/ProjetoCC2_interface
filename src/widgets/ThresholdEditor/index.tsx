import { RotateCcw } from "lucide-react";
import type { FocusEvent } from "react";

import { GlassPanel, PanelAction, PanelHeader, PanelTitle } from "../../shared/ui/GlassPanel/style";
import type { SensorDef } from "../../shared/config/sensors";
import { useSettings } from "../../entities/settings/context";
import { defaultEdges, isAscending } from "../../entities/settings/thresholds";
import { useSensorDefs } from "../../entities/settings/useSensorDefs";
import { BandLabel, BandRow, Dot, Field, Grid, Hint, IconBox, SensorCard, SensorHeader, SensorTitle, Unit } from "./style";

const stepFor = (def: SensorDef) => 10 ** -def.decimals;

const ThresholdEditor = () => {
  const { setSensorThresholds, resetThresholds } = useSettings();
  const { defs } = useSensorDefs();

  const commitEdge = (def: SensorDef, position: number, event: FocusEvent<HTMLInputElement>) => {
    const edges = defaultEdges(def);
    const value = Number(event.target.value);
    const next = edges.map((edge, i) => (i === position ? value : edge));
    if (event.target.value === "" || Number.isNaN(value) || !isAscending(next)) {
      event.target.value = String(edges[position]);
      return;
    }
    setSensorThresholds(def.id, next);
  };

  return (
    <GlassPanel>
      <PanelHeader>
        <PanelTitle>Limites dos estados</PanelTitle>
        <PanelAction type="button" onClick={resetThresholds}>
          <RotateCcw size={12} />
          Restaurar padrão
        </PanelAction>
      </PanelHeader>
      <Hint>Cada campo define até onde vai um estado. Os valores precisam ficar em ordem crescente.</Hint>

      <Grid>
        {defs.filter((def) => defaultEdges(def).length > 0).map((def) => {
          const edges = defaultEdges(def);
          const bands = def.states.filter((state) => !state.when);
          const SensorIcon = def.icon;
          return (
            <SensorCard key={def.id}>
              <SensorHeader>
                <IconBox>
                  <SensorIcon size={16} />
                </IconBox>
                <SensorTitle>{def.title}</SensorTitle>
              </SensorHeader>

              {bands.map((band, position) => (
                <BandRow key={band.label}>
                  <Dot $color={band.color} />
                  <BandLabel>{band.label}</BandLabel>
                  {position < edges.length ? (
                    <>
                      <span>até</span>
                      <Field
                        key={edges[position]}
                        type="number"
                        step={stepFor(def)}
                        defaultValue={edges[position]}
                        aria-label={`${def.title}: limite superior de ${band.label}`}
                        onBlur={(event) => commitEdge(def, position, event)}
                      />
                      <Unit>{def.unit}</Unit>
                    </>
                  ) : (
                    <Unit>{band.range}</Unit>
                  )}
                </BandRow>
              ))}
            </SensorCard>
          );
        })}
      </Grid>
    </GlassPanel>
  );
};

export default ThresholdEditor;
