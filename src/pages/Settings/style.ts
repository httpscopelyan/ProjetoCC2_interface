import styled from "styled-components";
import { colors } from "../../shared/config/theme";

export { Content } from "../Chat/style";

export const Intro = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
`;

export const Title = styled.h1`
  font-size: 1.6rem;
  font-weight: 700;
`;

export const Subtitle = styled.p`
  font-size: 0.85rem;
  color: ${colors.muted};
`;

export const TwoColumns = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 1rem;

  > * {
    display: grid;
  }

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`;
