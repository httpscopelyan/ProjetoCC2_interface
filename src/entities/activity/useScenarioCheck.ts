import { useCallback, useRef, useState } from "react";
import { chatApi } from "../../shared/api/chat";
import { useSensorContext } from "../insight/useSensorContext";
import { useSensorData } from "../sensor/context";
import { useSettings } from "../settings/context";
import { useSensorDefs } from "../settings/useSensorDefs";
import { answerLocally, buildScenarioPrompt, describeOverrides, extractOverrides, parseScenarioVerdict } from "./scenario";
import type { Suggestion } from "./suggestions";

export interface ScenarioResult extends Suggestion {
  simulated: string[];
}

export const useScenarioCheck = () => {
  const { live } = useSensorData();
  const { localAi } = useSettings();
  const { defs } = useSensorDefs();
  const context = useSensorContext();
  const [query, setQuery] = useState("");
  const [result, setResult] = useState<ScenarioResult | null>(null);
  const [loading, setLoading] = useState(false);
  const latestRequest = useRef(0);

  const ask = useCallback(
    async (text: string = query) => {
      const question = text.trim();
      if (!question) return;
      setQuery(question);
      setLoading(true);
      const requestId = ++latestRequest.current;

      const overrides = extractOverrides(question);
      const simulated = describeOverrides(defs, overrides);
      const fallback = answerLocally(question, { ...live, ...overrides });
      const prompt = buildScenarioPrompt(question, context, simulated);

      const answer = await chatApi
        .ask(prompt, { local: localAi, json: true, context, fallback: JSON.stringify(fallback) })
        .then((text) => parseScenarioVerdict(text) ?? fallback)
        .catch(() => fallback);

      if (requestId !== latestRequest.current) return;
      setResult({ ...answer, simulated });
      setLoading(false);
    },
    [query, live, defs, context, localAi],
  );

  return { query, setQuery, result, loading, ask };
};
