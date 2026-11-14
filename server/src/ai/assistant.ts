import type { ReadingsRepository } from "../db/readingsRepository.ts";
import { answerQuestion, answerSummary, unknownQuestionReply } from "./answerEngine.ts";
import { loadAiConfig } from "./aiConfig.ts";
import { buildAiContext } from "./context.ts";
import type { LlmClient, LlmMessage } from "./llmClient.ts";
import { createResponseCache } from "./responseCache.ts";

export interface ConversationMessage {
  role: "user" | "assistant";
  text: string;
}

export type ReplySource = "rules" | "llm" | "cache";

export interface AssistantReply {
  reply: string;
  source: ReplySource;
}

const CACHE_TTL_MS = 2 * 60_000;
const CACHE_MAX_ENTRIES = 200;
const KEEP_WARM_INTERVAL_MS = 4 * 60_000;
const GENERATE_TOKEN_LIMIT = 420;
const FACTUAL_TEMPERATURE = 0.2;
const CREATIVE_TEMPERATURE = 0.6;

export class GenerationUnavailableError extends Error {
  constructor() {
    super("Nenhum LLM configurado no backend");
  }
}

export const createAssistant = (repository: ReadingsRepository, llm: LlmClient | null) => {
  const cache = createResponseCache(CACHE_TTL_MS, CACHE_MAX_ENTRIES);

  const systemMessage = (question = ""): LlmMessage => {
    const config = loadAiConfig();
    return { role: "system", content: `${config.systemPrompt}

${buildAiContext(repository, config, new Date(), question).text}` };
  };

  const completeWithLlm = async (client: LlmClient, messages: LlmMessage[], json: boolean): Promise<AssistantReply> => {
    const key = cache.keyOf(loadAiConfig().systemPrompt, messages.slice(1), json);
    const cached = cache.get(key);
    if (cached !== undefined) return { reply: cached, source: "cache" };
    const reply = await client.complete(messages, {
      json,
      maxTokens: json ? GENERATE_TOKEN_LIMIT : loadAiConfig().maxReplyTokens,
      temperature: json ? CREATIVE_TEMPERATURE : FACTUAL_TEMPERATURE,
    });
    if (reply) cache.set(key, reply);
    return { reply, source: "llm" };
  };

  return {
    generationAvailable: llm !== null,
    model: llm?.model ?? null,

    async chat(conversation: ConversationMessage[]): Promise<AssistantReply> {
      const userQuestions = conversation.filter(({ role }) => role === "user").map(({ text }) => text);
      const question = userQuestions.at(-1) ?? "";
      const now = new Date();

      const config = loadAiConfig();
      const { facts } = buildAiContext(repository, config, now);
      const answer = config.rulesFirst || !llm ? answerQuestion(question, userQuestions.slice(0, -1).reverse(), { repository, facts, now }) : null;
      if (answer !== null) return { reply: answer, source: "rules" };
      if (!llm) return { reply: `${answerSummary(facts)} ${unknownQuestionReply}`, source: "rules" };

      const history: LlmMessage[] = conversation.map(({ role, text }) => ({ role, content: text }));
      try {
        return await completeWithLlm(llm, [systemMessage(question), ...history], false);
      } catch (error) {
        console.warn("[ia] LLM indisponível, respondendo por regras:", (error as Error).message);
        return { reply: `${answerSummary(facts)} ${unknownQuestionReply}`, source: "rules" };
      }
    },

    warmUp(): void {
      if (!llm) return;
      const ping = () =>
        void llm.complete([systemMessage(), { role: "user", content: "ok" }], { maxTokens: 1, temperature: 0 }).catch((error: Error) => console.warn("[ia] LLM não respondeu ao aquecimento:", error.message));
      ping();
      setInterval(ping, KEEP_WARM_INTERVAL_MS).unref();
    },

    describeContext: (): string => `${loadAiConfig().systemPrompt}

${buildAiContext(repository, loadAiConfig()).text}`,

    async generate(prompt: string, json: boolean): Promise<AssistantReply> {
      if (!llm) throw new GenerationUnavailableError();
      return completeWithLlm(llm, [systemMessage(), { role: "user", content: prompt }], json);
    },
  };
};

export type Assistant = ReturnType<typeof createAssistant>;
