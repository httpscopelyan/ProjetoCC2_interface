import { useEffect, useRef } from "react";
import type { CSSProperties, ReactNode } from "react";
import { useAppReady } from "../../../app/AppReady";
import { Wrapper } from "./style";

const BASE_DELAY_S = 0.05;
const STEP_S = 0.06;
const MAX_STAGGERED_ORDER = 6;

interface RevealProps {
  order?: number;
  children: ReactNode;
}

const Reveal = ({ order = 0, children }: RevealProps) => {
  const box = useRef<HTMLDivElement>(null);
  const ready = useAppReady();

  useEffect(() => {
    const element = box.current;
    if (!ready || !element) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        element.dataset.revealed = "true";
        observer.disconnect();
      },
      { threshold: 0.1 },
    );
    observer.observe(element);
    return () => observer.disconnect();
  }, [ready]);

  const delay = BASE_DELAY_S + Math.min(order, MAX_STAGGERED_ORDER) * STEP_S;
  return (
    <Wrapper ref={box} style={{ "--reveal-delay": `${delay}s` } as CSSProperties}>
      {children}
    </Wrapper>
  );
};

export default Reveal;
