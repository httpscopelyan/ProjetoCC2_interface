export interface LlmMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export interface LlmOptions {
  json?: boolean;
  maxTokens: number;
  temperature: number;
}

export interface LlmClient {
  model: string;
  complete(messages: LlmMessage[], options: LlmOptions): Promise<string>;
}

interface LlmSettings {
  baseUrl: string;
  model: string;
  apiKey: string;
}

const REQUEST_TIMEOUT_MS = 120_000;

export const createLlmClient = ({ baseUrl, model, apiKey }: LlmSettings): LlmClient => ({
  model,
  async complete(messages, { json, maxTokens, temperature }) {
    const response = await fetch(`${baseUrl}/chat/completions`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...(apiKey && { Authorization: `Bearer ${apiKey}` }) },
      body: JSON.stringify({
        model,
        messages,
        temperature,
        max_tokens: maxTokens,
        ...(json && { response_format: { type: "json_object" } }),
      }),
      signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS),
    });
    if (!response.ok) throw new Error(`LLM respondeu ${response.status}`);
    const body = (await response.json()) as { choices?: { message?: { content?: string } }[] };
    return body.choices?.[0]?.message?.content?.trim() ?? "";
  },
});
