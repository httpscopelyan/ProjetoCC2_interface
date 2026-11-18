import styled from "styled-components";
import { colors } from "../../config/theme";
import { glass } from "../GlassPanel/style";

export const Panel = styled.div`
  ${glass}
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 30;
  width: 15.5rem;
  padding: 0.85rem;
  border-radius: 1rem;
  background: rgba(20, 22, 26, 0.82);
  opacity: 0;
  visibility: hidden;
  transform: translateY(-4px);
  transition: opacity 0.18s ease, transform 0.18s ease, visibility 0.18s;
  pointer-events: none;
  text-align: left;
`;

export const Wrapper = styled.span`
  position: relative;
  display: inline-flex;

  &:hover ${Panel}, &:focus-within ${Panel} {
    opacity: 1;
    visibility: visible;
    transform: translateY(0);
  }
`;

export const Trigger = styled.button`
  display: inline-flex;
  color: ${colors.faint};
  transition: color 0.2s;

  &:hover,
  &:focus-visible {
    color: ${colors.text};
  }
`;

export const Intro = styled.p`
  margin-bottom: 0.6rem;
  font-size: 0.72rem;
  line-height: 1.4;
  color: ${colors.muted};
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  list-style: none;
`;

export const Row = styled.li<{ $active: boolean }>`
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.3rem 0.45rem;
  border-radius: 0.6rem;
  background: ${({ $active }) => ($active ? "rgba(255, 255, 255, 0.12)" : "transparent")};
`;

export const Swatch = styled.span<{ $color: string }>`
  display: inline-flex;
  color: ${({ $color }) => $color};
`;

export const Text = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;

  strong {
    font-size: 0.74rem;
    font-weight: 600;
    color: ${colors.text};
  }

  span {
    font-size: 0.66rem;
    color: ${colors.muted};
  }

  em {
    margin-top: 0.1rem;
    font-size: 0.64rem;
    font-style: normal;
    line-height: 1.35;
    color: ${colors.faint};
  }
`;
