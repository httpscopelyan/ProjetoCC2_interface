import styled from "styled-components";
import { colors } from "../../shared/config/theme";

export const StatusText = styled.p`
  font-size: 0.75rem;
  color: ${colors.muted};
`;

export const Progress = styled.div`
  height: 0.35rem;
  overflow: hidden;
  border-radius: 999px;
  background: ${colors.surface};
`;

export const ProgressFill = styled.div`
  height: 100%;
  border-radius: inherit;
  background: ${colors.accent};
  transform-origin: left;
  transition: transform 0.3s ease;
`;
