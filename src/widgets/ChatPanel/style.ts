import styled, { keyframes } from "styled-components";
import { colors } from "../../shared/config/theme";
import { GlassPanel } from "../../shared/ui/GlassPanel/style";

const pulse = keyframes`
  0%, 80%, 100% { opacity: 0.25; transform: translateY(0); }
  40% { opacity: 1; transform: translateY(-3px); }
`;

export const Panel = styled(GlassPanel)`
  width: 100%;
  max-width: 760px;
  height: calc(100vh - 8rem);
  min-height: 28rem;
  margin: 0 auto;
`;

export const Head = styled.header`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

export const BotIcon = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.4rem;
  height: 2.4rem;
  border-radius: 50%;
  background: linear-gradient(135deg, #60a5fa, ${colors.accent});
  color: ${colors.text};
`;

export const HeadText = styled.div`
  flex: 1;

  strong {
    display: block;
    font-size: 0.9rem;
    font-weight: 600;
    color: ${colors.text};
  }

  span {
    font-size: 0.72rem;
    color: ${colors.muted};
  }
`;

export const Thread = styled.div`
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  overflow-y: auto;
  padding: 0.25rem 0.25rem 0.25rem 0;
  overscroll-behavior: contain;
`;

export const DayDivider = styled.p`
  align-self: center;
  padding: 0.15rem 0.7rem;
  border-radius: 999px;
  font-size: 0.68rem;
  color: ${colors.faint};
  background: rgba(255, 255, 255, 0.08);
`;

export const Message = styled.div<{ $user: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  align-items: ${({ $user }) => ($user ? "flex-end" : "flex-start")};
  max-width: 78%;
  align-self: ${({ $user }) => ($user ? "flex-end" : "flex-start")};
`;

export const Bubble = styled.p<{ $user: boolean }>`
  padding: 0.65rem 0.9rem;
  font-size: 0.84rem;
  line-height: 1.45;
  white-space: pre-wrap;
  overflow-wrap: anywhere;
  color: ${colors.text};
  background: ${({ $user }) => ($user ? colors.accent : "rgba(255, 255, 255, 0.12)")};
  border-radius: ${({ $user }) => ($user ? "1rem 1rem 0.3rem 1rem" : "1rem 1rem 1rem 0.3rem")};
`;

export const Time = styled.span`
  font-size: 0.64rem;
  color: ${colors.faint};
`;

export const Typing = styled.div`
  display: inline-flex;
  gap: 0.25rem;
  align-self: flex-start;
  padding: 0.75rem 0.9rem;
  border-radius: 1rem 1rem 1rem 0.3rem;
  background: rgba(255, 255, 255, 0.12);

  span {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    background: ${colors.text};
    animation: ${pulse} 1.2s ease-in-out infinite;
  }

  span:nth-child(2) {
    animation-delay: 0.15s;
  }

  span:nth-child(3) {
    animation-delay: 0.3s;
  }
`;

export const Suggestions = styled.div`
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
`;

export const Chip = styled.button`
  padding: 0.35rem 0.8rem;
  border-radius: 999px;
  font-size: 0.72rem;
  color: ${colors.text};
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${colors.border};
  transition: background 0.2s;

  &:hover:not(:disabled) {
    background: ${colors.surfaceStrong};
  }

  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

export const Composer = styled.form`
  display: flex;
  align-items: flex-end;
  gap: 0.6rem;
  padding: 0.5rem 0.6rem;
  border-radius: 1.2rem;
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid ${colors.border};
`;

export const Attach = styled.button`
  display: inline-flex;
  padding: 0.45rem;
  color: ${colors.muted};
`;

export const Field = styled.textarea`
  flex: 1;
  min-width: 0;
  max-height: 6rem;
  padding: 0.45rem 0;
  resize: none;
  font: inherit;
  font-size: 0.85rem;
  color: ${colors.text};
  background: transparent;
  border: 0;
  outline: none;

  &::placeholder {
    color: ${colors.faint};
  }
`;

export const SendButton = styled.button`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2.2rem;
  height: 2.2rem;
  border-radius: 50%;
  color: ${colors.text};
  background: ${colors.accent};
  transition: opacity 0.2s;

  &:disabled {
    opacity: 0.4;
    cursor: default;
  }
`;
