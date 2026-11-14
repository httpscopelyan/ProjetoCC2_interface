import { USE_MOCK, delay, post } from "./client";

export interface Feedback {
  rating: number;
  message: string;
}

export const feedbackApi = {
  async send(feedback: Feedback): Promise<void> {
    if (USE_MOCK) {
      await delay(400);
      return;
    }
    await post<unknown>("/api/feedback", feedback);
  },
};
