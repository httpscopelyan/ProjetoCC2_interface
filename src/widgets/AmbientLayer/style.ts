import styled, { keyframes } from "styled-components";

const fall = keyframes`
  from { transform: translate3d(0, -12vh, 0); }
  to { transform: translate3d(-4vh, 112vh, 0); }
`;

const drift = keyframes`
  from { transform: translate3d(-45vw, 0, 0); }
  to { transform: translate3d(125vw, 0, 0); }
`;

export const Root = styled.div`
  position: fixed;
  inset: 0;
  z-index: -1;
  overflow: hidden;
  pointer-events: none;
`;

export const EdgeGlow = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(ellipse at center, transparent 45%, var(--ambient-base, transparent) 120%);
  transition: opacity 1.2s ease;
`;

export const Tint = styled.div`
  position: absolute;
  inset: 0;
  background-color: var(--ambient-hover, var(--ambient-base, transparent));
  opacity: 0.06;
  transition: background-color 0.7s ease;
`;

export const Darkness = styled.div`
  position: absolute;
  inset: 0;
  background: #000000;
  transition: opacity 1.5s ease;
`;

export const Particles =styled.div<{ $paused: boolean }>`
  position: absolute;
  inset: 0;
  contain: strict;

  > span {
    animation-play-state: ${({ $paused }) => ($paused ? "paused" : "running")};
  }
`;

export const Drop = styled.span`
  position: absolute;
  top: 0;
  width: 1.5px;
  border-radius: 1px;
  background: linear-gradient(to bottom, transparent, rgba(174, 200, 235, 0.7));
  animation: ${fall} linear infinite;
`;

export const Gust = styled.span`
  position: absolute;
  left: 0;
  height: 2px;
  border-radius: 2px;
  background: linear-gradient(to right, transparent, rgba(255, 255, 255, 0.22), transparent);
  animation: ${drift} linear infinite;
`;
