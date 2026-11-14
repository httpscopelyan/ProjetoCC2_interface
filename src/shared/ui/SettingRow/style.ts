import styled from "styled-components";
import { colors } from "../../config/theme";

export const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 0.9rem;
`;

export const IconBox = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 0.7rem;
  color: ${colors.text};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${colors.border};
`;

export const Text = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;
`;

export const Title = styled.span`
  font-size: 0.85rem;
  font-weight: 600;
`;

export const Description = styled.span`
  font-size: 0.72rem;
  line-height: 1.4;
  color: ${colors.muted};
`;

export const Control = styled.div`
  flex-shrink: 0;
`;
