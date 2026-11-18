import styled, { keyframes } from "styled-components";

/* Só opacidade: qualquer transform no bloco desalinha o fundo desfocado dos cards
   (background-attachment: fixed), que apareceria nítido durante a entrada. */
const reveal = keyframes`
  from { opacity: 0; }
  to { opacity: 1; }
`;

export const Wrapper = styled.div`
  display: grid;
  min-width: 0;
  opacity: 0;

  &[data-revealed="true"] {
    animation: ${reveal} 0.4s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0s) both;
  }

  /* Ao terminar, a animação sai de cena: o fill-mode mantém um contexto de empilhamento
     que prenderia popovers e modais atrás dos blocos seguintes. */
  &[data-revealed="done"] {
    opacity: 1;
    animation: none;
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none !important;
  }
`;
