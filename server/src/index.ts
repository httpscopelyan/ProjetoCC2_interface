import { createAssistant } from "./ai/assistant.ts";
import { createLlmClient } from "./ai/llmClient.ts";
import { createApp } from "./app.ts";
import { config } from "./config.ts";
import { openDatabase } from "./db/database.ts";
import { createReadingsRepository } from "./db/readingsRepository.ts";
import { startSimulator } from "./simulator/simulator.ts";
import { createAlertsService } from "./services/alertsService.ts";
import { createNewsService } from "./services/newsService.ts";
import { createSensorsService } from "./services/sensorsService.ts";

const repository = createReadingsRepository(openDatabase(config.databasePath));
const assistant = createAssistant(repository, config.llm ? createLlmClient(config.llm) : null);

const news = createNewsService();

const app = createApp({
  repository,
  sensors: createSensorsService(repository),
  alerts: createAlertsService(repository),
  news,
  assistant,
  ingestApiKey: config.ingestApiKey,
  corsOrigin: config.corsOrigin,
});

void news.list();
assistant.warmUp();

if (config.simulate) startSimulator(repository, config.simulatorIntervalMs);

app.listen(config.port, () => {
  console.log(`[api] http://localhost:${config.port}  simulador=${config.simulate ? "ligado" : "desligado"}  llm=${assistant.model ?? "não configurado (chat por regras)"}`);
});
