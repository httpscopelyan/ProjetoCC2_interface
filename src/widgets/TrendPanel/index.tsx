import { GlassPanel, PanelHeader, PanelTitle } from "../../shared/ui/GlassPanel/style";
import Sparkline from "../../shared/ui/Sparkline";
import { useSensorControls, useSensorData } from "../../entities/sensor/context";
import { formatValue, mean, stateColor } from "../../entities/sensor/states";
import { useSensorDefs } from "../../entities/settings/useSensorDefs";
import { Empty, Stat, Stats } from "./style";

const TREND_HEIGHT = 140;

const TrendPanel = () => {
  const { seriesBySensor, readings } = useSensorData();
  const { selectedId } = useSensorControls();
  const { byId } = useSensorDefs();

  const def = byId[selectedId];
  const points = seriesBySensor[selectedId]?.points ?? [];
  const values = points.map((point) => point.value);
  const current = readings[selectedId];

  return (
    <GlassPanel>
      <PanelHeader>
        <PanelTitle>Tendência · {def.title}</PanelTitle>
      </PanelHeader>

      {points.length > 1 && current !== undefined ? (
        <>
          <Sparkline data={values} color={stateColor(def, current, readings)} width="100%" height={TREND_HEIGHT} />
          <Stats>
            <Stat>
              <span>Mínimo</span>
              <strong>{formatValue(def, Math.min(...values))}</strong>
            </Stat>
            <Stat>
              <span>Média</span>
              <strong>{formatValue(def, mean(points))}</strong>
            </Stat>
            <Stat>
              <span>Máximo</span>
              <strong>{formatValue(def, Math.max(...values))}</strong>
            </Stat>
          </Stats>
        </>
      ) : (
        <Empty>Sem medições suficientes para a tendência.</Empty>
      )}
    </GlassPanel>
  );
};

export default TrendPanel;
