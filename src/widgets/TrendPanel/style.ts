import styled from "styled-components";
import { colors } from "../../shared/config/theme";

export const Stats = styled.dl`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 0.75rem;
`;

export const Stat = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.15rem;

  span {
    font-size: 0.7rem;
    color: ${colors.muted};
  }

  strong {
    font-size: 0.9rem;
    font-weight: 600;
  }
`;

export const Empty = styled.p`
  font-size: 0.8rem;
  color: ${colors.muted};
`;
