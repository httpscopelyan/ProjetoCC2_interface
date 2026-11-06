import styled from "styled-components";
import { motion } from "framer-motion";
import { colors } from "../../shared/config/theme";
import { glass, glassFlat } from "../../shared/ui/GlassPanel/style";

export const Trigger = styled(motion.button)`
  ${glassFlat}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  color: ${colors.text};
`;

export const Backdrop = styled(motion.div)`
  position: fixed;
  inset: 0;
  z-index: 90;
  background: rgba(0, 0, 0, 0.25);
`;

export const Layer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
  display: flex;
  justify-content: center;
  padding: 1.5rem 1rem 0;
  pointer-events: none;
`;

export const Island = styled(motion.div)`
  ${glass}
  width: min(34rem, 100%);
  overflow: hidden;
  pointer-events: auto;
  background: rgba(18, 20, 24, 0.78);
`;

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.9rem 1.1rem;
  color: ${colors.muted};
`;

export const Input = styled.input`
  flex: 1;
  min-width: 0;
  font: inherit;
  font-size: 0.95rem;
  color: ${colors.text};
  background: transparent;
  border: 0;
  outline: none;

  &::placeholder {
    color: ${colors.faint};
  }
`;

export const Hint = styled.kbd`
  padding: 0.1rem 0.4rem;
  border-radius: 0.4rem;
  font: inherit;
  font-size: 0.65rem;
  color: ${colors.faint};
  border: 1px solid ${colors.border};
`;

export const Results = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  padding: 0.4rem 0.6rem 0.7rem;
  border-top: 1px solid ${colors.border};
  list-style: none;
`;

export const Result = styled.button<{ $color?: string }>`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  width: 100%;
  padding: 0.55rem 0.6rem;
  border-radius: 0.8rem;
  text-align: left;
  color: ${colors.text};

  &:hover,
  &:focus-visible {
    background: ${colors.surfaceStrong};
  }

  > svg:first-child {
    color: ${({ $color }) => $color ?? colors.muted};
    flex-shrink: 0;
  }
`;

export const ResultText = styled.span`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;

  strong {
    font-size: 0.82rem;
    font-weight: 600;
  }

  span {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 0.72rem;
    color: ${colors.muted};
  }
`;
