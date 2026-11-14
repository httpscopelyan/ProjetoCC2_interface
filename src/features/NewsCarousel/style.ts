import styled from "styled-components";
import { motion } from "framer-motion";
import { colors } from "../../shared/config/theme";

export const Stage = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  padding-top: 0.9rem;
  border-top: 1px solid ${colors.border};
`;

export const Slide = styled(motion.div)`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-height: 3.2rem;
`;

export const SlideTitle = styled.strong`
  font-size: 0.82rem;
  font-weight: 600;

  a {
    color: inherit;
    text-decoration: none;
  }

  a:hover {
    text-decoration: underline;
  }
`;

export const Footer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const Credit = styled.span`
  font-size: 0.65rem;
  color: ${colors.faint};

  a {
    color: inherit;
  }
`;

export const SlideSummary = styled.span`
  font-size: 0.76rem;
  line-height: 1.45;
  color: ${colors.muted};
`;

export const Dots = styled.div`
  display: flex;
  gap: 0.35rem;
`;

export const Dot = styled.button<{ $active: boolean }>`
  width: ${({ $active }) => ($active ? "1.1rem" : "0.4rem")};
  height: 0.4rem;
  border-radius: 999px;
  background: ${({ $active }) => ($active ? colors.text : colors.faint)};
  transition: width 0.25s, background 0.25s;
`;
