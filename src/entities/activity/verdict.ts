import { CircleCheck, OctagonX, TriangleAlert } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { colors } from "../../shared/config/theme";
import type { VerdictStatus } from "./activities";

export const verdictColor: Record<VerdictStatus, string> = {
  go: colors.success,
  caution: colors.warning,
  stop: colors.danger,
};

export const verdictLabel: Record<VerdictStatus, string> = {
  go: "Pode",
  caution: "Com cuidado",
  stop: "Evite",
};

export const verdictIcon: Record<VerdictStatus, LucideIcon> = {
  go: CircleCheck,
  caution: TriangleAlert,
  stop: OctagonX,
};
