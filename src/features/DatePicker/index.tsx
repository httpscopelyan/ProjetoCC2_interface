import { useEffect, useMemo, useRef, useState } from "react";
import { AnimatePresence } from "framer-motion";
import { CalendarDays, ChevronLeft, ChevronRight } from "lucide-react";

import IconButton from "../../shared/ui/IconButton";
import { isoDay } from "../../shared/lib/date";
import { useSensorControls, useSensorData } from "../../entities/sensor/context";
import { Anchor, Clear, Day, Footer, Grid, Month, Nav, Popover, Top, Weekday } from "./style";

const monthFormat = new Intl.DateTimeFormat("pt-BR", { month: "long", year: "numeric" });
const weekdayFormat = new Intl.DateTimeFormat("pt-BR", { weekday: "narrow" });
const weekdays = Array.from({ length: 7 }, (_, i) => weekdayFormat.format(new Date(2023, 0, 1 + i)));

const DatePicker = () => {
  const { day, setDay } = useSensorControls();
  const { availableDays } = useSensorData();
  const [open, setOpen] = useState(false);
  const [view, setView] = useState(() => new Date(new Date().getFullYear(), new Date().getMonth(), 1));
  const anchor = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointer = (e: MouseEvent) => {
      if (!anchor.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointer);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointer);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const today = isoDay(new Date());
  const available = useMemo(() => new Set(availableDays), [availableDays]);

  const year = view.getFullYear();
  const month = view.getMonth();
  const blanks = new Date(year, month, 1).getDay();
  const total = new Date(year, month + 1, 0).getDate();

  const shift = (delta: number) => setView(new Date(year, month + delta, 1));

  const pick = (iso: string) => {
    setDay(iso);
    setOpen(false);
  };

  return (
    <Anchor ref={anchor}>
      <IconButton icon={CalendarDays} label="Calendário" active={open || day !== null} onClick={() => setOpen((v) => !v)} />

      <AnimatePresence>
        {open && (
          <Popover
            initial={{ opacity: 0, scale: 0.94, y: -6 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: -6 }}
            transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            <Top>
              <Nav type="button" aria-label="Mês anterior" onClick={() => shift(-1)}>
                <ChevronLeft size={16} />
              </Nav>
              <Month>{monthFormat.format(view)}</Month>
              <Nav type="button" aria-label="Próximo mês" onClick={() => shift(1)}>
                <ChevronRight size={16} />
              </Nav>
            </Top>

            <Grid>
              {weekdays.map((label, i) => (
                <Weekday key={i}>{label}</Weekday>
              ))}
              {Array.from({ length: blanks }, (_, i) => (
                <span key={`b${i}`} />
              ))}
              {Array.from({ length: total }, (_, i) => {
                const iso = isoDay(new Date(year, month, i + 1));
                const enabled = available.has(iso) && iso <= today;
                return (
                  <Day
                    key={iso}
                    type="button"
                    disabled={!enabled}
                    aria-disabled={!enabled}
                    $selected={iso === day}
                    onClick={() => pick(iso)}
                  >
                    {i + 1}
                  </Day>
                );
              })}
            </Grid>

            {day && (
              <Footer>
                <Clear type="button" onClick={() => setDay(null)}>
                  Limpar
                </Clear>
              </Footer>
            )}
          </Popover>
        )}
      </AnimatePresence>
    </Anchor>
  );
};

export default DatePicker;
