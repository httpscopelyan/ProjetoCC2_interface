import { useCallback, useEffect, useMemo, useState } from "react";
import { chatApi } from "../../shared/api/chat";
import { USE_MOCK } from "../../shared/api/client";
import { isLocalAiSupported } from "../../shared/api/localLlm";
import { useSensorContext } from "../insight/useSensorContext";
import { useSensorData } from "../sensor/context";
import { useSettings } from "../settings/context";
import { buildSuggestionsPrompt, parseSuggestions, readingsBucket, rulesSuggestions } from "./suggestions";
import type { Suggestion } from "./suggestions";

export type SuggestionSource = "ia" | "regras";

interface ActivitySuggestions {
  suggestions: Suggestion[];
  loading: boolean;
  source: SuggestionSource;
  refresh: () => void;
}

const cache = new Map<string, Suggestion[]>();

export const useActivitySuggestions = (): ActivitySuggestions => {
  const { live } = useSensorData();
  const { localAi } = useSettings();
  const context = useSensorContext();
  const [refreshCount, setRefreshCount] = useState(0);
  const [fresh, setFresh] = useState<{ key: string; items: Suggestion[] } | null>(null);

  const hasReadings = Object.keys(live).length > 0;
  const key = `${readingsBucket(live)}|${localAi}|${refreshCount}`;
  const rules = useMemo(() => rulesSuggestions(live), [live]);
  const aiAvailable = (localAi && isLocalAiSupported()) || !USE_MOCK;

  useEffect(() => {
    if (!hasReadings || cache.has(key)) return;
    let cancelled = false;
    const fallback = JSON.stringify({ items: rules });

    chatApi
      .ask(buildSuggestionsPrompt(context), { local: localAi, json: true, context, fallback })
      .then((text) => parseSuggestions(text) ?? rules)
      .catch(() => rules)
      .then((items) => {
        cache.set(key, items);
        if (!cancelled) setFresh({ key, items });
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key, hasReadings, localAi]);

  const refresh = useCallback(() => setRefreshCount((count) => count + 1), []);

  const ready = cache.get(key) ?? (fresh?.key === key ? fresh.items : null);
  return {
    suggestions: ready ?? rules,
    loading: hasReadings && ready === null,
    source: aiAvailable ? "ia" : "regras",
    refresh,
  };
};
