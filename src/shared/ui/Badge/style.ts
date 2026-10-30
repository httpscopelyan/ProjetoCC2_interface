import styled from "styled-components";
import { colors } from "../../config/theme";

export const Pill = styled.span<{ $tone: "success" | "danger" }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.55rem;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${({ $tone }) => colors[$tone]};
  background: ${({ $tone }) =>
    $tone === "success" ? "rgba(52, 211, 153, 0.16)" : "rgba(248, 113, 113, 0.16)"};
`;
