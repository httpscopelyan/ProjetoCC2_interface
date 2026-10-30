import { useEffect, useRef, useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { Bot, Paperclip, Send } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

import Badge from "../../shared/ui/Badge";
import { clock } from "../../shared/lib/date";
import { useChat } from "../../entities/chat/useChat";
import {
  Attach, BotIcon, Bubble, Chip, Composer, DayDivider, Field, Head, HeadText, Message, Panel, SendButton, Suggestions,
  Thread, Time, Typing,
} from "./style";

const suggestions = ["Qual a temperatura agora?", "Resumo da semana", "Teve chuva ontem?"];
const MAX_FIELD_HEIGHT = 96;

const ChatPanel = () => {
  const { messages, typing, send } = useChat();
  const [draft, setDraft] = useState("");
  const thread = useRef<HTMLDivElement>(null);
  const field = useRef<HTMLTextAreaElement>(null);
  const handedOff = useRef(false);
  const location = useLocation();
  const navigate = useNavigate();

  // Question handed over by the AI search island: send it once, then clear it so a refresh does not resend.
  useEffect(() => {
    const q = (location.state as { q?: string } | null)?.q;
    if (!q || handedOff.current) return;
    handedOff.current = true;
    send(q);
    navigate(location.pathname, { replace: true, state: null });
  }, [location.pathname, location.state, navigate, send]);

  useEffect(() => {
    thread.current?.scrollTo({ top: thread.current.scrollHeight, behavior: "smooth" });
  }, [messages, typing]);

  const resize = () => {
    const el = field.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, MAX_FIELD_HEIGHT)}px`;
  };

  const submit = (e?: FormEvent) => {
    e?.preventDefault();
    if (!draft.trim() || typing) return;
    send(draft);
    setDraft("");
    requestAnimationFrame(resize);
  };

  const onKeyDown = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submit();
    }
  };

  return (
    <Panel>
      <Head>
        <BotIcon>
          <Bot size={18} />
        </BotIcon>
        <HeadText>
          <strong>Assistente dos sensores</strong>
          <span>Pergunte sobre as medições</span>
        </HeadText>
        <Badge>Online</Badge>
      </Head>

      {/* data-lenis-prevent: lets this box scroll on its own instead of the smooth page scroll */}
      <Thread ref={thread} data-lenis-prevent>
        <DayDivider>Hoje</DayDivider>
        {messages.map((message) => (
          <Message key={message.id} $user={message.role === "user"}>
            <Bubble $user={message.role === "user"}>{message.text}</Bubble>
            <Time>{clock(new Date(message.at))}</Time>
          </Message>
        ))}
        {typing && (
          <Typing aria-label="Digitando">
            <span />
            <span />
            <span />
          </Typing>
        )}
      </Thread>

      <Suggestions>
        {suggestions.map((text) => (
          <Chip key={text} type="button" disabled={typing} onClick={() => send(text)}>
            {text}
          </Chip>
        ))}
      </Suggestions>

      <Composer onSubmit={submit}>
        <Attach type="button" aria-label="Anexar arquivo" title="Anexar (em breve)">
          <Paperclip size={16} />
        </Attach>
        <Field
          ref={field}
          rows={1}
          value={draft}
          placeholder="Escreva uma mensagem…"
          aria-label="Mensagem"
          onChange={(e) => {
            setDraft(e.target.value);
            resize();
          }}
          onKeyDown={onKeyDown}
        />
        <SendButton type="submit" aria-label="Enviar" disabled={!draft.trim() || typing}>
          <Send size={15} />
        </SendButton>
      </Composer>
    </Panel>
  );
};

export default ChatPanel;
