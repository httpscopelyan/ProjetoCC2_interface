import styled from "styled-components";
import { colors } from "../../shared/config/theme";

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  list-style: none;
`;

export const Item = styled.li<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.6rem 0.75rem;
  border-radius: 0.75rem;
  border-left: 3px solid ${({ $color }) => $color};
  background: rgba(255, 255, 255, 0.06);
`;

export const Icon = styled.span<{ $color: string }>`
  display: inline-flex;
  flex-shrink: 0;
  color: ${({ $color }) => $color};
`;

export const Text = styled.div`
  flex: 1;
  min-width: 0;
`;

export const Name = styled.p`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 0.78rem;
  font-weight: 500;
  color: ${colors.text};
`;

export const Time = styled.p`
  margin-top: 0.15rem;
  font-size: 0.68rem;
  color: ${colors.muted};
`;

export const Empty = styled.p`
  font-size: 0.78rem;
  color: ${colors.muted};
`;
