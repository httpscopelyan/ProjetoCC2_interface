import styled from "styled-components";
import { motion } from "framer-motion";
import { colors } from "../../config/theme";
import { glass } from "../GlassPanel/style";

export const Card = styled(motion.div)<{ $color: string; $selected: boolean }>`
  ${glass}
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding: 1.1rem 1.25rem;
  border-radius: 1.25rem;
  min-width: 0;
  cursor: pointer;
  outline: none;
  border-color: ${({ $selected }) => ($selected ? "rgba(255, 255, 255, 0.55)" : colors.border)};
  box-shadow: ${({ $selected }) =>
    $selected ? "0 0 0 1px rgba(255, 255, 255, 0.2) inset, 0 4px 16px rgba(0, 0, 0, 0.16)" : "0 4px 16px rgba(0, 0, 0, 0.16)"};
  transition: border-color 0.3s ease, box-shadow 0.3s ease;

  /* faint wash in the sensor's state color; a flat color so it can cross-fade smoothly */
  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: inherit;
    background-color: ${({ $color }) => $color};
    opacity: 0.12;
    pointer-events: none;
    transition: background-color 0.6s ease;
  }

  /* lifts the card (and its help tooltip) above its neighbours */
  &:hover,
  &:focus-within {
    z-index: 20;
  }

  &:focus-visible {
    border-color: rgba(255, 255, 255, 0.7);
  }
`;

export const Header = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const IconBox = styled.span<{ $accent: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.6rem;
  color: ${({ $accent }) => $accent};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${colors.border};
  transition: color 0.6s ease;
`;

export const Corner = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  color: ${colors.faint};
`;

export const Title = styled.p`
  position: relative;
  font-size: 0.78rem;
  color: ${colors.muted};
`;

export const Body = styled.div`
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const Value = styled.h2`
  font-size: 1.75rem;
  font-weight: 700;
  line-height: 1.1;
  color: ${colors.text};
`;

export const Unit = styled.span`
  margin-left: 0.2rem;
  font-size: 0.8rem;
  font-weight: 500;
  color: ${colors.muted};
`;

export const Footer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
`;

export const StateLabel = styled.span<{ $color: string }>`
  font-size: 0.7rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
  transition: color 0.6s ease;
`;
