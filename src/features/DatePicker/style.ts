import styled from "styled-components";
import { motion } from "framer-motion";
import { colors } from "../../shared/config/theme";
import { glass } from "../../shared/ui/GlassPanel/style";

export const Anchor = styled.div`
  position: relative;
`;

export const Popover = styled(motion.div)`
  ${glass}
  position: absolute;
  top: calc(100% + 0.6rem);
  left: 0;
  z-index: 50;
  width: 18rem;
  padding: 1rem;
  border-radius: 1.25rem;
  transform-origin: top left;
  background: rgba(20, 22, 26, 0.92);
`;

export const Top = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
`;

export const Month = styled.p`
  font-size: 0.85rem;
  font-weight: 600;
  color: ${colors.text};

  &::first-letter {
    text-transform: uppercase;
  }
`;

export const Nav = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 1.8rem;
  height: 1.8rem;
  border-radius: 50%;
  color: ${colors.text};

  &:hover {
    background: ${colors.surfaceStrong};
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  gap: 0.2rem;
`;

export const Weekday = styled.span`
  padding-bottom: 0.3rem;
  text-align: center;
  font-size: 0.68rem;
  text-transform: uppercase;
  color: ${colors.faint};
`;

export const Day = styled.button<{ $selected: boolean }>`
  aspect-ratio: 1;
  border-radius: 50%;
  font-size: 0.78rem;
  color: ${({ $selected }) => ($selected ? "#111" : colors.text)};
  background: ${({ $selected }) => ($selected ? "rgba(255, 255, 255, 0.92)" : "transparent")};
  transition: background 0.15s;

  &:hover:not(:disabled) {
    background: ${({ $selected }) => ($selected ? "rgba(255, 255, 255, 0.92)" : colors.surfaceStrong)};
  }

  &:disabled {
    opacity: 0.3;
    pointer-events: none;
  }
`;

export const Footer = styled.div`
  display: flex;
  justify-content: flex-end;
  margin-top: 0.75rem;
`;

export const Clear = styled.button`
  font-size: 0.75rem;
  color: ${colors.muted};

  &:hover {
    color: ${colors.text};
  }
`;
