import styled from "styled-components";
import { colors } from "../../shared/config/theme";
import { glassFlat } from "../../shared/ui/GlassPanel/style";

export const Group = styled.div`
  ${glassFlat}
  display: inline-flex;
  padding: 0.2rem;
  border-radius: 999px;
`;

export const Option = styled.button<{ $active: boolean }>`
  padding: 0.35rem 0.9rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "#111" : colors.muted)};
  background: ${({ $active }) => ($active ? "rgba(255, 255, 255, 0.92)" : "transparent")};
  transition: background 0.2s, color 0.2s;
`;
