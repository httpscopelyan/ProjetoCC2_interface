import { useMemo } from "react";

import { GlassPanel, PanelHeader, PanelTitle } from "../../shared/ui/GlassPanel/style";
import { formatSpan } from "../../shared/lib/date";
import { buildEvents } from "../../entities/event/buildEvents";
import { useSensorData } from "../../entities/sensor/context";
import { formatValue, stateColor } from "../../entities/sensor/states";
import { useSensorDefs } from "../../entities/settings/useSensorDefs";
import { Dot, Empty, Item, List, Span, Text, Title } from "./style";

const MAX_EVENTS = 6;

const EventTimeline = () => {
  const { seriesBySensor } = useSensorData();
  const { defs, byId } = useSensorDefs();

  const events = useMemo(
    () =>
      defs
        .flatMap((def) => buildEvents(def, seriesBySensor[def.id]?.points ?? []))
        .sort((a, b) => b.startAt.localeCompare(a.startAt))
        .slice(0, MAX_EVENTS),
    [defs, seriesBySensor],
  );

  return (
    <GlassPanel>
      <PanelHeader>
        <PanelTitle>Linha do tempo</PanelTitle>
      </PanelHeader>

      {events.length === 0 ? (
        <Empty>Nenhum evento relevante no período.</Empty>
      ) : (
        <List>
          {events.map(({ id, sensorId, label, startAt, endAt, peakValue }) => {
            const def = byId[sensorId];
            return (
              <Item key={id}>
                <Dot $color={stateColor(def, peakValue, {})} />
                <Text>
                  <Title>
                    {def.title}: {label}
                  </Title>
                  <Span>
                    {formatSpan(startAt, endAt)} · pico {formatValue(def, peakValue)}
                  </Span>
                </Text>
              </Item>
            );
          })}
        </List>
      )}
    </GlassPanel>
  );
};

export default EventTimeline;
