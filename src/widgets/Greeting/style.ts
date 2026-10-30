import styled from "styled-components";
import { colors } from "../../shared/config/theme";

export const Row = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const DateLine = styled.p`
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
  font-size: 0.85rem;
  color: ${colors.muted};
`;

// Discreet live clock next to the date.
export const Clock = styled.span`
  font-size: 0.72rem;
  font-variant-numeric: tabular-nums;
  color: ${colors.faint};
`;

export const Title = styled.h1`
  margin-top: 0.1rem;
  font-size: 1.75rem;
  font-weight: 600;
  color: ${colors.text};
`;

export const Actions = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;
