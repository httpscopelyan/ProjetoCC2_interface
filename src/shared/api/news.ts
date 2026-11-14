import type { NewsItem } from "../../entities/news/model";
import { USE_MOCK, delay, get } from "./client";

const MOCK_SOURCE = "Exemplo";

const MOCK_NEWS: NewsItem[] = [
  {
    id: "mock-pressure",
    title: "Pressão em queda costuma anteceder chuva",
    summary: "Quando a pressão cai de forma contínua por horas, o tempo tende a ficar instável.",
    source: MOCK_SOURCE,
  },
  {
    id: "mock-humidity",
    title: "Umidade baixa pede atenção com a saúde",
    summary: "Abaixo de 30% o ar resseca vias respiratórias e pele; beba água e umidifique o ambiente.",
    source: MOCK_SOURCE,
  },
  {
    id: "mock-heat",
    title: "Como se proteger em dias muito quentes",
    summary: "Evite exposição ao sol nas horas de pico, use roupas leves e hidrate-se com frequência.",
    source: MOCK_SOURCE,
  },
  {
    id: "mock-air",
    title: "Qualidade do ar e atividades ao ar livre",
    summary: "Com o índice de qualidade do ar alto, prefira exercícios em ambientes fechados.",
    source: MOCK_SOURCE,
  },
];

export const newsApi = {
  async list(): Promise<NewsItem[]> {
    if (USE_MOCK) {
      await delay(120);
      return MOCK_NEWS;
    }
    return get<NewsItem[]>("/api/news");
  },
};
