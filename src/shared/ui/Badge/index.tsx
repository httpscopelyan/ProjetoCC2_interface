import type { ReactNode } from "react";
import { Pill } from "./style";

interface BadgeProps {
  tone?: "success" | "danger";
  children: ReactNode;
}

const Badge = ({ tone = "success", children }: BadgeProps) => {
  return <Pill $tone={tone}>{children}</Pill>;
};

export default Badge;
