import styled from "styled-components";
import { motion } from "framer-motion";
import { colors } from "../../shared/config/theme";

export const Subtitle = styled.p`
  margin-top: 0.15rem;
  font-size: 0.72rem;
  color: ${colors.muted};
`;

export const Plot = styled.div`
  flex: 1;
  display: flex;
  gap: 0.75rem;
  min-height: 15rem;
`;

export const YAxis = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: space-between;
  padding-bottom: 1.5rem;
  font-size: 0.68rem;
  color: ${colors.faint};
`;

export const Bars = styled.div<{ $count: number }>`
  flex: 1;
  display: grid;
  grid-template-columns: repeat(${({ $count }) => $count}, minmax(0, 1fr));
  gap: ${({ $count }) => ($count > 12 ? "0.35rem" : "1rem")};
`;

export const Column = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  min-width: 0;
`;

export const Track = styled.div`
  position: relative;
  flex: 1;
  width: 100%;
  display: flex;
  align-items: flex-end;
  justify-content: center;
`;

export const Bar = styled(motion.div)<{ $color: string; $highlighted?: boolean }>`
  width: min(2.75rem, 80%);
  transform-origin: bottom;
  border-radius: 0.6rem 0.6rem 0.3rem 0.3rem;
  background: ${({ $color }) => $color};
  opacity: ${({ $highlighted }) => ($highlighted ? 1 : 0.55)};
  box-shadow: ${({ $highlighted, $color }) => ($highlighted ? `0 0 24px ${$color}` : "none")};
  transition: opacity 0.2s ease;

  &:hover {
    opacity: 1;
  }
`;

export const Value = styled.span`
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${colors.text};
`;

export const Label = styled.span`
  height: 1rem;
  font-size: 0.68rem;
  color: ${colors.faint};
  white-space: nowrap;
`;

export const Empty = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 15rem;
  font-size: 0.8rem;
  color: ${colors.muted};
`;
