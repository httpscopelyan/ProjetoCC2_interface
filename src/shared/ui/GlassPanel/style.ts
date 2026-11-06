import styled, { css } from "styled-components";
import { colors } from "../../config/theme";

export const glass = css`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.13), rgba(255, 255, 255, 0.05));
  border: 1px solid ${colors.border};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.18), 0 4px 16px rgba(0, 0, 0, 0.16);
`;

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
