import { SENSOR_DEFS } from "../config/sensors";
import type { ChatMessage } from "../../entities/chat/model";
import { USE_MOCK, delay, post } from "./client";
import { mockSensors } from "./mock/sensors";

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

export const chatApi = {
  async send(messages: ChatMessage[]): Promise<string> {
    if (USE_MOCK) {
      await delay(700);
      const last = [...messages].reverse().find((m) => m.role === "user");
      return stubReply(last?.text ?? "");
    }
    const { reply } = await post<{ reply: string }>("/api/chat", { messages });
    return reply;
  },
};
