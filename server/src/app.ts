import express from "express";
import type { NextFunction, Request, Response } from "express";
import { GenerationUnavailableError } from "./ai/assistant.ts";
import type { Assistant, ConversationMessage } from "./ai/assistant.ts";
import type { ReadingsRepository } from "./db/readingsRepository.ts";
import { isIsoDay, isPeriod } from "./domain/period.ts";
import { isSensorId } from "./domain/sensors.ts";
import type { AlertDto } from "./services/alertsService.ts";
import { parseIngest } from "./services/ingest.ts";
import type { NewsDto } from "./services/newsService.ts";
import type { SensorsService } from "./services/sensorsService.ts";

interface AppDependencies {
  repository: ReadingsRepository;
  sensors: SensorsService;
  alerts: { list: () => AlertDto[] };
  news: { list: () => Promise<NewsDto[]> };
  assistant: Assistant;
  ingestApiKey: string;
  corsOrigin: string;
}

const MAX_MESSAGES = 20;
const MAX_TEXT_LENGTH = 2000;

const isConversation = (value: unknown): value is ConversationMessage[] =>
  Array.isArray(value) &&
  value.length > 0 &&
  value.length <= MAX_MESSAGES &&
  value.every(
    (item) =>
      (item?.role === "user" || item?.role === "assistant") && typeof item.text === "string" && item.text.length <= MAX_TEXT_LENGTH,
  );

const allowCors = (origin: string) => (request: Request, response: Response, next: NextFunction) => {
  response.setHeader("Access-Control-Allow-Origin", origin);
  response.setHeader("Access-Control-Allow-Headers", "Content-Type, x-api-key");
  response.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  if (request.method === "OPTIONS") return void response.sendStatus(204);
  next();
};

export const createApp = ({ repository, sensors, alerts, news, assistant, ingestApiKey, corsOrigin }: AppDependencies) => {
  const app = express();
  app.use(allowCors(corsOrigin));
  app.use(express.json({ limit: "64kb" }));

  app.get("/api/health", (_request, response) => {
    response.json({ ok: true, readings: repository.count() });
  });

  app.get("/api/sensors/latest", (_request, response) => {
    response.json(sensors.latest());
  });

  app.get("/api/sensors/available-days", (_request, response) => {
    response.json(sensors.availableDays());
  });

  app.get("/api/sensors/:id/series", (request, response) => {
    const { id } = request.params;
    const period = String(request.query.period ?? "now");
    const day = request.query.day === undefined ? null : String(request.query.day);
    if (!isSensorId(id)) return void response.status(404).json({ error: "sensor desconhecido" });
    if (!isPeriod(period) || (day !== null && !isIsoDay(day))) return void response.status(400).json({ error: "period ou day inválido" });
    response.json(sensors.series(id, period, day));
  });

  app.post("/api/readings", (request, response) => {
    if (ingestApiKey && request.header("x-api-key") !== ingestApiKey) return void response.status(401).json({ error: "chave inválida" });
    const { readings, errors } = parseIngest(request.body);
    if (readings.length > 0) repository.insertMany(readings);
    response.status(readings.length > 0 ? 201 : 400).json({ saved: readings.length, errors });
  });

  app.get("/api/alerts", (_request, response) => {
    response.json(alerts.list());
  });

  app.get("/api/news", async (_request, response) => {
    response.json(await news.list());
  });

  app.get("/api/ai/status", (_request, response) => {
    response.json({ generative: assistant.generationAvailable, model: assistant.model });
  });

  app.get("/api/ai/context", (_request, response) => {
    response.type("text/plain; charset=utf-8").send(assistant.describeContext());
  });

  app.post("/api/chat", async (request, response) => {
    const { messages } = request.body ?? {};
    if (!isConversation(messages)) return void response.status(400).json({ error: "messages inválido" });
    response.json(await assistant.chat(messages));
  });

  app.post("/api/ai/generate", async (request, response) => {
    const { prompt, json = false } = request.body ?? {};
    if (typeof prompt !== "string" || prompt.length === 0 || prompt.length > MAX_TEXT_LENGTH * 2) return void response.status(400).json({ error: "prompt inválido" });
    response.json(await assistant.generate(prompt, json === true));
  });

  app.use((error: Error, _request: Request, response: Response, _next: NextFunction) => {
    if (error instanceof GenerationUnavailableError) return void response.status(501).json({ error: error.message });
    console.error("[erro]", error);
    response.status(500).json({ error: "erro interno" });
  });

  return app;
};
