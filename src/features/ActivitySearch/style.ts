import styled from "styled-components";
import { colors } from "../../shared/config/theme";
import { glass } from "../../shared/ui/GlassPanel/style";
import { withAlpha } from "../../shared/lib/color";

export const Form = styled.form`
  ${glass}
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  padding: 1.25rem;
  border-radius: 1.25rem;
`;

export const Field = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.35rem 0.4rem 0.35rem 1rem;
  border: 1px solid ${colors.border};
  border-radius: 999px;
  background: rgba(0, 0, 0, 0.2);
  color: ${colors.muted};

  &:focus-within {
    border-color: ${colors.accent};
  }

  input {
    flex: 1;
    min-width: 0;
    font: inherit;
    font-size: 0.9rem;
    color: ${colors.text};
    background: transparent;
    border: 0;
    outline: none;
  }

  input::placeholder {
    color: ${colors.faint};
  }
`;

export const SubmitButton = styled.button`
  padding: 0.5rem 1.1rem;
  border-radius: 999px;
  font-size: 0.78rem;
  font-weight: 600;
  background: ${colors.accent};
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`;

export const Hint = styled.p`
  font-size: 0.72rem;
  color: ${colors.muted};
`;

export const Answer = styled.div<{ $color: string }>`
  display: flex;
  align-items: center;
  gap: 0.9rem;
  padding: 0.9rem 1rem;
  border: 1px solid ${({ $color }) => withAlpha($color, 0.45)};
  border-radius: 1rem;
  background: ${({ $color }) => withAlpha($color, 0.1)};
`;

export const Light = styled.span<{ $color: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 0.8rem;
  color: ${({ $color }) => $color};
  background: ${({ $color }) => withAlpha($color, 0.18)};
`;

export const AnswerText = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 0.15rem;
  min-width: 0;

  strong {
    font-size: 0.9rem;
  }

  span {
    font-size: 0.8rem;
    color: ${colors.muted};
  }
`;

export const Simulated = styled.span`
  font-size: 0.7rem;
  color: ${colors.faint};
`;

export const Verdict = styled.span<{ $color: string }>`
  flex-shrink: 0;
  font-size: 0.78rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;
