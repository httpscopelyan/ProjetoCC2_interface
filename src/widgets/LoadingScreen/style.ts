import styled, { keyframes } from "styled-components";
import { colors } from "../../shared/config/theme";

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

export const Overlay = styled.div<{ $leaving: boolean }>`
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1.25rem;
  background: #141416;
  opacity: ${({ $leaving }) => ($leaving ? 0 : 1)};
  pointer-events: ${({ $leaving }) => ($leaving ? "none" : "auto")};
  transition: opacity 0.6s ease;
`;

export const Spinner = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4.5rem;
  height: 4.5rem;
  color: ${colors.text};
`;

export const Ring = styled.span`
  position: absolute;
  inset: 0;
  border: 2px solid ${colors.border};
  border-top-color: ${colors.accent};
  border-radius: 50%;
  animation: ${spin} 0.9s linear infinite;
`;

export const Caption = styled.p`
  font-size: 0.8rem;
  color: ${colors.muted};
`;
