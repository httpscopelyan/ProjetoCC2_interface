import styled, { keyframes } from "styled-components";

const reveal = keyframes`
  from { opacity: 0; transform: translate3d(0, -28px, 0); }
  to { opacity: 1; transform: none; }
`;

export const Wrapper = styled.div`
  display: grid;
  min-width: 0;
  opacity: 0;

  &[data-revealed="true"] {
    animation: ${reveal} 0.7s cubic-bezier(0.22, 1, 0.36, 1) var(--reveal-delay, 0s) both;
  }

  @media (prefers-reduced-motion: reduce) {
    opacity: 1;
    animation: none !important;
  }
`;
