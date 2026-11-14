import { useState } from "react";
import { AnimatePresence, useReducedMotion } from "framer-motion";
import { useInterval } from "usehooks-ts";

import { useNews } from "../../entities/news/useNews";
import { Credit, Dot, Dots, Footer, Slide, SlideSummary, SlideTitle, Stage } from "./style";

const ROTATION_MS = 7000;

const NewsCarousel = () => {
  const items = useNews();
  const reduceMotion = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const current = items.length > 0 ? items[index % items.length] : null;
  useInterval(() => setIndex((value) => value + 1), paused || items.length < 2 ? null : ROTATION_MS);

  if (!current) return null;

  return (
    <Stage onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} aria-live="off">
      <AnimatePresence mode="wait" initial={false}>
        <Slide
          key={current.id}
          initial={reduceMotion ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={reduceMotion ? undefined : { opacity: 0, y: -8 }}
          transition={{ duration: 0.35 }}
        >
          <SlideTitle>
            {current.url ? (
              <a href={current.url} target="_blank" rel="noopener noreferrer">
                {current.title}
              </a>
            ) : (
              current.title
            )}
          </SlideTitle>
          <SlideSummary>
            {current.summary} · {current.source}
          </SlideSummary>
        </Slide>
      </AnimatePresence>
      <Footer>
        <Dots>
          {items.map((item, position) => (
            <Dot
              key={item.id}
              type="button"
              $active={position === index % items.length}
              aria-label={`Ir para: ${item.title}`}
              onClick={() => setIndex(position)}
            />
          ))}
        </Dots>
        <Credit>
          Notícias via{" "}
          <a href="https://www.gdeltproject.org" target="_blank" rel="noopener noreferrer">
            GDELT Project
          </a>
        </Credit>
      </Footer>
    </Stage>
  );
};

export default NewsCarousel;
