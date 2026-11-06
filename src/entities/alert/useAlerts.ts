import { useEffect, useState } from "react";
import { alertsApi } from "../../shared/api/alerts";
import type { Alert } from "./model";

export const useAlerts = () => {
  const [alerts, setAlerts] = useState<Alert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    alertsApi
      .list()
      .then((list) => !cancelled && setAlerts([...list].sort((a, b) => b.at.localeCompare(a.at))))
      .catch(() => !cancelled && setAlerts([]))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, []);

  return { alerts, loading };
};
