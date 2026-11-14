import styled from "styled-components";
import { colors } from "../../shared/config/theme";

export const Hint = styled.p`
  font-size: 0.75rem;
  color: ${colors.muted};
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 1rem;

  @media (max-width: 1100px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`;

export const SensorCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1rem;
  border: 1px solid ${colors.border};
  border-radius: 1rem;
  background: ${colors.surface};
`;

export const SensorHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.2rem;
`;

export const IconBox = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.6rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${colors.border};
`;

export const SensorTitle = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
`;

export const BandRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.75rem;
  color: ${colors.muted};
`;

export const Dot = styled.span<{ $color: string }>`
  flex-shrink: 0;
  width: 0.55rem;
  height: 0.55rem;
  border-radius: 50%;
  background: ${({ $color }) => $color};
`;

export const BandLabel = styled.span`
  flex: 1;
  min-width: 0;
  color: ${colors.text};
`;

export const Field = styled.input`
  width: 4.5rem;
  padding: 0.3rem 0.55rem;
  font: inherit;
  font-size: 0.78rem;
  color: ${colors.text};
  background: rgba(0, 0, 0, 0.25);
  border: 1px solid ${colors.border};
  border-radius: 0.6rem;
  outline: none;

  &:focus-visible {
    border-color: ${colors.accent};
  }
`;

export const Unit = styled.span`
  min-width: 2.2rem;
  font-size: 0.7rem;
  color: ${colors.faint};
`;
