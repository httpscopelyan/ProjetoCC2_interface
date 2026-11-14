import { useEffect, useState } from "react";
import { newsApi } from "../../shared/api/news";
import type { NewsItem } from "./model";

export const useNews = (): NewsItem[] => {
  const [items, setItems] = useState<NewsItem[]>([]);

  useEffect(() => {
    let cancelled = false;
    newsApi
      .list()
      .then((list) => !cancelled && setItems(list))
      .catch(() => !cancelled && setItems([]));
    return () => {
      cancelled = true;
    };
  }, []);

  return items;
};
