import { createHash } from "node:crypto";

interface Entry {
  value: string;
  expiresAt: number;
}

export const createResponseCache = (ttlMs: number, maxEntries: number) => {
  const entries = new Map<string, Entry>();

  return {
    keyOf: (...parts: unknown[]): string => createHash("sha1").update(JSON.stringify(parts)).digest("hex"),

    get(key: string): string | undefined {
      const entry = entries.get(key);
      if (!entry) return undefined;
      if (entry.expiresAt < Date.now()) {
        entries.delete(key);
        return undefined;
      }
      return entry.value;
    },

    set(key: string, value: string): void {
      if (entries.size >= maxEntries) entries.delete(entries.keys().next().value as string);
      entries.set(key, { value, expiresAt: Date.now() + ttlMs });
    },
  };
};
