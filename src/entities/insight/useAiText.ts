import { useEffect, useState } from "react";
import { chatApi } from "../../shared/api/chat";
import { useSettings } from "../settings/context";

interface AiText {
  text: string;
  loading: boolean;
}

export const useAiText = (prompt: string | null, fallback: string): AiText => {
  const { localAi } = useSettings();
  const [result, setResult] = useState<{ key: string; text: string } | null>(null);
  const key = `${localAi}|${prompt}|${fallback}`;

  useEffect(() => {
    if (prompt === null) return;
    let cancelled = false;
    chatApi
      .ask(prompt, { local: localAi, fallback })
      .catch(() => fallback)
      .then((text) => !cancelled && setResult({ key, text }));
    return () => {
      cancelled = true;
    };
  }, [prompt, fallback, localAi, key]);

  const ready = result?.key === key;
  return { text: ready ? result.text : fallback, loading: prompt !== null && !ready };
};
