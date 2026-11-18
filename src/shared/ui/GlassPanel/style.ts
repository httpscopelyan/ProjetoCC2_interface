import styled, { css } from "styled-components";
import { colors } from "../../config/theme";

/* Vidro translúcido sem backdrop-filter: o fundo do app é estático e escuro, então um fundo
   semitransparente entrega o mesmo visual sem o custo de GPU do blur em dezenas de elementos. */
export const glass = css`
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.08), rgba(255, 255, 255, 0.02)), rgba(20, 22, 28, 0.45);
  border: 1px solid ${colors.border};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 4px 16px rgba(0, 0, 0, 0.16);
`;

export const liquidGlass = css`
  background: rgba(20, 22, 28, 0.42);
  border: 1px solid rgba(255, 255, 255, 0.14);
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.2);
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
