import styled from "styled-components";
import { colors } from "../../config/theme";

export const Input = styled.input`
  appearance: none;
  flex-shrink: 0;
  position: relative;
  width: 2.5rem;
  height: 1.4rem;
  border-radius: 999px;
  background: ${colors.surfaceStrong};
  transition: background 0.2s;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    top: 0.2rem;
    left: 0.2rem;
    width: 1rem;
    height: 1rem;
    border-radius: 50%;
    background: ${colors.text};
    transition: transform 0.2s;
  }

  &:checked {
    background: ${colors.accent};
  }

  &:checked::after {
    transform: translateX(1.1rem);
  }

  &:focus-visible {
    outline: 2px solid ${colors.accent};
    outline-offset: 2px;
  }
`;
