import styled from "styled-components";
import { colors } from "../../config/theme";

export const Wrapper = styled.span<{ $size: number; $color: string }>`
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  border: 2px solid rgba(255, 255, 255, 0.35);
  font-size: ${({ $size }) => Math.round($size * 0.38)}px;
  font-weight: 600;
  color: ${colors.text};
`;

export const Status = styled.span`
  position: absolute;
  right: -2px;
  bottom: -2px;
  width: 25%;
  height: 25%;
  border-radius: 50%;
  background: ${colors.success};
  border: 2px solid #1c1c1e;
`;
