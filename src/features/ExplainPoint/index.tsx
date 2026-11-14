import { useMemo } from "react";
import { Sparkles } from "lucide-react";

import type { SensorDef } from "../../shared/config/sensors";
import { buildExplainPrompt, explainLocally, readingsAt } from "../../entities/insight/explain";
import { useAiText } from "../../entities/insight/useAiText";
import { useSensorData } from "../../entities/sensor/context";
import { useSensorDefs } from "../../entities/settings/useSensorDefs";
import { Box, Text, Title } from "./style";

interface ExplainPointProps {
  def: SensorDef;
  at: string;
}

const ExplainPoint = ({ def, at }: ExplainPointProps) => {
  const { seriesBySensor } = useSensorData();
  const { defs, byId } = useSensorDefs();

  const readings = useMemo(() => readingsAt(seriesBySensor, at), [seriesBySensor, at]);
  const fallback = useMemo(() => explainLocally(def, byId, readings), [def, byId, readings]);
  const prompt = useMemo(() => buildExplainPrompt(def, defs, at, readings), [def, defs, at, readings]);
  const { text, loading } = useAiText(prompt, fallback);

  return (
    <Box aria-live="polite">
      <Title>
        <Sparkles size={14} />
        {new Date(at).toLocaleString("pt-BR", { dateStyle: "short", timeStyle: "short" })}
      </Title>
      <Text $loading={loading}>{text}</Text>
    </Box>
  );
};

export default ExplainPoint;
