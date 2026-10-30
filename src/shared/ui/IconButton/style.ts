import styled from "styled-components";
import { colors } from "../../config/theme";
import { glassFlat } from "../GlassPanel/style";

export const Button = styled.button<{ $size: number; $active?: boolean }>`
  ${glassFlat}
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  color: ${colors.text};
  background: ${({ $active }) => ($active ? colors.surfaceStrong : "rgba(255, 255, 255, 0.12)")};
  transition: background 0.2s, transform 0.2s;

  &:hover {
    background: ${colors.surfaceStrong};
    transform: translateY(-1px);
  }
`;
