import styled from "styled-components";
import { Link } from "react-router-dom";
import { colors } from "../../shared/config/theme";
import { glassFlat } from "../../shared/ui/GlassPanel/style";

export const Content = styled.main`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  max-width: 900px;
  margin: 1.5rem auto 0;
`;

export const Top = styled.div`
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
`;

export const Back = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  margin-bottom: 0.4rem;
  font-size: 0.78rem;
  text-decoration: none;
  color: ${colors.muted};

  &:hover {
    color: ${colors.text};
  }
`;

export const Title = styled.h1`
  font-size: 1.75rem;
  font-weight: 600;
  color: ${colors.text};
`;

export const Filters = styled.div`
  display: flex;
  gap: 0.4rem;
  flex-wrap: wrap;
`;

export const Chip = styled.button<{ $active: boolean; $color?: string }>`
  ${glassFlat}
  padding: 0.35rem 0.85rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${({ $active }) => ($active ? "#111" : colors.text)};
  background: ${({ $active }) => ($active ? "rgba(255, 255, 255, 0.92)" : "rgba(255, 255, 255, 0.12)")};
  transition: background 0.2s, color 0.2s;
`;

export const DayHeading = styled.h2`
  font-size: 0.8rem;
  font-weight: 600;
  color: ${colors.muted};

  &::first-letter {
    text-transform: uppercase;
  }
`;

export const List = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
  list-style: none;
`;

export const Item = styled.li<{ $color: string }>`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.8rem 1rem;
  border-radius: 0.9rem;
  border-left: 3px solid ${({ $color }) => $color};
  background: rgba(255, 255, 255, 0.06);
`;

export const Icon = styled.span<{ $color: string }>`
  display: inline-flex;
  margin-top: 0.1rem;
  color: ${({ $color }) => $color};
`;

export const Text = styled.div`
  flex: 1;
  min-width: 0;

  strong {
    display: block;
    font-size: 0.85rem;
    font-weight: 600;
    color: ${colors.text};
  }

  p {
    margin-top: 0.2rem;
    font-size: 0.75rem;
    color: ${colors.muted};
  }
`;

export const Meta = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
  font-size: 0.68rem;
  color: ${colors.faint};
  white-space: nowrap;
`;

export const Empty = styled.p`
  font-size: 0.85rem;
  color: ${colors.muted};
`;
