import styled from "styled-components";
import { colors } from "../../shared/config/theme";

export const List = styled.ol`
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 0.9rem;
  list-style: none;

  &::before {
    content: "";
    position: absolute;
    top: 0.4rem;
    bottom: 0.4rem;
    left: 0.28rem;
    width: 1px;
    background: ${colors.border};
  }
`;

export const Item = styled.li`
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
`;

export const Dot = styled.span<{ $color: string }>`
  z-index: 1;
  flex-shrink: 0;
  width: 0.6rem;
  height: 0.6rem;
  margin-top: 0.3rem;
  border-radius: 50%;
  background: ${({ $color }) => $color};
  box-shadow: 0 0 0 3px rgba(20, 20, 22, 0.9);
`;

export const Text = styled.div`
  display: flex;
  flex-direction: column;
  min-width: 0;
`;

export const Title = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
`;

export const Span = styled.span`
  font-size: 0.7rem;
  color: ${colors.muted};
`;

export const Empty = styled.p`
  font-size: 0.8rem;
  color: ${colors.muted};
`;
