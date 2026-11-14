import styled from "styled-components";
import { colors } from "../../shared/config/theme";
import { glassFlat } from "../../shared/ui/GlassPanel/style";

export const Hint = styled.p`
  font-size: 0.75rem;
  color: ${colors.muted};
`;

export const Chips = styled.ul`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  list-style: none;
`;

export const Chip = styled.button`
  ${glassFlat}
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.5rem 0.9rem;
  border-radius: 999px;
  font-size: 0.78rem;
  color: ${colors.text};
  transition: background 0.2s;

  &:hover {
    background: ${colors.surfaceStrong};
  }
`;

export const Dot = styled.span<{ $color: string }>`
  width: 0.5rem;
  height: 0.5rem;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export const Empty = styled.p`
  font-size: 0.8rem;
  color: ${colors.muted};
`;
