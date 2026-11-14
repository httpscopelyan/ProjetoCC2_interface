import { useCallback, useRef, useState } from "react";
import { chatApi } from "../../shared/api/chat";
import { useSensorContext } from "../insight/useSensorContext";
import { useSettings } from "../settings/context";
import type { ChatMessage } from "./model";

const id = () => `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;

const welcome: ChatMessage = {
  id: "welcome",
  role: "assistant",
  text: "Olá! Sou o assistente dos sensores. Pergunte sobre temperatura, umidade, pressão, qualidade do ar, luminosidade ou chuva.",
  at: new Date().toISOString(),
};

export const useChat = () => {
  const { localAi } = useSettings();
  const context = useSensorContext();
  const [messages, setMessages] = useState<ChatMessage[]>([welcome]);
  const [typing, setTyping] = useState(false);
  const thread = useRef<ChatMessage[]>([welcome]);
  const busy = useRef(false);

  const append = useCallback((message: ChatMessage) => {
    thread.current = [...thread.current, message];
    setMessages(thread.current);
  }, []);

  const send = useCallback(
    async (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || busy.current) return;
      busy.current = true;

      append({ id: id(), role: "user", text: trimmed, at: new Date().toISOString() });
      setTyping(true);
      let reply: string;
      try {
        reply = await chatApi.send(thread.current, { local: localAi, context });
      } catch {
        reply = "Não consegui responder agora. Tente novamente em instantes.";
      }
      append({ id: id(), role: "assistant", text: reply, at: new Date().toISOString() });
      setTyping(false);
      busy.current = false;
    },
    [append, localAi, context],
  );

  return { messages, typing, send };
};
