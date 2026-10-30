import styled from "styled-components";
import { colors } from "../../shared/config/theme";
import { glassFlat } from "../../shared/ui/GlassPanel/style";

export const ExportButton = styled.button`
  ${glassFlat}
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.5rem 1rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 500;
  color: ${colors.text};
  transition: background 0.2s;

  &:hover {
    background: ${colors.surfaceStrong};
  }
`;
