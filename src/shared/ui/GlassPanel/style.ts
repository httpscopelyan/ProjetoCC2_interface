import styled, { css } from "styled-components";
import { colors } from "../../config/theme";

export const glass = css`
  background: ${colors.surface};
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  border: 1px solid ${colors.border};
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.16);
`;

// Cheap variant for small chrome (buttons, pills): no backdrop-filter, so no extra backdrop snapshot.
export const glassFlat = css`
  background: rgba(255, 255, 255, 0.12);
  border: 1px solid ${colors.border};
`;

export const GlassPanel = styled.section`
  ${glass}
  display: flex;
  flex-direction: column;
  gap: 1rem;
  padding: 1.25rem;
  border-radius: 1.25rem;
  min-width: 0;
`;

export const PanelHeader = styled.header`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
`;

export const PanelTitle = styled.h3`
  font-size: 0.95rem;
  font-weight: 600;
  color: ${colors.text};
`;

export const PanelAction = styled.button`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.75rem;
  color: ${colors.muted};
  transition: color 0.2s;

  &:hover {
    color: ${colors.text};
  }
`;
