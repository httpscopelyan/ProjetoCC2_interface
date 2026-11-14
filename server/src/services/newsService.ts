import { createHash } from "node:crypto";

export interface NewsDto {
  id: string;
  title: string;
  summary: string;
  source: string;
  url: string;
}

interface GdeltArticle {
  url: string;
  title: string;
  domain: string;
  seendate: string;
}

const GDELT_URL = "https://api.gdeltproject.org/api/v2/doc/doc";
const GDELT_QUERY = "(clima OR chuva OR previsão) sourcelang:portuguese sourcecountry:BR";
const CACHE_TTL_MS = 30 * 60_000;
const RETRY_AFTER_FAILURE_MS = 60_000;
const REQUEST_TIMEOUT_MS = 10_000;
const MAX_ITEMS = 10;

const SEEN_DATE = /^(\d{4})(\d{2})(\d{2})T/;

const formatSeenDate = (seendate: string): string => {
  const match = SEEN_DATE.exec(seendate);
  return match ? `${match[3]}/${match[2]}` : "";
};

const toNewsItem = ({ url, title, domain, seendate }: GdeltArticle): NewsDto => ({
  id: createHash("sha1").update(url).digest("hex").slice(0, 12),
  title: title.trim(),
  summary: `${domain} · ${formatSeenDate(seendate)}`,
  source: domain,
  url,
});

const uniqueByTitle = (items: NewsDto[]): NewsDto[] => {
  const seen = new Set<string>();
  return items.filter(({ title }) => !seen.has(title) && seen.add(title));
};

const RATE_LIMIT_WAIT_MS = 6_000;
const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const requestGdelt = async (): Promise<GdeltArticle[]> => {
  const params = new URLSearchParams({
    query: GDELT_QUERY,
    mode: "artlist",
    format: "json",
    sort: "datedesc",
    timespan: "3d",
    maxrecords: String(MAX_ITEMS * 2),
  });
  const response = await fetch(`${GDELT_URL}?${params}`, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  const body = await response.text();
  if (!body.startsWith("{")) throw new RateLimitedError();
  return (JSON.parse(body) as { articles?: GdeltArticle[] }).articles ?? [];
};

class RateLimitedError extends Error {
  constructor() {
    super("GDELT limitou a taxa de requisições");
  }
}

const fetchFromGdelt = async (): Promise<NewsDto[]> => {
  const articles = await requestGdelt().catch(async (error) => {
    if (!(error instanceof RateLimitedError)) throw error;
    await wait(RATE_LIMIT_WAIT_MS);
    return requestGdelt();
  });
  return uniqueByTitle(articles.filter((article) => article.title && article.url).map(toNewsItem)).slice(0, MAX_ITEMS);
};

const FALLBACK_FEED = { url: "https://g1.globo.com/rss/g1/meio-ambiente/", name: "g1" };
const WEATHER_WORDS = /clima|chuva|tempo|temperatura|calor|frio|tempestade|vendaval|seca|enchente|previs|el niño|la niña|frente fria|ar seco|umidade/i;

const tagContent = (item: string, tag: string): string =>
  item.match(new RegExp(String.raw`<${tag}[^>]*>(?:<!\[CDATA\[)?([\s\S]*?)(?:\]\]>)?</${tag}>`))?.[1].trim() ?? "";

const decodeEntities = (text: string): string =>
  text.replace(/&amp;/g, "&").replace(/&quot;/g, '"').replace(/&#39;|&apos;/g, "'").replace(/&lt;/g, "<").replace(/&gt;/g, ">");

const stripHtml = (html: string): string => decodeEntities(html.replace(/<!\[CDATA\[|\]\]>/g, " ").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim());

const fetchFromFallbackFeed = async (): Promise<NewsDto[]> => {
  const response = await fetch(FALLBACK_FEED.url, { signal: AbortSignal.timeout(REQUEST_TIMEOUT_MS) });
  if (!response.ok) throw new Error(`feed ${FALLBACK_FEED.name} respondeu ${response.status}`);
  const items = (await response.text()).split("<item>").slice(1);
  const news = items.map((item): NewsDto => {
    const url = decodeEntities(tagContent(item, "link"));
    const description = stripHtml(tagContent(item, "description"));
    return {
      id: createHash("sha1").update(url).digest("hex").slice(0, 12),
      title: stripHtml(tagContent(item, "title")),
      summary: description.slice(0, 160) || FALLBACK_FEED.name,
      source: FALLBACK_FEED.name,
      url,
    };
  });
  return uniqueByTitle(news.filter(({ title, summary, url }) => url && WEATHER_WORDS.test(`${title} ${summary}`))).slice(0, MAX_ITEMS);
};

const fetchLiveNews = async (): Promise<NewsDto[]> => {
  try {
    const fromGdelt = await fetchFromGdelt();
    if (fromGdelt.length > 0) return fromGdelt;
  } catch (error) {
    console.warn("[notícias] GDELT indisponível, tentando o feed de reserva:", (error as Error).message);
  }
  return fetchFromFallbackFeed();
};

export const createNewsService = (fetchNews: () => Promise<NewsDto[]> = fetchLiveNews) => {
  let cached: NewsDto[] = [];
  let nextRefreshAt = 0;
  let pending: Promise<NewsDto[]> | null = null;

  const refresh = async (): Promise<NewsDto[]> => {
    try {
      cached = await fetchNews();
      nextRefreshAt = Date.now() + CACHE_TTL_MS;
    } catch (error) {
      nextRefreshAt = Date.now() + RETRY_AFTER_FAILURE_MS;
      console.warn("[notícias] falha ao buscar notícias, usando cache:", (error as Error).message);
    }
    return cached;
  };

  return {
    async list(): Promise<NewsDto[]> {
      if (Date.now() < nextRefreshAt) return cached;
      pending ??= refresh().finally(() => {
        pending = null;
      });
      return pending;
    },
  };
};
