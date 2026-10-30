import type { Alert } from "../../entities/alert/model";
import { USE_MOCK, delay, get } from "./client";
import { mockAlerts } from "./mock/alerts";

export const alertsApi = {
  // GET /api/alerts -> Alert[]
  async list(): Promise<Alert[]> {
    if (USE_MOCK) {
      await delay(80);
      return mockAlerts();
    }
    return get<Alert[]>("/api/alerts");
  },
};
