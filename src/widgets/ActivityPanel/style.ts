import styled from "styled-components";
import { colors } from "../../shared/config/theme";
import { withAlpha } from "../../shared/lib/color";

export const List = styled.ul<{ $loading: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  list-style: none;
  opacity: ${({ $loading }) => ($loading ? 0.55 : 1)};
  transition: opacity 0.3s;
`;

export const Source = styled.span`
  margin-left: 0.4rem;
  padding: 0.1rem 0.45rem;
  border: 1px solid ${colors.border};
  border-radius: 999px;
  font-size: 0.62rem;
  font-weight: 500;
  color: ${colors.muted};
`;

export const Item = styled.li`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const Light = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2rem;
  height: 2rem;
  border-radius: 0.6rem;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => withAlpha($color, 0.16)};
  box-shadow: 0 0 12px ${({ $color }) => withAlpha($color, 0.35)};
  transition: color 0.4s, background 0.4s;
`;

export const Text = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  min-width: 0;
`;

export const Title = styled.span`
  font-size: 0.82rem;
  font-weight: 600;
`;

export const Reason = styled.span<{ $wrap: boolean }>`
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: ${({ $wrap }) => ($wrap ? "normal" : "nowrap")};
  font-size: 0.7rem;
  color: ${colors.muted};
`;

export const Verdict = styled.span<{ $color: string }>`
  flex-shrink: 0;
  font-size: 0.7rem;
  font-weight: 600;
  color: ${({ $color }) => $color};
`;

export const Empty = styled.p`
  font-size: 0.8rem;
  color: ${colors.muted};
`;
