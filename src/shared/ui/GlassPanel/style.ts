import styled, { css } from "styled-components";
import { colors } from "../../config/theme";
import blurredBackground from "../../../assets/background_blur.webp";

/* Vidro desfocado sem backdrop-filter: o fundo do app é uma imagem estática e fixa, então o
   "blur" vem de uma cópia já desfocada (pequena, 480px) presa à janela com o mesmo recorte e o
   mesmo escurecimento do fundo real. Ela se alinha ao que está atrás do card e custa só uma
   textura: nada é recalculado por quadro. */
const blurredBackdrop = (tint: string) => css`
  background-color: transparent;
  background-image:
    linear-gradient(${tint}, ${tint}),
    linear-gradient(to bottom, rgba(8, 9, 12, 0.35), rgba(8, 9, 12, 0.8)),
    url(${blurredBackground});
  background-attachment: scroll, fixed, fixed;
  background-size: auto, 100% 100%, cover;
  background-position: center;
  background-repeat: no-repeat;

  @media (pointer: coarse) {
    background-attachment: scroll;
  }
`;

export const glass = css`
  ${blurredBackdrop("rgba(20, 22, 28, 0.42)")}
  border: 1px solid ${colors.border};
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.14), 0 4px 16px rgba(0, 0, 0, 0.16);
`;

export const liquidGlass = css`
  ${blurredBackdrop("rgba(20, 22, 28, 0.38)")}
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
