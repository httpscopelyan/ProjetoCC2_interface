import styled from "styled-components";
import { colors } from "../../shared/config/theme";

export const Box = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  padding: 0.8rem 1rem;
  border: 1px solid ${colors.border};
  border-radius: 1rem;
  background: ${colors.surface};
`;

export const Title = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: ${colors.violet};
`;

export const Text = styled.p<{ $loading: boolean }>`
  font-size: 0.82rem;
  line-height: 1.45;
  color: ${colors.text};
  opacity: ${({ $loading }) => ($loading ? 0.55 : 1)};
  transition: opacity 0.3s;
`;
