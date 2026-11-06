import { useLayoutEffect, useRef } from "react";
import type { ReactNode } from "react";
import { animate, useReducedMotion } from "framer-motion";
import type { AnimationPlaybackControls } from "framer-motion";
import { Wrapper } from "./style";

const ease = [0.22, 1, 0.36, 1] as const;
const BASE_DELAY = 0.1;
const STEP = 0.08;
const START_SCALE = 0.96;

interface RevealProps {
  order?: number;
  children: ReactNode;
}

const Reveal = ({ order = 0, children }: RevealProps) => {
  const box = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();

  useLayoutEffect(() => {
    const el = box.current;
    if (!el || reduceMotion) return;

    const park = (fromY: number) => {
      el.style.transform = `translateY(${fromY}px) scale(${START_SCALE})`;
    };
    const play = (fromY: number, delay: number) =>
      animate(el, { y: [fromY, 0], scale: [START_SCALE, 1] }, { duration: 0.95, ease, delay });

    let controls: AnimationPlaybackControls | undefined;
    let observer: IntersectionObserver | undefined;
    const { top, height } = el.getBoundingClientRect();

    if (top < window.innerHeight) {
      const fromY = -Math.max(top + height, 80);
      park(fromY);
      controls = play(fromY, BASE_DELAY + order * STEP);
    } else {
      park(60);
      observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry.isIntersecting) return;
          controls = play(60, 0);
          observer?.disconnect();
        },
        { threshold: 0.1 },
      );
      observer.observe(el);
    }

    return () => {
      observer?.disconnect();
      controls?.stop();
      el.style.transform = "";
    };
  }, [order, reduceMotion]);

  return <Wrapper ref={box}>{children}</Wrapper>;
};

export default Reveal;
