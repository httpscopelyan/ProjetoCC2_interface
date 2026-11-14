import styled from "styled-components";
import { colors } from "../../shared/config/theme";

export const Icon = styled.span`
  display: inline-flex;
  color: ${colors.muted};
`;

export const Text = styled.p<{ $loading: boolean }>`
  font-size: 0.88rem;
  line-height: 1.55;
  opacity: ${({ $loading }) => ($loading ? 0.55 : 1)};
  transition: opacity 0.3s;
`;
