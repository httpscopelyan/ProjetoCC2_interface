import styled from "styled-components";
import { motion } from "framer-motion";
import { colors } from "../../shared/config/theme";
import { glass } from "../../shared/ui/GlassPanel/style";

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

export const Card = styled(motion.div)`
  ${glass}
  width: min(26rem, 100%);
  padding: 1.25rem;
  border-radius: 1.5rem;
  pointer-events: auto;
  background: rgba(18, 20, 24, 0.85);

  form {
    display: flex;
    flex-direction: column;
    gap: 0.9rem;
  }
`;

export const Heading = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
`;

export const Stars = styled.div`
  display: flex;
  gap: 0.25rem;
`;

export const StarButton = styled.button<{ $filled: boolean }>`
  display: inline-flex;
  color: ${({ $filled }) => ($filled ? colors.warning : colors.faint)};
  transition: color 0.2s, transform 0.2s;

  svg {
    fill: ${({ $filled }) => ($filled ? colors.warning : "none")};
  }

  &:hover {
    transform: scale(1.15);
  }
`;

export const Field = styled.textarea`
  resize: none;
  padding: 0.7rem 0.9rem;
  font: inherit;
  font-size: 0.82rem;
  color: ${colors.text};
  background: ${colors.surface};
  border: 1px solid ${colors.border};
  border-radius: 0.9rem;
  outline: none;

  &::placeholder {
    color: ${colors.faint};
  }
`;

export const Submit = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  align-self: flex-end;
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
  background: ${colors.accent};
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const Thanks = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
`;
