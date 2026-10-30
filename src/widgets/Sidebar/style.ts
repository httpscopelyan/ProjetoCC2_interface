import styled from "styled-components";
import { motion } from "framer-motion";
import { NavLink } from "react-router-dom";
import { colors } from "../../shared/config/theme";
import { glass } from "../../shared/ui/GlassPanel/style";

export const Rail = styled(motion.aside)`
  ${glass}
  position: fixed;
  top: 0;
  bottom: 0;
  left: 1.5rem;
  height: fit-content;
  margin: auto 0;
  z-index: 10;
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.5rem;
  border-radius: 999px;
`;

export const Item = styled(NavLink)`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  color: ${colors.text};
  background: transparent;
  transition: background 0.2s, color 0.2s;

  &:hover {
    background: ${colors.surfaceStrong};
  }

  &.active,
  &.active:hover {
    color: #111;
    background: rgba(255, 255, 255, 0.92);
  }
`;
