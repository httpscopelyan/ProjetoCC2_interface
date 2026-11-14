import type { MLCEngineInterface } from "@mlc-ai/web-llm";
import type { ChatMessage } from "../../entities/chat/model";

const MODEL_ID = "Qwen2.5-1.5B-Instruct-q4f16_1-MLC";

const SYSTEM_PROMPT = [
  "Você é o assistente de uma estação meteorológica.",
  "Use SOMENTE os dados dos sensores informados abaixo, que vêm do Arduino e são capturados pelo backend.",
  "Nunca invente valores e nunca use informações de outras fontes sobre o clima atual.",
  "Se um dado não estiver na lista, diga que não tem essa informação.",
  "Responda sempre em português, de forma curta e objetiva.",
].join(" ");

const REPLY_TOKEN_LIMIT = 220;
const JSON_TOKEN_LIMIT = 420;
const FACTUAL_TEMPERATURE = 0.2;
const CREATIVE_TEMPERATURE = 0.6;

export type LocalAiPhase = "idle" | "loading" | "ready" | "unsupported" | "error";

export interface LocalAiStatus {
  phase: LocalAiPhase;
  progress: number;
}

export interface CompleteOptions {
  context?: string;
  json?: boolean;
}

let status: LocalAiStatus = { phase: "idle", progress: 0 };
const listeners = new Set<() => void>();
let enginePromise: Promise<MLCEngineInterface> | null = null;

const setStatus = (next: LocalAiStatus) => {
  status = next;
  listeners.forEach((listener) => listener());
};

export const isLocalAiSupported = () => "gpu" in navigator;

const loadEngine = (): Promise<MLCEngineInterface> => {
  if (!isLocalAiSupported()) {
    setStatus({ phase: "unsupported", progress: 0 });
    return Promise.reject(new Error("WebGPU indisponível neste navegador"));
  }
  enginePromise ??= import("@mlc-ai/web-llm")
    .then(({ CreateWebWorkerMLCEngine }) =>
      CreateWebWorkerMLCEngine(new Worker(new URL("./localLlm.worker.ts", import.meta.url), { type: "module" }), MODEL_ID, {
        initProgressCallback: ({ progress }) => setStatus({ phase: "loading", progress }),
      }),
    )
    .then((engine) => {
      setStatus({ phase: "ready", progress: 1 });
      return engine;
    })
    .catch((error) => {
      enginePromise = null;
      setStatus({ phase: "error", progress: 0 });
      throw error;
    });
  return enginePromise;
};

const systemPrompt = (context?: string) =>
  context ? `${SYSTEM_PROMPT}\n\nDados atuais dos sensores:\n${context}` : SYSTEM_PROMPT;

export const localLlm = {
  preload: () => loadEngine().then(() => undefined, () => undefined),

  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },

  getStatus: () => status,

  async complete(messages: ChatMessage[], { context, json = false }: CompleteOptions = {}): Promise<string> {
    const engine = await loadEngine();
    const completion = await engine.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt(context) },
        ...messages.map(({ role, text }) => ({ role, content: text })),
      ],
      temperature: json ? CREATIVE_TEMPERATURE : FACTUAL_TEMPERATURE,
      max_tokens: json ? JSON_TOKEN_LIMIT : REPLY_TOKEN_LIMIT,
      ...(json && { response_format: { type: "json_object" as const } }),
    });
    return completion.choices[0]?.message.content ?? "";
  },
};
