const env = process.env;

const llmBaseUrl = env.LLM_BASE_URL?.replace(/\/$/, "");

export const config = {
  port: Number(env.PORT ?? 3000),
  databasePath: env.DATABASE_PATH ?? "data/weather.db",
  simulate: env.SIMULATE === "true",
  simulatorIntervalMs: Number(env.SIMULATOR_INTERVAL_MS ?? 30_000),
  ingestApiKey: env.INGEST_API_KEY ?? "",
  corsOrigin: env.CORS_ORIGIN ?? "*",
  llm: llmBaseUrl && env.LLM_MODEL ? { baseUrl: llmBaseUrl, model: env.LLM_MODEL, apiKey: env.LLM_API_KEY ?? "" } : null,
};
