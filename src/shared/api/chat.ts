import { SENSOR_DEFS } from "../config/sensors";
import type { ChatMessage } from "../../entities/chat/model";
import { USE_MOCK, delay, get, post } from "./client";
import { isLocalAiSupported, localLlm } from "./localLlm";
import { mockSensors } from "./mock/sensors";

interface SendOptions {
  local?: boolean;
  context?: string;
  json?: boolean;
}

interface AskOptions extends SendOptions {
  fallback: string;
}

const normalize = (text: string) =>
  text
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "");

const stubReply = (question: string) => {
  const q = normalize(question);
  const def = SENSOR_DEFS.find((d) => d.aliases.some((alias) => q.includes(alias)));
  if (def) {
    const reading = mockSensors.latest().find((r) => r.sensorId === def.id);
    if (reading) {
      const value = reading.value.toLocaleString("pt-BR", { maximumFractionDigits: def.decimals });
      return `${def.title} agora: ${value} ${def.unit}. (Resposta simulada: a IA real ainda não está conectada.)`;
    }
  }
  return "Ainda estou em modo de demonstração. Quando a IA real for conectada, responderei perguntas sobre o histórico dos sensores.";
};

const userMessage = (text: string): ChatMessage => ({
  id: `ask-${Date.now()}`,
  role: "user",
  text,
  at: new Date().toISOString(),
});

const usesLocalAi = (local: boolean) => local && isLocalAiSupported();

interface BackendReply {
  reply: string;
}

let backendGeneration: Promise<boolean> | null = null;

const backendCanGenerate = (): Promise<boolean> => {
  backendGeneration ??= get<{ generative: boolean }>("/api/ai/status")
    .then(({ generative }) => generative)
    .catch(() => {
      backendGeneration = null;
      return false;
    });
  return backendGeneration;
};

export const chatApi = {
  async send(messages: ChatMessage[], { local = false, context, json }: SendOptions = {}): Promise<string> {
    if (usesLocalAi(local)) return localLlm.complete(messages, { context, json });
    if (USE_MOCK) {
      await delay(700);
      const last = [...messages].reverse().find((m) => m.role === "user");
      return stubReply(last?.text ?? "");
    }
    const question = [...messages].reverse().find(({ role }) => role === "user");
    const { reply } = await post<BackendReply>("/api/chat", { messages: [{ role: "user", text: question?.text ?? "" }] });
    return reply;
  },

  async ask(prompt: string, { fallback, ...options }: AskOptions): Promise<string> {
    if (usesLocalAi(options.local ?? false)) return chatApi.send([userMessage(prompt)], options);
    if (USE_MOCK) {
      await delay(300);
      return fallback;
    }
    if (!(await backendCanGenerate())) return fallback;
    const { reply } = await post<BackendReply>("/api/ai/generate", { prompt, json: options.json ?? false });
    return reply || fallback;
  },
};
