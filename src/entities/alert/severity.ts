import { colors } from "../../shared/config/theme";
import type { AlertSeverity } from "./model";

export const severityColor: Record<AlertSeverity, string> = {
  info: colors.accent,
  warning: colors.warning,
  critical: colors.danger,
};

export const severityLabel: Record<AlertSeverity, string> = {
  info: "Informativo",
  warning: "Atenção",
  critical: "Crítico",
};
